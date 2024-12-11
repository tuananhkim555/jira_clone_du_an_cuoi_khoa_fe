import { TypeApiResponse, ListResponse, SingleResponse } from '../../types/typeApiResponse';

export interface ProjectManagement {
  id: string;
  projectName: string;
  description: string;
  startDate: string | Date;
  endDate: string | Date;
  status: ProjectStatus;
  priority: PriorityLevel;
  progress: number;
  teamMembers: TeamMember[];
  tasks: Task[];
  budget: Budget;
}

export type ProjectStatus = 'Not Started' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  department: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  startDate: string | Date;
  dueDate: string | Date;
  status: TaskStatus;
  priority: PriorityLevel;
  completionPercentage: number;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Completed';

export interface Budget {
  total: number;
  spent: number;
  remaining: number;
  currency: string;
}

// Form types
export interface ProjectFormData {
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: PriorityLevel;
  teamMembers: TeamMember[];
}

// Generic API Response type
export interface ApiResponse<T> {
  status: number;
  success: boolean;
  data: T;
  message: string;
}

// Specific response types
export type ProjectListResponse = ListResponse<ProjectManagement>;
export type ProjectDetailResponse = SingleResponse<ProjectManagement>;
export type TeamMemberResponse = ApiResponse<TeamMember[]>;

// Example usage with specific data types
export type CreateProjectResponse = TypeApiResponse<{
  project: ProjectManagement;
  message: string;
}>;

export type UpdateProjectResponse = ApiResponse<{
  project: ProjectManagement;
  updatedAt: string;
}>;

// Added types from ProjectManagementsLogic.ts
export interface Project {
  id: number;
  projectName: string;
  categoryName: string;
  creator: {
    id: number;
    name: string;
  };
  members: {
    userId: number;
    name: string;
    avatar: string;
  }[];
}

export interface User {
  userId: number;
  name: string;
  avatar: string;
}

export interface UserResponse {
  content: {
    userId: number;
    name: string;
    avatar: string;
  }[];
}
