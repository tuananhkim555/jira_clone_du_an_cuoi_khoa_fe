import axios from 'axios';
import { ProjectData, Category } from './typeCreate';
import api from '../../api';

const API_BASE_URL = 'https://jiranew.cybersoft.edu.vn/api';
const TOKEN_CYBERSOFT = import.meta.env.VITE_CYBERSOFT_TOKEN;
const local_token_login = localStorage.getItem("authToken") || '';

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get<{ content: Category[] }>(`${API_BASE_URL}/ProjectCategory`, {
      headers: {
        TokenCybersoft: TOKEN_CYBERSOFT,
        Authorization: `Bearer ${local_token_login}`,
      },
    });
    return response.data.content;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories. Please try again later.');
  }
};

export const createProject = async (formData: ProjectData): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/Project/createProjectAuthorize`,
      formData,
      {
        headers: {
          'Content-Type': 'application/json-patch+json',
          TokenCybersoft: TOKEN_CYBERSOFT,
          Authorization: `Bearer ${local_token_login}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project. Please try again later.');
  }
};

export const getAllProjects = async (): Promise<any[]> => {
  try {
    const response = await api.get('/Project/getAllProject');
    return response.data.content;
  } catch (error) {
    console.error('Error fetching all projects:', error);
    throw new Error('Failed to fetch projects. Please try again later.');
  }
};
