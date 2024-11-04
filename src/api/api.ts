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

export const createTask = async (taskData: any) => {
  try {
    const response = await api.post('/Project/createTask', {
      ...taskData,
      // Đảm bảo các trường bắt buộc có giá trị hợp lệ
      projectId: Number(taskData.projectId),
      statusId: taskData.statusId,
      typeId: Number(taskData.typeId),
      priorityId: Number(taskData.priorityId),
      listUserAsign: Array.isArray(taskData.listUserAsign) ? taskData.listUserAsign : []
    });
    return response;
  } catch (error) {
    console.error('Error in createTask API call:', error);
    throw error;
  }
};

export const updateProject = (projectData: any) => {
  return api.put(`/Project/updateProject`, projectData);
};

export const getTaskDetail = (taskId: number) => {
  return api.get(`/Task/getTaskDetail?id=${taskId}`);
};

export const updateTask = (taskData: any) => {
  return api.put(`/Task/updateTask`, taskData);
};

export const getProjectDetails = (projectId: string) => {
  return api.get(`/Project/getProjectDetail?id=${projectId}`);
};

export const updateProjectDetails = (projectData: any) => {
  return api.put(`/Project/updateProject?projectId=${projectData.id}`, projectData);
};

export default api;
