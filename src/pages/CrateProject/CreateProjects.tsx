import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { useMediaQuery } from '@mui/material';
import { FaPlus, FaProjectDiagram, FaAlignLeft, FaLayerGroup, FaHashtag } from 'react-icons/fa';
import { fetchCategories, createProject } from './CreateProject';
import { ProjectData, Category } from './typeCreate';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import '../../index.css';
import TitleGradient from '../../common/components/ui/TitleGradient';
import NotificationMessage from '../../common/components/NotificationMessage';
import Reveal from '../../common/components/Reveal';
import AnimationSection from '../../common/components/ui/AnimationSection';
import TextAnimation from '../../common/components/ui/TextAnimation';
import TinyMCE from '../../common/components/Tinymce/Tinymce';

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
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:900px)');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategoriesData();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const fetchCategoriesData = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
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
      const response = await createProject(formData);
      NotificationMessage({ type: 'success', message: 'Project created successfully!' });
      navigate('/project', { state: { refresh: true } });
    } catch (error) {
      NotificationMessage({ type: 'error', message: 'An error occurred while creating the project. Please try again.' });
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
      <div className={`container mx-auto ${isMobile ? 'px-4' : 'px-8'}`} style={{ maxWidth: '1000px' }}>
        <AnimationSection>
        <div className='flex justify-center items-center mb-6' style={{ marginTop: '80px' }}>
          <FaPlus className="text-3xl mr-3 text-purple-800 border-2 border-purple-800 rounded-full p-1" />
          <TitleGradient>Create Project</TitleGradient>
        </div>
        </AnimationSection>
        {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={sectionStyle}>
            <label htmlFor="projectName" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: 'bold' }}>
              <FaProjectDiagram className="mr-2" />
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
            <label htmlFor="description" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: 'bold' }}>
              <FaAlignLeft className="mr-2" />
              <TextAnimation text='Description' />
            </label>
            <TinyMCE value={formData.description} onChange={handleEditorChange} />
          </div>

          <div style={sectionStyle}>
            <label htmlFor="categoryId" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: 'bold' }}>
              <FaLayerGroup className="mr-2" />
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
            <label htmlFor="alias" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontWeight: 'bold' }}>
              <FaHashtag className="mr-2" />
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
