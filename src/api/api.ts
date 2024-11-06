import axios from 'axios';

const API_BASE_URL = 'https://jiranew.cybersoft.edu.vn/api';
const TOKEN_CYBERSOFT = import.meta.env.VITE_CYBERSOFT_TOKEN;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    TokenCybersoft: TOKEN_CYBERSOFT,
  }
});

// Add request interceptor to dynamically get token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized error - could redirect to login or refresh token
      localStorage.removeItem("authToken");
    }
    return Promise.reject(error);
  }
);

export const getProjectById = (projectId: string) => {
  return api.get(`/Project/getProjectDetail?id=${projectId}`);
};

export const getAllProjects = () => {
  return api.get('/Project/getAllProject');
};

export const getProjectCategories = () => {
  return api.get('/ProjectCategory');
};

export const getAllStatuses = () => {
  return api.get('/Status/getAll').then(response => {
    return response;
  });
};

export const getAllPriorities = () => {
  return api.get('/Priority/getAll').then(response => {
    return response;
  });
};

export const getAllTaskTypes = () => {
  return api.get('/TaskType/getAll').then(response => {
    return response;
  });
};

export const assignUserTask = (taskId: number, userId: number) => {
  return api.post('/Project/assignUserTask', { taskId, userId });
};

export const deleteUser = (userId: number) => {
  return api.delete(`/Users/deleteUser?id=${userId}`);
};

export const editUser = (userData: any) => {
  return api.put('/Users/editUser', userData);
};

export const getAllUsers = () => {
  return api.get('/Users/getUser').then(response => {
    return response;
  });
};

// Define the interface for task data structure
interface TaskData {
  alias: string;
  description: string;
  originalEstimate: number;
  priorityId: number;
  projectId: number;
  reporterId: number;
  statusId: string;
  taskId?: number; // Optional for creation
  taskName: string;
  timeTrackingRemaining: number;
  timeTrackingSpent: number;
  typeId: number;
  listUserAsign?: number[]; // Optional user assignments
}

export const createTask = async (taskData: TaskData) => {
  try {
    const response = await api.post('/Project/createTask', {
      alias: taskData.alias,
      description: taskData.description,
      originalEstimate: Number(taskData.originalEstimate),
      priorityId: Number(taskData.priorityId),
      projectId: Number(taskData.projectId),
      reporterId: Number(taskData.reporterId),
      statusId: taskData.statusId,
      taskName: taskData.taskName,
      timeTrackingRemaining: Number(taskData.timeTrackingRemaining),
      timeTrackingSpent: Number(taskData.timeTrackingSpent),
      typeId: Number(taskData.typeId),
      listUserAsign: taskData.listUserAsign || []
    });
    return response.data;
  } catch (error) {
    console.error('Error in createTask API call:', error);
    throw error;
  }
};

export const updateProject = (projectData: any) => {
  return api.put(`/Project/updateProject`, projectData);
};

export const getTaskDetail = async (taskId: string) => {
  try {
    const response = await api.get(`/Project/getTaskDetail`, {
      params: {
        taskId: Number(taskId)
      }
    });
    return response.data.content;
  } catch (error) {
    console.error('Error getting task detail:', error);
    throw error;
  }
};

export const updateTask = async (taskData: TaskData) => {
  try {
    const response = await api.post('/Project/updateTask', {
      alias: taskData.alias,
      description: taskData.description,
      originalEstimate: Number(taskData.originalEstimate),
      priorityId: Number(taskData.priorityId),
      projectId: Number(taskData.projectId),
      reporterId: Number(taskData.reporterId),
      statusId: taskData.statusId,
      taskId: Number(taskData.taskId),
      taskName: taskData.taskName,
      timeTrackingRemaining: Number(taskData.timeTrackingRemaining),
      timeTrackingSpent: Number(taskData.timeTrackingSpent),
      typeId: Number(taskData.typeId),
      listUserAsign: taskData.listUserAsign || []
    });
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const getProjectDetails = (projectId: string) => {
  return api.get(`/Project/getProjectDetail?id=${projectId}`);
};

export const updateProjectDetails = (projectData: any) => {
  return api.put(`/Project/updateProject?projectId=${projectData.id}`, projectData);
};

export const updateTaskStatus = (taskId: number, statusId: string) => {
  return api.put('/Project/updateStatus', {
    taskId,
    statusId
  });
};

export const deleteTask = async (taskId: number) => {
  const response = await api.delete(`/Project/removeTask`, {
    params: {
      taskId
    }
  });
  
  interface ApiResponse {
    statusCode: number;
    message?: string;
  }

  const data = response.data as ApiResponse;
  
  if (data.statusCode === 200) {
    return data;
  }
  throw new Error(data.message || 'Failed to delete task');
};

export default api;
