// Basic Types
export interface User {
  id: number;
  name: string;
  avatar: string;
  email?: string;
  alias?: string;
}


export interface Project {
  id: number;
  projectName: string;
  description?: string;
  projectCategory?: {
    id: number;
    name: string;
  };
  creator?: {
    id: number;
    name: string;
  };
  members?: User[];
  alias?: string;
}

// Task Related Types
export interface Task {
  id: string | number;
  taskId: string | number;
  taskName: string;
  content?: string;
  description?: string;
  assignees?: User[];
  priority?: Priority;
  statusId: string;
  originalEstimate?: number;
  timeTrackingSpent?: number;
  timeTrackingRemaining?: number;
  typeId?: number;
  alias?: string;
  reporterId?: number;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

// Status and Priority Types
export interface Status {
  statusId: string;
  statusName: string;
  alias: string;
  deleted: string;
}

export interface Priority {
  priorityId: number;
  priority: string;
  description?: string;
  deleted?: boolean;
  alias?: string;
}

export interface TaskType {
  id: number;
  taskType: string;
}

// Component Props Types
export interface EditTaskDetailProps {
  taskId?: string;
  projectId?: string;
  isVisible: boolean;
  onClose: () => void;
  onUpdate: () => void;
  taskTitle?: string;
  taskDescription?: string;
  taskStatus?: string;
  taskPriority?: string;
  alias?: string;
  reporterId?: number;
  timeTrackingRemaining?: number;
  timeTrackingSpent?: number;
  originalEstimate?: number;
  typeId?: number;
  assignees?: User[];
}

export interface CreateTaskModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onCreate: (taskData: any) => void;
  currentProject: Project;
}

export interface DragAndDropBoardProps {
  columns: { [key: string]: Column };
  setColumns: React.Dispatch<React.SetStateAction<{ [key: string]: Column }>>;
  onTaskClick: (taskId: string) => void;
  currentProject?: Project;
}

// API Response Types
export interface ApiResponse<T> {
  data: {
    content?: T;
    statusCode?: number;
    message?: string;
  };
}

export interface ProjectDetails {
  lstTask: {
    lstTaskDeTail: Task[];
    statusId: string;
    statusName: string;
    alias: string;
  }[];
  members: User[];
  creator: {
    id: number;
    name: string;
  };
  id: number;
  projectName: string;
  description: string;
  projectCategory: {
    id: number;
    name: string;
  };
  alias: string;
}
