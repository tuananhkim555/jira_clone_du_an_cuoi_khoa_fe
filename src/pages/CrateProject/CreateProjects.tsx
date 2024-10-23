import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useMediaQuery } from 'react-responsive';
import '../../index.css';
import TitleGradient from '../../components/ui/TitleGradient';
import NotificationMessage from '../../components/NotificationMessage';
import Reveal from '../../components/Reveal';
import { FaPlus } from 'react-icons/fa';
import AnimationSection from '../../components/ui/AnimationSection';
import TextAnimation from '../../components/ui/TextAnimation';

interface ProjectData {
  projectName: string;
  description: string;
  categoryId: number;
  alias: string;
}

interface Category {
  id: number;
  projectCategoryName: string;
}


const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProjectData>({
    projectName: '',
    description: '',
    categoryId: 0,
    alias: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  const API_BASE_URL = 'https://jiranew.cybersoft.edu.vn/api';
  const TOKEN_CYBERSOFT = import.meta.env.VITE_CYBERSOFT_TOKEN;
  const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ProjectCategory`, {
        headers: {
          TokenCybersoft: TOKEN_CYBERSOFT,
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
      const data = response.data as { content: Category[] };
      setCategories(data.content);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'categoryId' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/Project/createProjectAuthorize`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json-patch+json',
            TokenCybersoft: TOKEN_CYBERSOFT,
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('Dự án đã được tạo thành công:', response.data);
        NotificationMessage({ type: 'success', message: 'Dự án đã được tạo thành công!' });
        navigate('/project', { state: { refresh: true } });
      }
    } catch (error) {
      console.error('Lỗi khi tạo dự án:', error);
      NotificationMessage({ type: 'error', message: 'Có lỗi xảy ra khi tạo dự án. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditorChange = (content: string, editor: any) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const containerStyle = {
    width: isMobile ? '100%' : isTablet ? '85%' : '900px',
    margin: '0 auto',
    padding: isMobile ? '12px' : '24px 0',
  };

  const inputStyle = {
    width: '100%',
    padding: '6px 10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: isMobile ? '13px' : '15px',
  };

  const sectionStyle = {
    marginBottom: '24px',
    color: '#4B5563',
  };

  const buttonStyle = {
    padding: '8px 16px',
    fontSize: '16px',
    borderRadius: '4px',
    height: '40px',
  };

  return (
    <Reveal>
      <div style={containerStyle}>
        <AnimationSection>
        <div className='flex justify-center items-center mb-6' style={{ marginTop: '50px' }}>
          <FaPlus className="text-3xl mr-3 text-purple-800 border-2 border-purple-800 rounded-full p-1" />
          <TitleGradient>Create Project</TitleGradient>
        </div>
        </AnimationSection>
        {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={sectionStyle}>
            <label htmlFor="projectName" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              <TextAnimation text='Project Name' />
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={sectionStyle}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            <TextAnimation text='Description' />
            </label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              init={{
                height: isMobile ? 200 : 280,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: isMobile
                  ? 'undo redo | bold italic | bullist numlist'
                  : 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
              onEditorChange={handleEditorChange}
              value={formData.description}
            />
          </div>

          <div style={sectionStyle}>
            <label htmlFor="categoryId" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              <TextAnimation text='Project Category' />
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">
                <TextAnimation text='Select category' />
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.projectCategoryName}
                </option>
              ))}
            </select>
          </div>

          <div style={sectionStyle}>
            <label htmlFor="alias" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              <TextAnimation text='Alias' />
            </label>
            <input
              type="text"
              id="alias"
              name="alias"
              value={formData.alias}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              className='bg-purple-950 w-full text-white font-bold flex items-center justify-center hover:scale-[1.02] transition-transform duration-200'
              disabled={isLoading}
              style={buttonStyle}
            >
              <FaPlus className="mr-2" />
              {isLoading ? 'Creating...' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/project')}
              className="w-1/4 m-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-950 text-md font-medium transition duration-150 ease-in-out bg-gradient-to-r from-purple-950 to-orange-700 hover:scale-105"
              style={buttonStyle}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Reveal>
  );
};

export default CreateProject;
