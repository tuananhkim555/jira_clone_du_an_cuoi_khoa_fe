import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { getHeaders } from '../../config/env';

interface ProjectDetails {
  id: number;
  projectName: string;
  description: string;
  projectCategory: {
    id: number;
    name: string;
  };
  alias: string;
  creator: {
    id: number;
    name: string;
  };
}

const ProjectEdit: React.FC = () => {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        console.log('Fetching project with ID:', id);
        console.log('Headers:', getHeaders()); // Log headers
        const response = await axios.get(
          `https://jiranew.cybersoft.edu.vn/api/Project/getProjectDetail?id=${id}`,
          { headers: getHeaders() }
        );
        console.log('Response:', response.data); // Log response
        setProject(response.data.content);
      } catch (error) {
        console.error('Error fetching project:', error);
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
          } else if (error.request) {
            console.error('No response received:', error.request);
          } else {
            console.error('Error setting up request:', error.message);
          }
        }
        message.error('Failed to fetch project details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project) return;

    try {
      console.log('Updating project with ID:', project.id);
      const updateData = {
        id: project.id,
        projectName: project.projectName,
        creator: project.creator.id,
        description: project.description,
        categoryId: project.projectCategory.id.toString()
      };
      console.log('Update data:', updateData);
      console.log('Headers:', getHeaders());

      const response = await axios.put(
        `https://jiranew.cybersoft.edu.vn/api/Project/updateProject?projectId=${project.id}`,
        updateData,
        { headers: getHeaders() }
      );
      console.log('Update response:', response.data);
      message.success('Project updated successfully');
      navigate('/project');
    } catch (error) {
      console.error('Error updating project:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      message.error('Failed to update project');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Project Name</label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={project.projectName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={project.description}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
        </div>
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            id="categoryId"
            name="categoryId"
            value={project.projectCategory.name}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProjectEdit;
