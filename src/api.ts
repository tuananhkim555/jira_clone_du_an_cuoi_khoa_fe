import axios from 'axios';

const API_BASE_URL = 'https://jiranew.cybersoft.edu.vn/api';
const TOKEN_CYBERSOFT = import.meta.env.VITE_CYBERSOFT_TOKEN;
const local_token_login = (localStorage.getItem("authToken"));

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    TokenCybersoft: TOKEN_CYBERSOFT,
    Authorization: `Bearer ${local_token_login}`,
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API error:', error);
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
  console.log('Fetching statuses...');
  return api.get('/Status/getAll').then(response => {
    console.log('Statuses response:', response);
    return response;
  });
};

export const getAllPriorities = () => {
  console.log('Fetching priorities...');
  return api.get('/Priority/getAll').then(response => {
    console.log('Priorities response:', response);
    return response;
  });
};

export const getAllTaskTypes = () => {
  console.log('Fetching task types...');
  return api.get('/TaskType/getAll').then(response => {
    console.log('Task Types response:', response);
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
  console.log('Fetching users...');
  return api.get('/Users/getUser').then(response => {
    console.log('Users response:', response);
    return response;
  });
};

export const createTask = (taskData: any) => {
  return api.post('/Project/createTask', taskData);
};

export default api;
