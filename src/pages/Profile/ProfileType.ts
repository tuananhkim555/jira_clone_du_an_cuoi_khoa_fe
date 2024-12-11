import { User } from '../../types/types';

export interface ExtendedUser extends User {
  role?: string;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
}

export interface NotificationType {
  type: 'success' | 'error';
  message: string;
}
