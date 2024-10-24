import axios from 'axios';

const API_BASE_URL = 'https://jiranew.cybersoft.edu.vn/api';
const TOKEN_CYBERSOFT = import.meta.env.VITE_CYBERSOFT_TOKEN;
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    TokenCybersoft: TOKEN_CYBERSOFT,
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
});

export const getProjectById = (projectId: string) => {
  return api.get(`/Project/getProjectDetail?id=${projectId}`);
};

export const getAllProjects = () => {
  return api.get('/Project/getAllProject');
};

export const getProjectCategories = () => {
  return api.get('/ProjectCategory');
};

export const getAllUsers = () => {
  return api.get('/Users/getUser');
};

export const createTask = (taskData: any) => {
  return api.post('/Project/createTask', taskData);
};

export const getAllStatuses = () => {
  return api.get('/Status/getAll');
};

export const getAllPriorities = () => {
  return api.get('/Priority/getAll');
};

export const getAllTaskTypes = () => {
  return api.get('/TaskType/getAll');
};

export const assignUserTask = (taskId: number, userId: number) => {
  return api.post('/Project/assignUserTask', { taskId, userId });
};

export default api;
