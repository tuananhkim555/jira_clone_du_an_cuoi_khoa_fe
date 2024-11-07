/* eslint-disable no-unused-vars */
import project1 from "../../assets/Duanphim.png";
import project2 from "../../assets/Shoptuananh.png";
import project3 from "../../assets/Imoublog.png";
import project4 from "../../assets/FigmaMovie.png";
import project5 from "../../assets/Samarblog.png";
import project6 from "../../assets/aiportfolio2.png";
import { AiOutlineGithub, AiOutlineProject, AiOutlineEdit } from "react-icons/ai";
import { FaPlus, FaTrash, FaAccusoft } from "react-icons/fa";
import Reveal from "../../common/components/Reveal";
import TitleGradient from "../../common/components/ui/TitleGradient";
import React, { useState, useEffect, useCallback } from 'react';
import LoadingSniper from '../../common/components/LoadingSpinner';
import { Pagination, Input, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../../styles/pagination.css';
import UploadProject from './UploadProject';
import { fetchProjects, deleteProject } from './PageLogic';
import { Project } from '../../common/api/types';
import NotificationMessage from '../../common/components/NotificationMessage';
import AnimationSection from '../../common/components/ui/AnimationSection';
import TextAnimation from "../../common/components/ui/TextAnimation";
import EditProject from './EditProject';
import { getAdminStatus } from "../../utils/Admin";

const initialProjects: Project[] = [
  {
    id: 1,
    img: project1,
    title: "Project #1",
    description: "This is a UI project for a movie streaming website, built using React.js.",
    links: {
      site: "https://webxemphimtuananh.vercel.app",
      github: "https://github.com/tuananhkim555/webxemphimtuananh",
    },
  },
  {
    id: 2,
    img: project2,
    title: "Project #2",
    description: "This is an e-commerce shop interface built with a fullstack approach using Next.js.",
    links: {
      site: "https://shoptuananh.vercel.app",
      github: "https://github.com/tuananhkim555/shoshop",
    },
  },
  {
    id: 3,
    img: project3,
    title: "Project #3",
    description: "UI Imouz for frontend development using HTML, CSS, JS",
    links: {
      site: "https://tuananhkim555.github.io/Imouz/",
      github: "https://github.com/tuananhkim555/Imouz",
    },
  },
  {
    id: 4,
    img: project4,
    title: "Figma #1",
    description: "UI for Figma Design Project",
    links: {
      site: "https://www.figma.com/design/rm0mzwxFF3b2zxrlKPVJL4/Project-Movie-Ticket?t=RJIkeThjsaKa4OL3-0",
      github: "#",
    },
  },
  {
    id: 5,
    img: project5,
    title: "Project #5",
    description: "UI for frontend development using HTML, CSS, JS.",
    links: {
      site: "https://tuananhkim555.github.io/SamarProject",
      github: "https://github.com/tuananhkim555/SamarProject",
    },
  },
  {
    id: 6,
    img: project6,
    title: "Project #6",
    description: "UI for frontend development using ReactJS.",
    links: {
      site: "#",
      github: "#",
    },
  },
];

const Pages = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(initialProjects);
  const [totalProjects, setTotalProjects] = useState(initialProjects.length);
  const projectsPerPage = 4;
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | undefined>(undefined);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const callapi = useCallback(async () => {
    try {
      const data = await fetchProjects();
      console.log(data);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to fetch projects' });
    }
  }, []);

  useEffect(() => {
    callapi();
  }, [callapi])

  useEffect(() => {
    const filtered = projects.filter(project =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
    setCurrentPage(1);
  }, [searchTerm, projects]);

  if (isLoading) {
    return <LoadingSniper />;
  }

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Remove the error notification when changing pages
    setNotification(null);
  };

  const showUploadModal = () => {
    setIsUploadModalVisible(true);
    // Clear any existing notification
    setNotification(null);
  };

  const handleUploadModalCancel = () => {
    setIsUploadModalVisible(false);
    // Clear any existing notification
    setNotification(null);
  };

  const handleProjectSubmit = (newProject: Project) => {
    setProjects([...projects, newProject]);
    setFilteredProjects([...filteredProjects, newProject]);
    setTotalProjects(totalProjects + 1);
    setIsUploadModalVisible(false);
  };

  const showEditModal = (project: Project) => {
    setProjectToEdit(project);
    setIsEditModalVisible(true);
    // Clear any existing notification
    setNotification(null);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setProjectToEdit(null);
    // Clear any existing notification
    setNotification(null);
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    // Update the project in your state or send to API
    const updatedProjects = projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    );
    setProjects(updatedProjects);
    setFilteredProjects(updatedProjects);
    setIsEditModalVisible(false);
    setProjectToEdit(null);
    setNotification({ type: 'success', message: 'Project updated successfully.' });
  };

  const handleEdit = (project: Project) => {
    if (!getAdminStatus()) {
      setNotification({ type: 'error', message: 'You do not have permission to edit projects.' });
      return;
    }
    showEditModal(project);
  };

  const showDeleteConfirmModal = (id: number | undefined) => {
    if (!id) {
      setNotification({ type: 'error', message: 'Invalid project ID.' });
      return;
    }
    if (!getAdminStatus()) {
      setNotification({ type: 'error', message: 'You do not have permission to delete projects.' });
      return;
    }
    setProjectToDelete(id);
    setIsDeleteModalVisible(true);
    // Clear any existing notification
    setNotification(null);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject(projectToDelete);
      const updatedProjects = projects.filter(project => project.id !== projectToDelete);
      setProjects(updatedProjects);
      setFilteredProjects(updatedProjects);
      setTotalProjects(totalProjects - 1);
      setNotification({ type: 'success', message: 'Project deleted successfully.' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Unable to delete project. Please try again.' });
    }
    setIsDeleteModalVisible(false);
    setProjectToDelete(undefined);
  };

  return (
    <div className="max-w-[1000px] mx-auto p-4 md:my-16 mt-16 overflow-x-hidden overflow-y-hidden" id="pages">
      {notification && (
        <NotificationMessage type={notification.type} message={notification.message} />
      )}
      <div className="flex items-center mb-6 justify-between">
        <AnimationSection>
        <div className="flex items-center">
          <AiOutlineProject className="text-3xl text-purple-800 mr-2" />
          <TitleGradient>Deploy</TitleGradient>
        </div>
        </AnimationSection>
        <div className="flex items-center">
          <Input
            placeholder="Search projects"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 200 }}
            suffix={
              <SearchOutlined
                style={{
                  color: '#31004c',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              />
            }
          />
          <div 
            className="ml-2 p-2 bg-[#31004c] rounded-full cursor-pointer flex items-center"
            onClick={showUploadModal}
          >
            <FaPlus className="text-white mr-1 text-lg" />
            <span className="text-white text-sm">Upload</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {currentProjects.map((project) => (
          <Reveal key={project.id}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 h-[280px] relative">
              <img
                src={project.img}
                alt={project.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-3 h-[56px] flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-600 mb-1 truncate flex items-center">
                    <FaAccusoft className="mr-1" />
                    <TextAnimation text={project.title} />
                  </h3>
                  <p className="text-gray-600 mb-1 text-sm line-clamp-2">{project.description}
                  </p> 
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2 items-center">
                    <a
                      href={project.links.site}
                      className="px-3 py-1 bg-[#31004c] text-gray-200 rounded text-sm hover:bg-purple-900 transition duration-300"
                    >
                      View Site
                    </a>
                    <a
                      href={project.links.github}
                      className="p-1 bg-gradient-to-r from-purple-900 to-orange-700 text-gray-200 rounded hover:from-purple-800 hover:to-orange-600 transition duration-300"
                    >
                      <AiOutlineGithub size={16} />
                    </a>
                  </div>
                  {getAdminStatus() && (
                    <div className="flex space-x-2 items-center">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-1 bg-purple-950 text-white rounded hover:bg-purple-800 transition duration-300"
                      >
                        <AiOutlineEdit size={16} />
                      </button>
                      <button
                        onClick={() => showDeleteConfirmModal(project.id)}
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <Pagination
          current={currentPage}
          total={filteredProjects.length}
          pageSize={projectsPerPage}
          onChange={handlePageChange}
          className="pagination-container"
        />
      </div>
      <Modal
        title="Upload Project"
        visible={isUploadModalVisible}
        onCancel={handleUploadModalCancel}
        footer={null}
      >
        <UploadProject onClose={handleUploadModalCancel} onSubmit={handleProjectSubmit} />
      </Modal>
      <Modal
        title="Confirm Deletion"
        visible={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          // Clear any existing notification
          setNotification(null);
        }}
        okButtonProps={{ className: 'custom-button-outline' }}
        cancelButtonProps={{ className: 'custom-button-outline' }}
      >
        <p>Are you sure you want to delete this project?</p>
      </Modal>
      <Modal
        title="Edit Project"
        visible={isEditModalVisible}
        onCancel={handleEditModalCancel}
        footer={null}
      >
        {projectToEdit && (
          <EditProject
            project={projectToEdit}
            onClose={handleEditModalCancel}
            onSubmit={handleProjectUpdate}
          />
        )}
      </Modal>
    </div>
  );
};

export default Pages;
