import { getProjectById, getAllProjects, getProjectCategories, getAllUsers, createTask, getAllStatuses, getAllPriorities, getAllTaskTypes } from '../../api';
import axios, { AxiosError } from 'axios';

interface ApiResponse<T> {
  data: {
    content?: T;
  };
}

interface ProjectDetails {
  lstTask: {
    lstTaskDeTail: any[];
    statusId: string;
    statusName: string;
    alias: string;
  }[];
  members: any[];
  creator: {
    id: number;
    name: string;
  };
  id: number;
  projectName: string;
  description: string;
  projectCategory: {
    id: number;
    name: string;
  };
  alias: string;
}

export const fetchProjects = async () => {
  try {
    const response = await getAllProjects() as ApiResponse<any[]>;
    if (response.data && response.data.content && Array.isArray(response.data.content)) {
      return response.data.content;
    } else {
      console.error('Invalid response format for projects');
      return [];
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const fetchProjectDetails = async (projectId: string): Promise<ProjectDetails | null> => {
  try {
    const response = await getProjectById(projectId) as ApiResponse<ProjectDetails>;
    if (response.data && response.data.content) {
      return response.data.content;
    } else {
      console.error('Invalid response format for project details');
      return null;
    }
  } catch (error) {
    console.error('Error fetching project details:', error);
    return null;
  }
};

export const fetchAllData = async () => {
  try {
    const [categoriesResponse, usersResponse, statusesResponse, prioritiesResponse, taskTypesResponse] = await Promise.all([
      getProjectCategories(),
      getAllUsers(),
      getAllStatuses(),
      getAllPriorities(),
      getAllTaskTypes()
    ]) as [ApiResponse<any[]>, ApiResponse<any[]>, ApiResponse<any[]>, ApiResponse<any[]>, ApiResponse<any[]>];
    
    return {
      categories: categoriesResponse.data.content || [],
      users: usersResponse.data.content || [],
      statuses: statusesResponse.data.content || [],
      priorities: prioritiesResponse.data.content || [],
      taskTypes: taskTypesResponse.data.content || []
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      categories: [],
      users: [],
      statuses: [],
      priorities: [],
      taskTypes: []
    };
  }
};

export const createNewTask = async (taskData: any) => {
  try {
    const response = await createTask(taskData);
    if (response && response.data && 'content' in response.data) {
      return response.data.content;
    }
    throw new Error('Invalid response format');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Error creating task:', axiosError.response.data);
        throw new Error((axiosError.response.data as any).message || 'Failed to create task');
      }
    }
    console.error('Error creating task:', error);
    throw error;
  }
};
