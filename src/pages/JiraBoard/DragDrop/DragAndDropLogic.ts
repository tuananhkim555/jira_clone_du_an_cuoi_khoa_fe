import { getAllUsers } from '../../../common/api/api';
import { User } from './DragDropType';

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await getAllUsers();
    if (response && typeof response === 'object' && 'data' in response && response.data !== null && typeof response.data === 'object' && 'content' in response.data && Array.isArray(response.data.content)) {
      return response.data.content as User[];
    } else {
      console.error('Invalid response format for users');
      return [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};
