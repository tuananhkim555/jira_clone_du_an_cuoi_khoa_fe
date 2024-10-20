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
    fetchCategories();
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

  return (
    <Reveal>
      <div style={containerStyle}>
        <div className='flex justify-center items-center mb-6' style={{ marginTop: '30px' }}>
          <TitleGradient>Create Project</TitleGradient>
        </div>
        {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={sectionStyle}>
            <label htmlFor="projectName" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Project Name</label>
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
            <label htmlFor="description" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Description</label>
            <Editor
              apiKey='jkmuc93b4ohldjg0xu52nlis2f9zct68ps5nibbf0jl7q96z'
              init={{
                height: isMobile ? 180 : 300,
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
            <label htmlFor="categoryId" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Project Category</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.projectCategoryName}
                </option>
              ))}
            </select>
          </div>

          <div style={sectionStyle}>
            <label htmlFor="alias" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Alias</label>
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

          <button
            className='button-purple'
            disabled={isLoading}
            style={{ marginTop: '12px', padding: '8px 16px', fontSize: '16px' }}
          >
            {isLoading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </div>
    </Reveal>
  );
};

export default CreateProject;
