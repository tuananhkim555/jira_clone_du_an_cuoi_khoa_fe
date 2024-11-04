import { useState, useEffect } from 'react';
import { Form } from 'antd';
import { createTask, getAllStatuses, getAllPriorities, getAllTaskTypes, getAllUsers } from '../../../api/api';
import axios from 'axios';

interface ApiResponse<T> {
  data: {
    content: T;
  };
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
      // Format dữ liệu theo đúng yêu cầu của API
      const taskData = {
        listUserAsign: values.listUserAsign || [], // Mảng ID của người được assign
        taskName: values.taskName,
        description: description,
        statusId: values.statusId,
        originalEstimate: Number(values.originalEstimate) || 0,
        timeTrackingSpent: Number(values.timeTrackingSpent) || 0,
        timeTrackingRemaining: Number(values.timeTrackingRemaining) || 0,
        projectId: Number(currentProject.id),
        typeId: Number(values.typeId),
        priorityId: Number(values.priorityId)
      };

      // Log dữ liệu trước khi gửi để kiểm tra
      console.log('Task data before sending:', taskData);

      const response = await createTask(taskData);
      
      // Log response để debug
      console.log('API Response:', response);

      if (response && response.data && response.data.content) {
        onCreate(response.data.content);
        onCancel();
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('API error:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to create task';
        throw new Error(errorMessage);
      }
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
