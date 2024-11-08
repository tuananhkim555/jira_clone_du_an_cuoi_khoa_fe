import axios from 'axios';
import NotificationMessage from '../../common/components/NotificationMessage';

// Types
export interface Project {
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

export interface User {
  userId: number;
  name: string;
  avatar: string;
}

interface UserResponse {
  content: {
    userId: number;
    name: string;
    avatar: string;
  }[];
}

// API instance
const api = axios.create({
  baseURL: 'https://jiranew.cybersoft.edu.vn/api',
  headers: {
    TokenCybersoft: import.meta.env.VITE_CYBERSOFT_TOKEN,
    Authorization: `Bearer ${localStorage.getItem("authToken")}`
  }
});

// API Functions
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await api.get('/Project/getAllProject');
    const typedResponse = response.data as { content: Project[] };
    return typedResponse.content.reverse();
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<UserResponse>('/Users/getUser');
    if (response.data && response.data.content) {
      return response.data.content.map((user) => ({
        userId: user.userId,
        name: user.name,
        avatar: user.avatar
      }));
    }
    throw new Error('Invalid user data format');
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

export const deleteProject = async (projectId: number): Promise<void> => {
  try {
    await api.delete(`/Project/deleteProject`, {
      params: { projectId },
    });
  } catch (error) {
    if (error instanceof axios.AxiosError && error.response?.status === 403) {
      throw new Error('Permission denied: Only project creator can delete projects');
    }
    throw new Error('Failed to delete project');
  }
};

export const addMemberToProject = async (projectId: number, userId: number): Promise<void> => {
  try {
    await api.post('/Project/assignUserProject', {
      projectId,
      userId
    });
  } catch (error) {
    if (error instanceof axios.AxiosError && error.response?.status === 403) {
      throw new Error('Permission denied: Only project creator can add members');
    }
    throw new Error('Failed to add member');
  }
};

export const removeMemberFromProject = async (projectId: number, userId: number): Promise<void> => {
  try {
    await api.post('/Project/removeUserFromProject', {
      projectId,
      userId
    });
  } catch (error) {
    if (error instanceof axios.AxiosError && error.response?.status === 403) {
      throw new Error('Permission denied: Only project creator can remove members');
    }
    throw new Error('Failed to remove member');
  }
};

// Helper Functions
export const handleApiError = (error: unknown, defaultMessage: string): void => {
  if (error instanceof axios.AxiosError) {
    const errorMessage = error.response?.data?.message || defaultMessage;
    NotificationMessage({
      type: 'error',
      message: errorMessage
    });
  } else {
    NotificationMessage({
      type: 'error',
      message: defaultMessage
    });
  }
};
