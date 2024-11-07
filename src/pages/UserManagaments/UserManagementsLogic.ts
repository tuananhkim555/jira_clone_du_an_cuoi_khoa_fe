import { useState } from 'react';
import { getAllUsers, deleteUser } from '../../common/api/api';
import NotificationMessage from '../../common/components/NotificationMessage';

interface User {
  id: number;
  avatar: string;
  name: string;
  email: string;
  phoneNumber: string;
}

interface ApiResponse {
  statusCode: number;
  content: {
    userId: number;
    avatar: string;
    name: string;
    email: string;
    phoneNumber: string;
  }[];
}

export const useUserManagementLogic = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      const data = response.data as ApiResponse;
      if (data && data.statusCode === 200 && Array.isArray(data.content)) {
        const formattedUsers = data.content.map((user) => ({
          id: user.userId,
          avatar: user.avatar,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber
        }));
        setAllUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (deleteUserId: number) => {
    try {
      const response = await deleteUser(deleteUserId);

      if (response.status === 200) {
        setFilteredUsers(prevUsers => 
          prevUsers.filter(user => user.id !== deleteUserId)
        );
        NotificationMessage({ type: 'success', message: 'User deleted successfully' });
        return true;
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      NotificationMessage({ 
        type: 'error', 
        message: 'Failed to delete user'
      });
      return false;
    }
  };

  const handleSearch = (searchTerm: string, searchType: string) => {
    const filtered = allUsers.filter(user => {
      switch (searchType) {
        case 'name':
          return user.name.toLowerCase().includes(searchTerm.toLowerCase());
        case 'id':
          return user.id.toString().includes(searchTerm);
        case 'phone':
          return user.phoneNumber.includes(searchTerm);
        case 'email':
          return user.email.toLowerCase().includes(searchTerm.toLowerCase());
        default:
          return false;
      }
    });
    setFilteredUsers(filtered);
  };

  return {
    allUsers,
    filteredUsers,
    isLoading,
    error,
    fetchUsers,
    handleDeleteUser,
    handleSearch
  };
};
