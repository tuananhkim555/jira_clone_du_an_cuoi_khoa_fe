import { getProjectById, getAllProjects, getProjectCategories, getAllUsers, createTask, getAllStatuses, getAllPriorities, getAllTaskTypes, updateTaskStatus } from '../../common/api/api';
import axios, { AxiosResponse } from 'axios';
import { ApiResponse, ProjectDetails, Task } from './JiraboardType';

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
    const response = await getProjectById(projectId) as AxiosResponse<{content: ProjectDetails}>;
    if (response?.data?.content) {
      const normalizedContent = {
        ...response.data.content,
        lstTask: response.data.content.lstTask.map((status: any) => ({
          ...status,
          lstTaskDeTail: status.lstTaskDeTail.map((task: any) => ({
            id: task.taskId,
            taskId: task.taskId,
            taskName: task.taskName,
            priority: task.priorityTask || task.priority,
            assignees: task.assigness ? task.assigness.map((assignee: any) => ({
              id: assignee.id,
              name: assignee.name,
              avatar: assignee.avatar
            })) : [],
            statusId: status.statusId
          }))
        }))
      };
      return normalizedContent;
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching project details:', error.response?.data || error.message);
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
    const response = await createTask(taskData) as AxiosResponse;
    if (response?.data?.content) {
      return response.data.content;
    }
    throw new Error('Invalid response format');
  } catch (error: any) {
    if (error?.response) {
      console.error('Error creating task:', error.response.data);
      // Check if the task was actually created despite the error
      if (error.response.status === 200 || error.response.status === 201) {
        return error.response.data.content;
      }
      throw new Error(error.response.data?.message || 'Failed to create task');
    }
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (taskData: any) => {
  try {
    const response = await updateTaskStatus(taskData.taskId, taskData.statusId);
    if (response?.data) {
      return {
        statusCode: 200,
        message: 'Task updated successfully',
        content: response.data
      };
    }
    throw new Error('Invalid response format');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating task:', error);
      throw new Error(error.message || 'Failed to update task');
    }
    throw error;
  }
};
