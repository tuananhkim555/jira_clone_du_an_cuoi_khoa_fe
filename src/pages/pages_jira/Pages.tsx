/* eslint-disable no-unused-vars */
import project1 from "../../assets/Duanphim.png";
import project2 from "../../assets/Shoptuananh.png";
import project3 from "../../assets/Imoublog.png";
import project4 from "../../assets/FigmaMovie.png";
import project5 from "../../assets/Samarblog.png";
import project6 from "../../assets/aiportfolio2.png";
import { AiOutlineGithub, AiOutlineProject } from "react-icons/ai";
import { FaPlus, FaTrash } from "react-icons/fa";
import Reveal from "../../components/Reveal";
import TitleGradient from "../../components/ui/TitleGradient";
import React, { useState, useEffect, useCallback } from 'react';
import LoadingSniper from '../../components/LoadingSpinner';
import { Pagination, Input, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../../styles/pagination.css';
import UploadProject from './UploadProject';
import axios from 'axios';
import { getAdminStatus } from '../../utils/Admin';
import NotificationMessage from '../../components/NotificationMessage';
import AnimationSection from '../../components/ui/AnimationSection';
import TextAnimation from "../../components/ui/TextAnimation";

interface Project {
  id?: number;
  img: string;
  title: string;
  description: string;
  links: {
    site: string;
    github: string;
  };
}

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

const Portfolio = () => {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const callapi = useCallback(async () => {
    const result = await axios.get(`http://localhost:3069/get-data`)
    console.log(result.data);
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
  };

  const handleUploadModalCancel = () => {
    setIsUploadModalVisible(false);
  };

  const handleProjectSubmit = (newProject: Project) => {
    setProjects([...projects, newProject]);
    setFilteredProjects([...filteredProjects, newProject]);
    setTotalProjects(totalProjects + 1);
    setIsUploadModalVisible(false);
  };

  const showDeleteConfirmModal = (id: number | undefined) => {
    if (!id) return;
    if (!getAdminStatus()) {
      setNotification({ type: 'error', message: 'You do not have permission to delete projects.' });
      return;
    }
    setProjectToDelete(id);
    setIsDeleteModalVisible(true);
    // Remove the error notification when showing delete modal
    setNotification(null);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;

    try {
      await axios.delete(`http://your-api-endpoint/projects/${projectToDelete}`);
      const updatedProjects = projects.filter(project => project.id !== projectToDelete);
      setProjects(updatedProjects);
      setFilteredProjects(updatedProjects);
      setTotalProjects(totalProjects - 1);
      setNotification({ type: 'success', message: 'Project deleted successfully.' });
    } catch (error) {
      console.error('Error deleting project:', error);
      setNotification({ type: 'error', message: 'Unable to delete project. Please try again.' });
    }
    setIsDeleteModalVisible(false);
    setProjectToDelete(undefined);
  };

  return (
    <div className="max-w-[1000px] mx-auto p-4 md:my-16 overflow-x-hidden overflow-y-hidden" id="portfolio">
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
                  <h3 className="text-base font-semibold text-gray-600 mb-1 truncate">
                    <TextAnimation text={project.title} />
                  </h3>
                  <p className="text-gray-600 mb-1 text-sm line-clamp-2">{project.description}
                  </p> 
                </div>
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
              </div>
              {getAdminStatus() && (
                <button
                  onClick={() => showDeleteConfirmModal(project.id)}
                  className="absolute bottom-3 right-3 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300"
                >
                  <FaTrash size={14} />
                </button>
              )}
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
          // Remove the error notification when canceling delete
          setNotification(null);
        }}
        okButtonProps={{ className: 'custom-button-outline' }}
        cancelButtonProps={{ className: 'custom-button-outline' }}
      >
        <p>Are you sure you want to delete this project?</p>
      </Modal>
    </div>
  );
};

export default Portfolio;
