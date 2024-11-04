import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { getProjectDetails, getProjectCategories, updateProjectDetails } from '../../api/api';
import NotificationMessage from '../../components/NotificationMessage';
import TitleGradient from '../../components/ui/TitleGradient';
import LoadingSpinner from '../../components/LoadingSpinner';
import Reveal from '../../components/Reveal';
import { FaEdit, FaSave } from 'react-icons/fa';
import AnimationSection from '../../components/ui/AnimationSection';
import TextAnimation from '../../components/ui/TextAnimation';

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

interface Category {
  id: number;
  projectCategoryName: string;
}

const ProjectEdit: React.FC = () => {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const notificationShownRef = useRef(false);

  useEffect(() => {
    const fetchProjectAndCategories = async () => {
      try {
        const [projectResponse, categoriesResponse] = await Promise.all([
          getProjectDetails(id!),
          getProjectCategories()
        ]);

        const projectData = projectResponse.data as any;
        const categoriesData = categoriesResponse.data as any;

        setProject(projectData.content);
        setCategories(categoriesData.content);
      } catch (error) {
        console.error('Error fetching data:', error);
        setNotification({ type: 'error', message: 'Failed to fetch project details or categories.' });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectAndCategories();
    }
  }, [id]);

  useEffect(() => {
    if (notification && !notificationShownRef.current) {
      notificationShownRef.current = true;
      // Hiển thị thông báo
      // ...

      // Reset sau khi thông báo đã được hiển thị
      return () => {
        notificationShownRef.current = false;
      };
    }
  }, [notification]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProject(prev => {
      if (!prev) return null;
      if (name === 'categoryId') {
        return {
          ...prev,
          projectCategory: {
            ...prev.projectCategory,
            id: parseInt(value),
            name: categories.find(cat => cat.id === parseInt(value))?.projectCategoryName || ''
          }
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleEditorChange = (content: string, editor: any) => {
    setProject(prev => prev ? { ...prev, description: content } : null);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project) return;

    try {
      const updateData = {
        id: project.id,
        projectName: project.projectName,
        creator: project.creator.id,
        description: project.description,
        categoryId: project.projectCategory.id.toString()
      };

      await updateProjectDetails(updateData);
      setNotification({ type: 'success', message: 'Project updated successfully' });
      setTimeout(() => navigate('/project'), 2000);
    } catch (error) {
      console.error('Error updating project:', error);
      setNotification({ type: 'error', message: 'Failed to update project. You can only update projects you created.' });
    }
  }, [project, navigate]);

  // Add this function to handle the cancel action
  const handleCancel = () => {
    navigate('/project');
  };

  console.log('ProjectEdit rendering'); // Thêm dòng này để kiểm tra

  if (loading) return <LoadingSpinner />;
  if (!project) return <div>Project not found</div>;

  return (
    <Reveal>
      <div className="max-w-4xl mx-auto p-4 mt-[80px]">
        {notification && (
          <NotificationMessage 
            type={notification.type} 
            message={notification.message} 
            key={`${notification.type}_${notification.message}`} // Thêm key prop
          />
        )}
        <AnimationSection>
        <div className="flex justify-center items-center mb-6">
          <FaEdit className="text-2xl mr-3 text-purple-800" />
          <TitleGradient>Edit Project</TitleGradient>
        </div>
        </AnimationSection>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <div className="w-3/4">
              <label htmlFor="projectName" className="block text-md font-medium text-gray-700 mb-1">
                <TextAnimation text='Project Name' />
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={project.projectName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 text-md p-1.5"
              />
            </div>
            <div className="w-1/4">
              <label htmlFor="projectId" className="block text-md font-medium text-gray-700 mb-1">
                <TextAnimation text='Project ID' />
              </label>
              <input
                type="text"
                id="projectId"
                value={project.id}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 text-md p-1.5"
              />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-md font-medium text-gray-700 mb-1">
              <TextAnimation text='Description' />
            </label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              value={project.description}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
              onEditorChange={handleEditorChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="categoryId" className="block text-md font-medium text-gray-700 mb-1">
              <TextAnimation text='Category' />
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={project.projectCategory.id}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50 text-md p-1.5"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.projectCategoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full px-8 py-2 bg-purple-950 text-white rounded-md hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-700 text-md font-medium transition duration-150 ease-in-out mt-2 hover:scale-[1.02] flex items-center justify-center"
            >
              <FaSave className="mr-2" />
              <span>Save Changes</span>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-1/4 px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-800 text-md font-medium transition duration-150 ease-in-out mt-2 bg-gradient-to-r from-purple-950 to-orange-700 hover:scale-[1.02]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Reveal>
  );
};

export default ProjectEdit;
