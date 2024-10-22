import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { FaPlus, FaEdit, FaSave, FaUser, FaUserCheck } from 'react-icons/fa';
import axios from 'axios';
import NotificationMessage from '../../components/NotificationMessage';
import Reveal from '../../components/Reveal';
import LoadingSpinner from '../../components/LoadingSpinner';
import avatarImage from '../../assets/anhdaidien2.jpg';
import TitleGradient from '../../components/ui/TitleGradient';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phoneNumber?: string;
}

const User: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user) as User | null;
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(user);
  const dispatch = useDispatch();
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    console.log('Current user:', user);
    console.log('Edited user:', editedUser);
  }, [user, editedUser]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <div>No user information available</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => prev ? { ...prev, [name]: value } : null);
    console.log(`Input changed: ${name} = ${value}`);
  };

  const handleSave = async () => {
    if (!editedUser) return;

    console.log('Saving user:', editedUser);
    setIsLoading(true);

    try {
      const response = await axios.put<{ statusCode: number; content: string }>(
        'https://jiranew.cybersoft.edu.vn/api/Users/editUser',
        {
          id: editedUser.id,
          email: editedUser.email,
          name: editedUser.name,
          phoneNumber: editedUser.phoneNumber
        },
        {
          headers: {
            'Content-Type': 'application/json-patch+json',
            'TokenCybersoft': import.meta.env.VITE_TOKEN_CYBERSOFT,
          }
        }
      );

      console.log('API response:', response.data);

      if (response.data.statusCode === 200) {
        dispatch({ type: 'UPDATE_USER', payload: editedUser });
        setIsEditing(false);
        setNotification({ type: 'success', message: 'User updated successfully!' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setNotification({ type: 'error', message: 'Failed to update user. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Reveal>
      <div className="max-w-[600px] mx-auto mt-20 p-8 bg-white rounded-[2.5rem] shadow-xl">
        {notification && (
          <NotificationMessage type={notification.type} message={notification.message} />
        )}
        <div className="flex items-center justify-center mb-6">
          <FaUserCheck className="text-[22px] mr-3 text-purple-900" />
          <TitleGradient>User Profile</TitleGradient>
        </div>
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32">
            <img 
              src={avatarImage}
              alt="User Avatar"
              className="w-full h-full object-cover rounded-full border-4 border-purple-950"
            />
            <button className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-900 to-orange-700 text-white p-2 rounded-full hover:from-purple-800 hover:to-orange-600 transition-all duration-500 ease-in-out shadow-lg">
              <FaPlus />
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={isEditing && editedUser ? editedUser.name : user.name}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 transition-all duration-300 ease-in-out hover:border-purple-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={isEditing && editedUser ? editedUser.email : user.email}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 transition-all duration-300 ease-in-out hover:border-purple-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">User ID</label>
            <input
              type="text"
              value={user.id}
              readOnly
              className="p-2 border border-gray-300 rounded-md bg-gray-100 transition-all duration-300 ease-in-out hover:bg-gray-200"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value="********"
              readOnly={!isEditing}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-900 transition-all duration-300 ease-in-out hover:border-purple-900"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={isEditing && editedUser ? editedUser.phoneNumber || '' : user.phoneNumber || ''}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 transition-all duration-300 ease-in-out hover:border-purple-500"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              if (!isEditing) {
                setEditedUser(user);
              }
            }}
            className={`flex items-center px-4 py-2 text-white rounded-md transition-all duration-500 ease-in-out bg-gradient-to-r ${
              isEditing
                ? 'from-orange-800 to-purple-900 hover:from-orange-700 hover:to-purple-800'
                : 'from-purple-900 to-orange-800 hover:from-purple-800 hover:to-orange-700'
            } hover:shadow-lg transform hover:scale-105`}
          >
            <FaEdit className={`mr-2 transition-all duration-500 ${isEditing ? 'rotate-180' : 'rotate-0'}`} />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          {isEditing && (
            <button 
              onClick={handleSave}
              className="flex items-center px-4 py-2 text-white rounded-md transition-all duration-500 ease-in-out bg-gradient-to-r from-purple-900 to-orange-800 hover:from-purple-800 hover:to-orange-700 hover:shadow-lg transform hover:scale-105"
            >
              <FaSave className="mr-2 animate-pulse" />
              Save
            </button>
          )}
        </div>
      </div>
    </Reveal>
  );
};

export default User;
