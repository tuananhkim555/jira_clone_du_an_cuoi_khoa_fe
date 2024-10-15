import React, { useEffect, useState } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import axios, { isAxiosError } from 'axios';

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

  const API_BASE_URL = 'https://jiranew.cybersoft.edu.vn/api';
  const TOKEN_CYBERSOFT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCBETiAxMSIsIkhldEhhblN0cmluZyI6IjE3LzAyLzIwMjUiLCJIZXRIYW5UaW1lIjoiMTczOTc1MDQwMDAwMCIsIm5iZiI6MTcwOTc0NDQwMCwiZXhwIjoxNzM5ODk4MDAwfQ.qvs2zsWDKR2CRt273FQIadSYJzZM-hCro_nsLVpa-Wg';
  const ACCESS_TOKEN = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJ0dWFuYW5oa2ltNTU1QGdtYWlsLmNvbSIsIm5iZiI6MTcyODk4MDI2NSwiZXhwIjoxNzI4OTgzODY1fQ.2zwQezu0GBf-sipyGnYEE_ENCFqORJMLkqmwnYjaswA';

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
      setProjects(typedResponse.content);
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

  const deleteProject = async (projectId: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        console.log('Deleting project with ID:', projectId);
        const response = await axios.delete(`${API_BASE_URL}/Project/deleteProject`, {
          params: { projectId },
          headers: {
            TokenCybersoft: TOKEN_CYBERSOFT,
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        });
        console.log('Delete response:', response);
        // Remove the deleted project from the state
        setProjects(projects.filter(project => project.id !== projectId));
        alert('Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error);
        if (isAxiosError(error)) {
          console.log('Error response:', error.response?.data);
        } else {
          console.log('Unexpected error:', error);
        }
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  const renderMobileView = (project: Project) => (
    <div key={project.id} className="mb-4 p-4 border rounded shadow-sm">
      <h3 className="font-bold">{project.projectName}</h3>
      <p>ID: {project.id}</p>
      <p>Category: {project.categoryName}</p>
      <p>Creator: {project.creator.name}</p>
      <div className="mt-2">
        <p>Members:</p>
        <div className="flex flex-wrap mt-1">
          {project.members.map((member, index) => (
            <img
              key={index}
              src={member.avatar}
              alt={member.name}
              className="w-6 h-6 rounded-full mr-1 mb-1"
              title={member.name}
            />
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-end space-x-2">
        <button className="text-blue-500"><FaPencilAlt /></button>
        <button className="text-red-500" onClick={() => deleteProject(project.id)}><FaTrash /></button>
      </div>
    </div>
  );

  const renderTabletView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Project
            </th>
            <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Category
            </th>
            <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Members
            </th>
            <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects && projects.length > 0 ? (
            projects.map((project: Project) => (
              <tr key={project.id} className="hover:bg-gray-100">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{project.projectName}</div>
                  <div className="text-sm text-gray-500">ID: {project.id}</div>
                  <div className="text-sm text-gray-500">Creator: {project.creator.name}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{project.categoryName}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap items-center space-x-1">
                    {project.members.map((member, index) => (
                      <img
                        key={index}
                        src={member.avatar}
                        alt={member.name}
                        className="w-6 h-6 rounded-full"
                        title={member.name}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-500"><FaPencilAlt /></button>
                    <button className="text-red-500" onClick={() => deleteProject(project.id)}><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Không có dự án nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderDesktopView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Project name
            </th>
            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Creator
            </th>
            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Members
            </th>
            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects && projects.length > 0 ? (
            projects.map((project: Project) => (
              <tr key={project.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{project.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{project.projectName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{project.categoryName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{project.creator.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {project.members.map((member, index) => (
                      <img
                        key={index}
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full"
                        title={member.name}
                      />
                    ))}
                    <button className="text-gray-600">+</button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-500"><FaPencilAlt /></button>
                    <button className="text-red-500" onClick={() => deleteProject(project.id)}><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Không có dự án nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      {isMobile && (
        <div>
          {projects && projects.length > 0 ? (
            projects.map(renderMobileView)
          ) : (
            <p className="text-center py-4">Không có dự án nào.</p>
          )}
        </div>
      )}
      {isTablet && renderTabletView()}
      {!isMobile && !isTablet && renderDesktopView()}
    </div>
  );
};

export default ProjectTable;
