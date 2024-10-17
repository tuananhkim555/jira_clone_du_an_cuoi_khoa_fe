import React, { useEffect, useState } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import axios, { isAxiosError } from 'axios';
import { Pagination, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import NotificationMessage from '../../components/NotificationMessage';

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
  const projectsPerPage = 8;

  const API_BASE_URL = 'https://jiranew.cybersoft.edu.vn/api';
  const TOKEN_CYBERSOFT = import.meta.env.VITE_CYBERSOFT_TOKEN;
  const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

  useEffect(() => {
    fetchProjects();
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
      // Reverse the order of projects here
      setProjects(typedResponse.content.reverse());
      setTotalProjects(typedResponse.content.length);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects. Please try again later.');
    } finally {
      setIsLoading(false);
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
        // Perform the delete operation
        axios.delete(`${API_BASE_URL}/Project/deleteProject`, {
          params: { projectId },
          headers: {
            TokenCybersoft: TOKEN_CYBERSOFT,
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        })
        .then(() => {
          // Remove the deleted project from the state
          setProjects(projects.filter(project => project.id !== projectId));
          NotificationMessage({
            type: 'success',
            message: 'Project deleted successfully!'
          });
        })
        .catch((error) => {
          console.error('Error deleting project:', error);
          if (isAxiosError(error)) {
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

  const paginatedProjects = projects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

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
            <div className="flex flex-wrap">
              {project.members.map((member, index) => (
                <img
                  key={index}
                  src={member.avatar}
                  alt={member.name}
                  className="w-8 h-8 rounded-full mr-2 mb-2"
                  title={member.name}
                />
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button className="text-blue-500 hover:text-blue-700"><FaPencilAlt /></button>
            <button className="text-red-500 hover:text-red-700" onClick={() => deleteProject(project.id)}><FaTrash /></button>
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
            <div className="flex flex-wrap">
              {project.members.map((member, index) => (
                <img
                  key={index}
                  src={member.avatar}
                  alt={member.name}
                  className="w-8 h-8 rounded-full mr-2 mb-2"
                  title={member.name}
                />
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button className="text-blue-500 hover:text-blue-700"><FaPencilAlt /></button>
            <button className="text-red-500 hover:text-red-700" onClick={() => deleteProject(project.id)}><FaTrash /></button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDesktopView = () => (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Creator
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Members
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  {project.members.map((member, index) => (
                    <img
                      key={index}
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full"
                      title={member.name}
                    />
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900"><FaPencilAlt /></button>
                  <button className="text-red-600 hover:text-red-900" onClick={() => deleteProject(project.id)}><FaTrash /></button>
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
        <div className="mt-6 flex justify-center">
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
    </div>
  );
};

export default ProjectTable;
