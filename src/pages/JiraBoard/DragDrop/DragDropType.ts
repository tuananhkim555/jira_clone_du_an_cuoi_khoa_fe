export interface Task {
  id?: string | number;
  taskId?: string | number;
  taskName: string;
  content?: string;
  statusId: string;
  priority?: any;
  assignees?: any[];
  description?: string;
  typeId?: number;
  originalEstimate?: number;
  timeTrackingSpent?: number;
  timeTrackingRemaining?: number;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
} 


export interface User {
  userId: string;
  name: string;
  avatar: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

export interface DragAndDropBoardProps {
  columns: { [key: string]: Column };
  setColumns: React.Dispatch<React.SetStateAction<{ [key: string]: Column }>>;
  onTaskClick: (taskId: string) => void;
  currentProject?: {
    id: string | number;
  };
}
