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
    if (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
      }
    }
    return Promise.reject(error);
  }
);

// Add type for API responses
interface ApiResponse<T = any> {
  statusCode: number;
  content?: T;
  message?: string;
}

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

export const assignUserTask = async (taskId: number, userId: number) => {
  try {
    const response = await api.post('/Project/assignUserTask', {
      taskId,
      userId
    }) as { data: ApiResponse };
    
    const data = response.data;
    if (data.statusCode === 200) {
      return data;
    }
    throw new Error(data.message || 'Failed to assign user to task');
  } catch (error) {
    console.error('Error assigning user to task:', error);
    throw error;
  }
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

export const getTaskDetail = async (taskId: string) => {
  try {
    const response = await api.get(`/Project/getTaskDetail`, {
      params: {
        taskId: Number(taskId)
      }
    });
    console.log('Raw API response:', response.data);
    const data = response.data as { content: any };
    return data.content;
  } catch (error) {
    console.error('Error in getTaskDetail:', error);
    throw error;
  }
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

export const removeUserFromTask = async (taskId: number, userId: number) => {
  try {
    const response = await api.post('/Project/removeUserFromTask', {
      taskId,
      userId
    });
    
    const data = response.data as ApiResponse;
    if (data.statusCode === 200) {
      return data;
    }
    throw new Error(data.message || 'Failed to remove user from task');
  } catch (error) {
    console.error('Error removing user from task:', error);
    throw error;
  }
};

export const getUsersInProject = async (projectId: string) => {
  try {
    const response = await api.get(`/Users/getUserByProjectId?idProject=${projectId}`);
    const data = response.data as ApiResponse;
    return data.content;
  } catch (error) {
    console.error('Error getting users in project:', error);
    throw error;
  }
};

export const getAllComments = async (taskId: number) => {
  try {
    const response = await api.get(`/Comment/getAll`, {
      params: { taskId }
    });
    const data = response.data as ApiResponse;
    if (data.statusCode === 200) {
      return data.content; // Trả về danh sách comment
    }
    throw new Error(data.message || 'Failed to fetch comments');
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export default api;
