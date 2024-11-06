import { useState, useEffect } from 'react';
import { Form } from 'antd';
import { createTask, getAllStatuses, getAllPriorities, getAllTaskTypes, getAllUsers } from '../../../api/api';
import axios from 'axios';

interface ApiResponse<T> {
  data: {
    content: T;
  };
}

interface TaskResponse {
  taskId: string;
  taskName: string;
  assigness?: {
    id: string;
    name: string;
    avatar: string;
  }[];
  priorityTask?: {
    priorityId: string;
    priority: string;
  };
  statusId: string;
  originalEstimate: number;
  timeTrackingSpent: number;
  timeTrackingRemaining: number;
}

interface TaskData {
  listUserAsign: any[];
  taskName: string;
  description: string;
  statusId: string;
  originalEstimate: number;
  timeTrackingSpent: number;
  timeTrackingRemaining: number;
  projectId: number;
  typeId: number;
  priorityId: number;
  alias: string;
  reporterId: string;
}

interface Task {
  id: string;
  // Add other task properties here
}

export const useCreateTaskLogic = (isVisible: boolean, currentProject: any, onCancel: () => void, onCreate: (taskData: any) => void) => {
  const [form] = Form.useForm();
  const [statuses, setStatuses] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [taskTypes, setTaskTypes] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [timeTracking, setTimeTracking] = useState(0);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isVisible && currentProject) {
      fetchData();
      resetForm();
    }
  }, [isVisible, currentProject]);

  const fetchData = async () => {
    try {
      const [statusesRes, prioritiesRes, taskTypesRes, usersRes] = await Promise.all([
        getAllStatuses(),
        getAllPriorities(),
        getAllTaskTypes(),
        getAllUsers(),
      ]);
      setStatuses((statusesRes as ApiResponse<any[]>).data.content);
      setPriorities((prioritiesRes as ApiResponse<any[]>).data.content);
      setTaskTypes((taskTypesRes as ApiResponse<any[]>).data.content);
      setAllUsers((usersRes as ApiResponse<any[]>).data.content);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const resetForm = () => {
    form.resetFields();
    form.setFieldsValue({
      projectId: currentProject.id,
      projectName: currentProject.projectName,
      originalEstimate: 0,
      timeTrackingSpent: 0,
      timeTrackingRemaining: 0,
    });
    setDescription('');
    setTimeTracking(0);
  };

  const handleCreate = async (values: any) => {
    try {
      const taskData: TaskData = {
        listUserAsign: values.listUserAsign || [],
        taskName: values.taskName,
        description: description,
        statusId: values.statusId,
        originalEstimate: Number(values.originalEstimate) || 0,
        timeTrackingSpent: Number(values.timeTrackingSpent) || 0,
        timeTrackingRemaining: Number(values.timeTrackingRemaining) || 0,
        projectId: Number(currentProject.id),
        typeId: Number(values.typeId),
        priorityId: Number(values.priorityId),
        alias: values.taskName.toLowerCase().replace(/\s+/g, '-'),
        reporterId: "0" // Default reporter ID
      };

      const response = await createTask(taskData) as ApiResponse<TaskResponse>;
      
      if (response?.data?.content) {
        const normalizedTask = {
          id: response.data.content.taskId,
          taskId: response.data.content.taskId,
          taskName: response.data.content.taskName,
          content: response.data.content.taskName,
          assignees: response.data.content.assigness?.map((assignee) => ({
            userId: assignee.id,
            name: assignee.name,
            avatar: assignee.avatar
          })) || [],
          priority: {
            priorityId: response.data.content.priorityTask?.priorityId,
            priority: response.data.content.priorityTask?.priority
          },
          statusId: response.data.content.statusId,
          originalEstimate: response.data.content.originalEstimate,
          timeTrackingSpent: response.data.content.timeTrackingSpent,
          timeTrackingRemaining: response.data.content.timeTrackingRemaining
        };
        
        console.log('Normalized task data:', normalizedTask);
        onCreate(normalizedTask);
        onCancel();
      }
    } catch (error) {
      throw error;
    }
  };

  const handleEditorChange = (content: string) => {
    setDescription(content);
  };

  const updateTimeTracking = () => {
    const spent = form.getFieldValue('timeTrackingSpent') || 0;
    const remaining = form.getFieldValue('timeTrackingRemaining') || 0;
    const total = spent + remaining;
    if (total > 0) {
      const percentage = (spent / total) * 100;
      setTimeTracking(percentage);
    } else {
      setTimeTracking(0);
    }
  };

  const handleTimeSpentChange = (value: number | null) => {
    form.setFieldsValue({ timeTrackingSpent: value || 0 });
    updateTimeTracking();
  };

  const handleTimeRemainingChange = (value: number | null) => {
    form.setFieldsValue({ timeTrackingRemaining: value || 0 });
    updateTimeTracking();
  };

  const handleSliderChange = (value: number) => {
    const total = form.getFieldValue('timeTrackingSpent') + form.getFieldValue('timeTrackingRemaining');
    const spent = Math.round((value / 100) * total);
    const remaining = total - spent;
    form.setFieldsValue({
      timeTrackingSpent: spent,
      timeTrackingRemaining: remaining
    });
    setTimeTracking(value);
  };

  return {
    form,
    statuses,
    priorities,
    taskTypes,
    allUsers,
    timeTracking,
    description,
    handleCreate,
    handleEditorChange,
    handleTimeSpentChange,
    handleTimeRemainingChange,
    handleSliderChange,
  };
};
