import React, { useEffect, useState } from 'react';
import { FaPencilAlt, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { Pagination, Modal, message, Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import NotificationMessage from '../../components/NotificationMessage';
import { useNavigate } from 'react-router-dom';

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

const ProjectTable = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 640 && window.innerWidth < 1024);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [addMemberPosition, setAddMemberPosition] = useState({ top: 0, left: 0 });
  const projectsPerPage = 8;
  const navigate = useNavigate();

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
      setProjects(typedResponse.content.reverse());
      setTotalProjects(typedResponse.content.length);
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
      setUsers(response.data.content);
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
          } else {
            console.log('Unexpected error:', error);
          }
          NotificationMessage({
            type: 'error',
            message: 'Failed to delete project. Please try again.'
          });
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
    const rect = event.currentTarget.getBoundingClientRect();
    setAddMemberPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX
    });
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
        fetchProjects(); // Refresh projects to show new member
      } catch (error) {
        console.error('Error adding member:', error);
        NotificationMessage({
          type: 'error',
          message: 'Failed to add member. Please try again.'
        });
      }
    }
    setIsAddingMember(false);
  };

  const paginatedProjects = projects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  const renderMembers = (members: Project['members']) => {
    const visibleMembers = members.slice(0, 5);
    const extraMembers = members.length - 5;

    return (
      <div className="flex items-center space-x-1">
        {visibleMembers.map((member, index) => (
          <img
            key={index}
            src={member.avatar}
            alt={member.name}
            className="w-8 h-8 rounded-full"
            title={member.name}
          />
        ))}
        {extraMembers > 0 && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-orange-500 flex items-center justify-center text-xs font-medium text-white">
            +{extraMembers}
          </div>
        )}
      </div>
    );
  };

  const renderMobileView = () => (
    <div className="grid grid-cols-1 gap-4">
      {paginatedProjects.map((project) => (
        <div key={project.id} className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-bold text-lg mb-2">{project.projectName}</h3>
          <p className="text-sm text-gray-600">ID: {project.id}</p>
          <p className="text-sm text-gray-600">Category: {project.categoryName}</p>
          <p className="text-sm text-gray-600">Creator: {project.creator.name}</p>
          <div className="mt-3">
            <p className="text-sm font-semibold mb-1">Members:</p>
            <div className="flex flex-wrap items-center">
              <button className="text-blue-800 hover:text-blue-900 mr-2" onClick={(e) => handleAddMember(project.id, e)}><FaPlus /></button>
              {renderMembers(project.members)}
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button className="bg-purple-800 text-white rounded-md p-1 hover:bg-purple-900 shadow-sm" onClick={() => handleEditProject(project.id)}><FaPencilAlt size={18} /></button>
            <button className="bg-red-500 text-white rounded-md p-1 hover:bg-red-700 shadow-sm" onClick={() => deleteProject(project.id)}><FaTrash size={18} /></button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTabletView = () => (
    <div className="grid grid-cols-2 gap-4">
      {paginatedProjects.map((project) => (
        <div key={project.id} className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-bold text-lg mb-2">{project.projectName}</h3>
          <p className="text-sm text-gray-600">ID: {project.id}</p>
          <p className="text-sm text-gray-600">Category: {project.categoryName}</p>
          <p className="text-sm text-gray-600">Creator: {project.creator.name}</p>
          <div className="mt-3">
            <p className="text-sm font-semibold mb-1">Members:</p>
            <div className="flex flex-wrap items-center">
              <button className="text-blue-600 hover:text-blue-800 mr-2" onClick={(e) => handleAddMember(project.id, e)}><FaPlus /></button>
              {renderMembers(project.members)}
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button className="bg-purple-800 text-white rounded-md p-2 hover:bg-purple-900 shadow-sm" onClick={() => handleEditProject(project.id)}><FaPencilAlt size={14} /></button>
            <button className="bg-red-500 text-white rounded-md p-2 hover:bg-red-700 shadow-sm" onClick={() => deleteProject(project.id)}><FaTrash size={14} /></button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDesktopView = () => (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-purple-950 via-orange-900 to-purple-700 text-white font-semibold">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Project name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Creator
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Members
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedProjects.map((project: Project) => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.projectName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.categoryName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.creator.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-1">
                  <button className="text-blue-600 hover:text-blue-800 mr-2" onClick={(e) => handleAddMember(project.id, e)}><FaPlus /></button>
                  {renderMembers(project.members)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button className="bg-purple-800 text-white rounded-md p-2 hover:bg-purple-900 shadow-sm" onClick={() => handleEditProject(project.id)}><FaPencilAlt size={14} /></button>
                  <button className="bg-red-500 text-white rounded-md p-2 hover:bg-red-700 shadow-sm" onClick={() => deleteProject(project.id)}><FaTrash size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading projects...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto mt-[100px]">
        {isMobile && renderMobileView()}
        {isTablet && renderTabletView()}
        {!isMobile && !isTablet && renderDesktopView()}
        <div className="mt-6 flex justify-end">
          <Pagination
            current={currentPage}
            total={totalProjects}
            pageSize={projectsPerPage}
            onChange={handlePageChange}
            showSizeChanger={false}
            className="pagination-custom"
          />
        </div>
      </div>
      {isAddingMember && (
        <div
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
            style={{ width: '200px' }}
            placeholder="Select a user to add"
            onChange={handleMemberSelect}
            onBlur={() => setIsAddingMember(false)}
          >
            {users.map(user => (
              <Select.Option key={user.userId} value={user.userId}>
                {user.name}
              </Select.Option>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
};

export default ProjectTable;
