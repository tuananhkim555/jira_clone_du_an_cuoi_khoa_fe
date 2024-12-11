export interface StatusOption {
  statusId: string;
  statusName: string;
}

export interface PriorityOption {
  priorityId: string;
  priority: string;
}

export interface ProjectUser {
  userId: number;
  name: string;
  avatar: string;
}

export interface Assignee {
  id: number;
  name: string;
  avatar: string;
}

export interface SelectProps {
  value: number;
  onClose?: React.MouseEventHandler<HTMLSpanElement>;
}

export const STATUS_OPTIONS: StatusOption[] = [
  { statusId: '1', statusName: 'BACKLOG' },
  { statusId: '2', statusName: 'SELECTED FOR DEVELOPMENT' },
  { statusId: '3', statusName: 'IN PROGRESS' },
  { statusId: '4', statusName: 'DONE' }
];

export const PRIORITY_OPTIONS: PriorityOption[] = [
  { priorityId: '1', priority: 'High' },
  { priorityId: '2', priority: 'Medium' },
  { priorityId: '3', priority: 'Low' },
  { priorityId: '4', priority: 'Lowest' }
];
