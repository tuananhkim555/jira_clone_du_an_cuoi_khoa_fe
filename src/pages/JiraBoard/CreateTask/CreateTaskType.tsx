// src/pages/JiraBoard/CreateTask/CreateTaskType.tsx

export interface ApiResponse<T> {
    data: {
      content: T;
    };
  }
  
  export interface TaskResponse {
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
  
  export interface TaskData {
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
  
  export interface Task {
    id: string;
    taskId: string;
    taskName: string;
    content: string;
    assignees: {
      userId: string;
      name: string;
      avatar: string;
    }[];
    priority: {
      priorityId: string;
      priority: string;
    };
    statusId: string;
    originalEstimate: number;
    timeTrackingSpent: number;
    timeTrackingRemaining: number;
  }
  
  export interface CreateTaskLogicProps {
    isVisible: boolean;
    currentProject: any;
    onCancel: () => void;
    onCreate: (taskData: Task) => void;
  }

  export interface CreateTaskModalProps extends CreateTaskLogicProps {}