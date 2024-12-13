export interface User {
  userId: string;
  name: string;
  avatar: string;
}

export interface Task {
  taskId?: string;
  id?: string;
  taskName: string;
  statusId?: string;
  description?: string;
  priority?: {
    priority: string;
  } | string;
  assignees?: {
    id: string;
    name: string;
    avatar: string;
  }[];
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
