import axios from 'axios';
import { Project } from './PagesType';

export const fetchProjects = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3069';
    const result = await axios.get(`${apiUrl}/get-data`);
    return result.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const deleteProject = async (projectId: number) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3069';
    await axios.delete(`${apiUrl}/projects/${projectId}`);
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
};
