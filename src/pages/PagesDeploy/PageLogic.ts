import axios from 'axios';
import { Project } from '../../common/api/types';

export const fetchProjects = async () => {
  try {
    const result = await axios.get('http://localhost:3069/get-data');
    return result.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const deleteProject = async (projectId: number) => {
  try {
    await axios.delete(`http://your-api-endpoint/projects/${projectId}`);
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
