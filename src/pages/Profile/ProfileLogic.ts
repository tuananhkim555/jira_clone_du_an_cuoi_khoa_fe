import { editUser } from '../../common/api/api';
import { ApiResponse, User } from '../../types/types';
import { ProfileUpdateResponse } from './ProfileType';

export const fetchUserData = async (): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
};

export const updateUserProfile = async (editedUser: User): Promise<ProfileUpdateResponse> => {
  try {
    const response = await editUser({
      id: editedUser.id,
      email: editedUser.email,
      name: editedUser.name,
      phoneNumber: editedUser.phoneNumber
    });

    const data = response.data as ApiResponse;

    if (data.statusCode === 200) {
      return {
        success: true,
        message: data.content || 'User updated successfully!'
      };
    }
    
    throw new Error(data.message || 'Failed to update user');
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      message: 'This is not a user created by you. Update failed.'
    };
  }
};
