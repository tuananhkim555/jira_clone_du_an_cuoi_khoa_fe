import React, { useEffect, useState, useRef } from 'react';
import { FaPencilAlt, FaTrash, FaPlus, FaTimes, FaSearch, FaHashtag, FaProjectDiagram, FaLayerGroup, FaUserTie } from 'react-icons/fa';
import axios from 'axios';
import { Pagination, Modal, message, Select, Tooltip, Input, Popover, Checkbox, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import NotificationMessage from '../../components/NotificationMessage';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TitleGradient from '../../components/ui/TitleGradient';
import Reveal from '../../components/Reveal';
import LoadingSpinner from '../../components/LoadingSpinner';
import styled from 'styled-components';


interface Project {
  id: number;
  projectName: string;
  categoryName: string;
  creator: {
    id: number;
    name: string;
  };
  members: {
    userId: number;
    name: string;
    avatar: string;
  }[];
}

interface User {
  userId: number;
  name: string;
  avatar: string;
}

interface ApiResponse {
  content: Project[];
}

const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #5b21b6; /* purple-800 */
    border-color: #5b21b6; /* purple-800 */
  }

  &:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: #5b21b6; /* purple-800 */
  }
`;

const SearchButton = styled(Button)`
  @media (max-width: 1023px) {
    &:hover {
      color: #5b21b6 !important; /* purple-800 cho text */
      border-color: #5b21b6 !important; /* purple-800 cho border */
    }
  }
`;

const StyledPagination = styled(Pagination)`
  .ant-pagination-item-active {
    border-color: #3b0764 !important; /* purple-950 */
    a {
      color: #3b0764 !important; /* purple-950 */
    }
  }
  .ant-pagination-item:hover {
    border-color: #3b0764 !important; /* purple-950 */
    a {
      color: #3b0764 !important; /* purple-950 */
    }
  }
  .ant-pagination-prev:hover .ant-pagination-item-link,
  .ant-pagination-next:hover .ant-pagination-item-link {
    border-color: #3b0764 !important; /* purple-950 */
    color: #3b0764 !important; /* purple-950 */
  }
`;

const ProjectTable = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 640 && window.innerWidth < 1024);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [addMemberPosition, setAddMemberPosition] = useState({ top: 0, left: 0 });
  const [showMemberList, setShowMemberList] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCreators, setSelectedCreators] = useState<number[]>([]);
  const [modalFilteredProjects, setModalFilteredProjects] = useState<Project[]>([]);
  const [isSearchPopoverVisible, setIsSearchPopoverVisible] = useState(false);
  const projectsPerPage = 7;
  const navigate = useNavigate();
  const addMemberRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = 'https://jiranew.cybersoft.edu.vn/api';
  const TOKEN_CYBERSOFT = import.meta.env.VITE_CYBERSOFT_TOKEN;
  const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/Project/getAllProject`, {
        headers: {
          TokenCybersoft: TOKEN_CYBERSOFT,
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
      const typedResponse = response.data as { content: Project[] };
      const sortedProjects = typedResponse.content.reverse();
      setProjects(sortedProjects);
      setAllProjects(sortedProjects);
      setModalFilteredProjects(sortedProjects);
      setTotalProjects(sortedProjects.length);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Users/getUser`, {
        headers: {
          TokenCybersoft: TOKEN_CYBERSOFT,
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
      const typedResponse = response.data as { content: User[] };
      setUsers(typedResponse.content);
      setFilteredUsers(typedResponse.content);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { confirm } = Modal;

  const deleteProject = (projectId: number) => {
    confirm({
      title: 'Are you sure you want to delete this project?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        axios.delete(`${API_BASE_URL}/Project/deleteProject`, {
          params: { projectId },
          headers: {
            TokenCybersoft: TOKEN_CYBERSOFT,
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        })
        .then(() => {
          setProjects(projects.filter(project => project.id !== projectId));
          NotificationMessage({
            type: 'success',
            message: 'Project deleted successfully!'
          });
        })
        .catch((error) => {
          console.error('Error deleting project:', error);
          if (axios.isAxiosError(error)) {
            console.log('Error response:', error.response?.data);
            if (error.response?.status === 403) {
              NotificationMessage({
                type: 'error',
                message: 'You do not have permission to delete this project. Only the project creator can delete it.'
              });
            } else {
              NotificationMessage({
                type: 'error',
                message: 'Failed to delete project. Please try again.'
              });
            }
          } else {
            console.log('Unexpected error:', error);
            NotificationMessage({
              type: 'error',
              message: 'An unexpected error occurred. Please try again.'
            });
          }
        });
      },
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditProject = (projectId: number) => {
    navigate(`/project/edit/${projectId}`);
  };

  const handleAddMember = (projectId: number, event: React.MouseEvent) => {
    setSelectedProjectId(projectId);
    setIsAddingMember(true);
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    let top = rect.bottom + scrollTop;
    let left = rect.left + scrollLeft;

    // Kiểm tra kích thước màn hình và điều chỉnh vị trí
    if (window.innerWidth >= 1024) {
      // Desktop: dịch sang trái 350px
      left -= 350;
    } else if (window.innerWidth >= 640 && window.innerWidth < 1024) {
      // Tablet: dịch lên trên 300px
      top += 10;
      left -= 100;
    }else if(window.innerWidth < 640){
      top -= 50;
    }

    // Đảm bảo popup không vượt quá cạnh trái của màn hình
    if (left < 0) {
      left = 0;
    }

    // Đảm bảo popup không vượt quá cạnh phải của màn hình
    const popupWidth = 200; // Giả sử chiều rộng của popup là 400px
    if (left + popupWidth > window.innerWidth) {
      left = window.innerWidth - popupWidth - 10; // 10px margin
    }

    // Đảm bảo popup không vượt quá cạnh trên của màn hình
    if (top < 0) {
      top = rect.top + scrollTop + rect.height + 10; // Hiển thị dưới button nếu không đủ chỗ phía trên
    }

    setAddMemberPosition({ top, left });
  };

  const handleMemberSelect = async (userId: number) => {
    if (selectedProjectId) {
      try {
        await axios.post(
          `${API_BASE_URL}/Project/assignUserProject`,
          {
            projectId: selectedProjectId,
            userId: userId
          },
          {
            headers: {
              TokenCybersoft: TOKEN_CYBERSOFT,
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }
        );
        NotificationMessage({
          type: 'success',
          message: 'Member added successfully!'
        });
        // Update the project in the current state instead of fetching all projects
        const updatedProjects = projects.map(project => {
          if (project.id === selectedProjectId) {
            const newMember = users.find(user => user.userId === userId);
            if (newMember) {
              return {
                ...project,
                members: [...project.members, {
                  userId: newMember.userId,
                  name: newMember.name,
                  avatar: newMember.avatar
                }]
              };
            }
          }
          return project;
        });
        setProjects(updatedProjects);
        setAllProjects(updatedProjects);
      } catch (error) {
        console.error('Error adding member:', error);
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          NotificationMessage({
            type: 'error',
            message: 'You do not have permission to add members to this project. Only the project creator can add members.'
          });
        } else {
          NotificationMessage({
            type: 'error',
            message: 'Failed to add member. Please try again.'
          });
        }
      }
    }
    setIsAddingMember(false);
  };

  const handleRemoveMember = async (projectId: number, userId: number) => {
    confirm({
      title: 'Are you sure you want to remove this member?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        axios.post(
          `${API_BASE_URL}/Project/removeUserFromProject`,
          {
            projectId: projectId,
            userId: userId
          },
          {
            headers: {
              TokenCybersoft: TOKEN_CYBERSOFT,
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }
        )
        .then(() => {
          NotificationMessage({
            type: 'success',
            message: 'Member removed successfully!'
          });
          // Update the project in the current state instead of fetching all projects
          const updatedProjects = projects.map(project => {
            if (project.id === projectId) {
              return {
                ...project,
                members: project.members.filter(member => member.userId !== userId)
              };
            }
            return project;
          });
          setProjects(updatedProjects);
          setAllProjects(updatedProjects);
        })
        .catch((error) => {
          console.error('Error removing member:', error);
          if (axios.isAxiosError(error) && error.response?.status === 403) {
            NotificationMessage({
              type: 'error',
              message: 'You do not have permission to remove members from this project. Only the project creator can remove members.'
            });
          } else {
            NotificationMessage({
              type: 'error',
              message: 'Failed to remove member. Please try again.'
            });
          }
        });
      },
    });
  };

  const paginatedProjects = projects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  const renderMembers = (project: Project) => {
    const visibleMembers = project.members.slice(0, 5);
    const extraMembers = project.members.length - 5;

    return (
      <div className='flex items-center justify-center'>
        <Tooltip
          title={
            <div className="max-h-60 max-w-52 overflow-y-auto rounded-md">
              <div className="text-white font-bold mb-2 text-center">Members</div>
              <div className="justify-around  text-gray-300 text-xs mb-2">
                <span className="m-3">ID</span>
                <span className="m-2">Avatar</span>
                <span className="m-2">Name</span>
          
               
              </div>
              {project.members.map((member) => (
                <div key={member.userId} className="flex justify-between items-center mb-2 p-2">
                  <span className="text-gray-400 text-xs mr-2 w-8">{member.userId}</span>
                  <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full mr-2" />
                  <span className="text-gray-200 w-20 truncate">{member.name}</span>
                  <button onClick={() => handleRemoveMember(project.id, member.userId)} className="text-white hover:text-red-300 ml-2 bg-red-600 rounded-full p-1">
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          }
          trigger="hover"
        >
          <div className="flex items-center">
            {visibleMembers.map((member, index) => (
              <img
                key={index}
                src={member.avatar}
                alt={member.name}
                className="w-8 h-8 rounded-full cursor-pointer border-2 border-white -ml-2 first:ml-0"
              />
            ))}
            {extraMembers > 0 && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-800 to-orange-700 flex items-center justify-center text-xs font-medium text-white cursor-pointer border-2 border-white -ml-2">
                +{extraMembers}
              </div>
            )}
          </div>
        </Tooltip>
      </div>
    );
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const renderAddMemberButton = (projectId: number) => (
    <Tooltip title="Add or search members">
      <button 
        className="text-purple-900 hover:text-orange-600 mr-2 p-1 border rounded-full relative" 
        onClick={(e) => handleAddMember(projectId, e)}
      >
        <FaPlus size={12} />
      </button>
    </Tooltip>
  );

  const handleMobileTabletSearch = (value: string, column: string) => {
    setSearchTerm(value);
    setSearchColumn(column);
    const filtered = allProjects.filter(project => {
      switch (column) {
        case 'id':
          return project.id.toString().includes(value);
        case 'projectName':
          return project.projectName.toLowerCase().includes(value.toLowerCase());
        case 'categoryName':
          return project.categoryName.toLowerCase().includes(value.toLowerCase());
        case 'creator':
          return project.creator.name.toLowerCase().includes(value.toLowerCase());
        default:
          return false;
      }
    });
    setProjects(filtered);
    setTotalProjects(filtered.length);
    setCurrentPage(1);
  };

  const renderMobileTabletSearchPopover = () => {
    const content = (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-2 rounded-lg shadow-lg bg-white"
        style={{ width: '350px' }}
      >
        <Select
          style={{ width: '100%', marginBottom: 8 }}
          placeholder="Select search category"
          onChange={(value) => setSearchColumn(value)}
          size="large"
        >
          <Select.Option value="id">ID</Select.Option>
          <Select.Option value="projectName">Project Name</Select.Option>
          <Select.Option value="categoryName">Category</Select.Option>
          <Select.Option value="creator">Creator</Select.Option>
        </Select>
        <Input.Search
          placeholder={`Search by ${searchColumn || 'selected category'}`}
          onChange={(e) => handleMobileTabletSearch(e.target.value, searchColumn)}
          onSearch={() => {
            handleMobileTabletSearch(searchTerm, searchColumn);
            setIsSearchPopoverVisible(false);
          }}
          style={{ width: '100%'}}
          size="large"
          enterButton={
            <Button 
              style={{ 
                backgroundColor: '#6b21a8', 
                color: 'white',
                border: 'none',
              }}
            >
              OK
            </Button>
          }
        />
      </motion.div>
    );

    return (
      <Popover 
        content={content} 
        trigger="click" 
        placement="bottomLeft"
        visible={isSearchPopoverVisible}
        onVisibleChange={setIsSearchPopoverVisible}
      >
        <SearchButton 
          icon={<FaSearch />} 
          size="large" 
          className={`mb-4 text-lg px-6 py-3 flex items-center justify-center bg-gradient-to-r from-purple-950 to-orange-700 text-white ${isTablet ? 'w-2/4' : 'w-full'} max-w-md mx-auto`}
          onClick={() => setIsSearchPopoverVisible(true)}
        >
          <span className="ml-2">Search Projects</span>
        </SearchButton>
      </Popover>
    );
  };

  const handleCreateProject = () => {
    navigate('/create');
  };

  const renderMobileView = () => (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex flex-col items-center space-y-4">
        {renderMobileTabletSearchPopover()}
        <button
          onClick={handleCreateProject}
          className="bg-purple-950 hover:bg-purple-900 text-white font-bold p-3 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center w-12 h-12"
        >
          <FaPlus size={20} />
        </button>
      </div>
      {paginatedProjects.map((project) => (
        <div key={project.id} className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-purple-800 to-orange-700 text-transparent bg-clip-text cursor-pointer" onClick={() => navigate(`/board/${project.id}`)}>{project.projectName}</h3>
          <p className="text-sm text-gray-600">ID: {project.id}</p>
          <p className="text-sm text-gray-600">Category: {project.categoryName}</p>
          <p className="text-sm text-gray-600">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              <span className="text-green-600 font-semibold">{project.creator.name}</span>
            </span>
          </p>
          <div className="mt-3">
            <p className="text-sm font-semibold mb-1">Members:</p>
            <div className="flex flex-wrap items-center">
              {renderAddMemberButton(project.id)}
              {renderMembers(project)}
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button className="bg-purple-950 text-white rounded-md p-2 hover:bg-purple-900 shadow-sm" onClick={() => handleEditProject(project.id)}><FaPencilAlt size={14} /></button>
            <button className="bg-gradient-to-r from-purple-800 to-orange-700 text-white rounded-md p-2 hover:from-purple-900 hover:to-orange-800 shadow-sm" onClick={() => deleteProject(project.id)}><FaTrash size={14} /></button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTabletView = () => (
    <div>
      <div className="flex flex-col items-center space-y-4 mb-6">
        {renderMobileTabletSearchPopover()}
        <button
          onClick={handleCreateProject}
          className="bg-purple-950 hover:bg-purple-900 text-white font-bold p-3 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center w-12 h-12"
        >
          <FaPlus size={20} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {paginatedProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-purple-800 to-orange-700 text-transparent bg-clip-text cursor-pointer" onClick={() => navigate(`/board/${project.id}`)}>{project.projectName}</h3>
            <p className="text-sm text-gray-600">ID: {project.id}</p>
            <p className="text-sm text-gray-600">Category: {project.categoryName}</p>
            <p className="text-sm text-gray-600">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                <span className="text-green-600 font-semibold">{project.creator.name}</span>
              </span>
            </p>
            <div className="mt-3">
              <p className="text-sm font-semibold mb-1">Members:</p>
              <div className="flex flex-wrap items-center">
                {renderAddMemberButton(project.id)}
                {renderMembers(project)}
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button className="bg-purple-950 text-white rounded-md p-2 hover:bg-purple-900 shadow-sm" onClick={() => handleEditProject(project.id)}><FaPencilAlt size={14} /></button>
              <button className="bg-gradient-to-r from-purple-800 to-orange-700 text-white rounded-md p-2 hover:from-purple-900 hover:to-orange-800 shadow-sm" onClick={() => deleteProject(project.id)}><FaTrash size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const handleSearch = (value: string, column: string) => {
    setSearchTerm(value);
    setSearchColumn(column);
    const filtered = allProjects.filter(project => {
      switch (column) {
        case 'id':
          return project.id.toString().includes(value);
        case 'projectName':
          return project.projectName.toLowerCase().includes(value.toLowerCase());
        case 'categoryName':
          return project.categoryName.toLowerCase().includes(value.toLowerCase());
        case 'creator':
          return project.creator.name.toLowerCase().includes(value.toLowerCase());
        default:
          return false;
      }
    });
    setModalFilteredProjects(filtered);
  };

  const handleSubmit = () => {
    let filteredProjects = allProjects;
    
    if (selectedCategories.length > 0) {
      filteredProjects = filteredProjects.filter(project => selectedCategories.includes(project.categoryName));
    }
    
    if (selectedCreators.length > 0) {
      filteredProjects = filteredProjects.filter(project => selectedCreators.includes(project.creator.id));
    }
    
    if (selectedProjects.length > 0) {
      filteredProjects = filteredProjects.filter(project => selectedProjects.includes(project.id));
    }
    
    setProjects(filteredProjects);
    setTotalProjects(filteredProjects.length);
    setCurrentPage(1);
    setSelectedProjects([]);
    setSelectedCategories([]);
    setSelectedCreators([]);
    setSearchTerm('');
  };

  const handleReset = () => {
    setSelectedProjects([]);
    setSelectedCategories([]);
    setSelectedCreators([]);
    setSearchTerm('');
    setModalFilteredProjects(allProjects);
  };

  const renderSearchPopover = (column: string) => {
    const content = (
      <div>
        <Input.Search
          placeholder={`Search by ${column}`}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value, column)}
          style={{ width: 200, marginBottom: 10 }}
        />
        <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: 10 }}>
          {column === 'categoryName' ? (
            ['Dự án web', 'Dự án phần mềm', 'Dự án di động'].map(category => (
              <div key={category} style={{ marginBottom: 5 }}>
                <StyledCheckbox
                  checked={selectedCategories.includes(category)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories([...selectedCategories, category]);
                    } else {
                      setSelectedCategories(selectedCategories.filter(c => c !== category));
                    }
                  }}
                >
                  {category}
                </StyledCheckbox>
              </div>
            ))
          ) : column === 'creator' ? (
            Array.from(new Set(allProjects.map(project => project.creator.id))).map(creatorId => {
              const creator = allProjects.find(project => project.creator.id === creatorId)?.creator;
              return (
                <div key={creatorId} style={{ marginBottom: 5 }} className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  <StyledCheckbox
                    checked={selectedCreators.includes(creatorId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCreators([...selectedCreators, creatorId]);
                      } else {
                        setSelectedCreators(selectedCreators.filter(id => id !== creatorId));
                      }
                    }}
                  >
                    <span className="text-green-600">{creator?.name}</span>
                  </StyledCheckbox>
                </div>
              );
            })
          ) : (
            modalFilteredProjects.map(project => (
              <div key={project.id} style={{ marginBottom: 5 }}>
                <StyledCheckbox
                  checked={selectedProjects.includes(project.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProjects([...selectedProjects, project.id]);
                    } else {
                      setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                    }
                  }}
                >
                  {String(project[column as keyof Project])}
                </StyledCheckbox>
              </div>
            ))
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleReset}>Reset</Button>
          <Button style={{ border: 'none', backgroundColor: '#6b21a8', color: 'white'}} onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    );

    return (
      <Popover content={content} trigger="click" placement="bottomLeft">
        <span className="cursor-pointer hover:text-purple-700 flex items-center">
          {column === 'id' && <FaHashtag className="mr-2" />}
          {column === 'projectName' && <FaProjectDiagram className="mr-2" />}
          {column === 'categoryName' && <FaLayerGroup className="mr-2" />}
          {column === 'creator' && <FaUserTie className="mr-2" />}
          {column === 'projectName' ? 'Projects' : column === 'categoryName' ? 'Category' : column.charAt(0).toUpperCase() + column.slice(1)}
        </span>
      </Popover>
    );
  };

  const renderPagination = () => (
    <div className="mt-6 flex justify-end">
      <StyledPagination
        current={currentPage}
        total={totalProjects}
        pageSize={projectsPerPage}
        onChange={handlePageChange}
        showSizeChanger={false}
      />
    </div>
  );

  const renderDesktopView = () => (
    <div>
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleCreateProject}
          className="bg-purple-950 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
        >
          <FaPlus className="mr-2" />
          <span>Create Project</span>
        </button>
      </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gradient-to-r from-[#2e004d] via-purple-950 to-orange-800 text-white font-semibold">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                {renderSearchPopover('id')}
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                {renderSearchPopover('projectName')}
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                {renderSearchPopover('categoryName')}
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                {renderSearchPopover('creator')}
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                Members
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProjects.map((project: Project) => (
              <tr key={project.id} className="hover:bg-gray-100">
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{project.id}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-semibold bg-gradient-to-r from-purple-800 to-orange-700 text-transparent bg-clip-text cursor-pointer" onClick={() => navigate(`/board/${project.id}`)}>
                  <div className="max-w-xs truncate">{project.projectName}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="max-w-xs truncate">{project.categoryName}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    <span className="text-green-600 font-semibold max-w-xs truncate">{project.creator.name}</span>
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    {renderAddMemberButton(project.id)}
                    {renderMembers(project)}
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="bg-purple-950 text-white rounded-md p-2 hover:bg-purple-900 shadow-sm" onClick={() => handleEditProject(project.id)}><FaPencilAlt size={14} /></button>
                    <button 
                      className="bg-gradient-to-r from-purple-800 to-orange-700 text-white rounded-md p-2 hover:opacity-90 shadow-sm" 
                      onClick={() => deleteProject(project.id)}
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner/>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <Reveal>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto mt-[30px]">
        <div className="mb-[30px] flex justify-center items-center">
          <FaProjectDiagram className="text-3xl mr-3 text-purple-800" />
          <TitleGradient>Project Management</TitleGradient>
        </div>
        {isMobile && renderMobileView()}
        {isTablet && renderTabletView()}
        {!isMobile && !isTablet && renderDesktopView()}
        {(isMobile || isTablet) && renderPagination()}
      </div>
      {isAddingMember && (
        <div
          ref={addMemberRef}
          style={{
            position: 'absolute',
            top: `${addMemberPosition.top}px`,
            left: `${addMemberPosition.left}px`,
            zIndex: 1000,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '10px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        >
          <Select
            showSearch
            style={{ width: '200px' }}
            placeholder="Search and select user"
            optionFilterProp="children"
            onChange={handleMemberSelect}
            onSearch={handleSearchChange}
            filterOption={false}
            onBlur={() => setIsAddingMember(false)}
          >
            {filteredUsers.map(user => (
              <Select.Option key={user.userId} value={user.userId}>
                {user.name}
              </Select.Option>
            ))}
          </Select>
        </div>
      )}
    </div>
    </Reveal>
  );
};

export default ProjectTable;
