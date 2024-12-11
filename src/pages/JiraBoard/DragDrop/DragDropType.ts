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