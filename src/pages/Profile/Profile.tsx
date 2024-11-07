import React from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setTempUser, clearTempUser } from '../../redux/slices/userSlice';
import { FaPlus, FaEdit, FaSave, FaUser, FaUserCheck, FaKey, FaEye, FaEyeSlash, FaIdCard, FaEnvelope, FaPhone } from 'react-icons/fa';
import axios from 'axios';
import NotificationMessage from '../../common/components/NotificationMessage';
import Reveal from '../../common/components/Reveal';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import avatarImage from '../../assets/anhdaidien2.jpg'; // Ensure this path is correct
import cloneAvatarImage from '../../assets/anhdaidien2.jpg'; // Ensure this path is correct
import TitleGradient from '../../common/components/ui/TitleGradient';
import TextAnimation from '../../common/components/ui/TextAnimation';
import AnimationSection from '../../common/components/ui/AnimationSection';
import { useLocation } from 'react-router-dom';
import { fetchUserData, updateUserProfile } from './ProfileLogic';
import AvatarUpload from '../../common/components/AvatarUpload';
import { User } from '../../common/api/types';

interface ExtendedUser extends User {
  role?: string;
}

const Profile: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.user) as ExtendedUser;
  const tempUser = useAppSelector(state => state.user.tempUser);
  
  const [selectedUser, setSelectedUser] = React.useState<User | null>(location.state?.selectedUser || null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedUser, setEditedUser] = React.useState<User | null>(null);
  const [notification, setNotification] = React.useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');

  const isCurrentUserOrCreator = React.useMemo(() => {
    if (!currentUser || !editedUser) return false;
    return currentUser.id === editedUser.id || currentUser.role === 'ADMIN';
  }, [currentUser, editedUser]);

  React.useEffect(() => {
    const initUserData = async () => {
      await fetchUserData();
      setIsLoading(false);
    };

    initUserData();
  }, []);

  React.useEffect(() => {
    if (selectedUser) {
      setEditedUser(selectedUser);
    } else if (tempUser) {
      setEditedUser(tempUser);
    } else if (currentUser) {
      setEditedUser(currentUser);
    }
  }, [selectedUser, tempUser, currentUser]);

  React.useEffect(() => {
    return () => {
      dispatch(clearTempUser());
    };
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // If cancelling, reset editedUser to the original state
      setEditedUser(selectedUser || tempUser || currentUser);
    }
    setIsEditing(!isEditing);
    // Clear any existing notification when toggling edit mode
    setNotification(null);
  };

  const handleSave = async () => {
    if (!editedUser) return;
    setIsLoading(true);

    const result = await updateUserProfile(editedUser);
    
    if (result.success) {
      setIsEditing(false);
      setSelectedUser(editedUser);
    }
    
    setNotification({ 
      type: result.success ? 'success' : 'error', 
      message: result.message 
    });
    
    setIsLoading(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const isCurrentUser = currentUser?.id === editedUser?.id;

  if (isLoading || !editedUser) {
    return <LoadingSpinner />;
  }

  return (
    <Reveal>
      <div className="max-w-[600px] mx-auto mt-20 p-8 bg-white rounded-[2.5rem] shadow-xl">
        {notification && (
          <NotificationMessage type={notification.type} message={notification.message} />
        )}
        <AnimationSection>
          <div className="flex items-center justify-center mb-6">
            <FaUserCheck className="text-[22px] mr-3 text-purple-900" />     
            <TitleGradient>User Profile</TitleGradient>
          </div>
        </AnimationSection>
        <div className="flex justify-center mb-6">
          <AvatarUpload 
            currentAvatar={editedUser?.avatar || ''}
            defaultAvatar={avatarImage}
            isCurrentUser={isCurrentUser}
            cloneAvatar={cloneAvatarImage}
          />
        </div>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="flex items-center text-sm font-semibold text-gray-600 mb-1">
              <FaIdCard className="mr-1" />
              <TextAnimation text="ID" />
            </label>
            <input
              type="text"
              value={editedUser.id}
              readOnly
              className="p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
            />
          </div>
          <div className="flex flex-col">
            <label className="flex items-center text-sm font-semibold text-gray-600 mb-1">
              <FaUser className="mr-1" />
              <TextAnimation text="Name" />
            </label>
            <input
              type="text"
              name="name"
              value={editedUser.name}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 transition-all duration-300 ease-in-out hover:border-purple-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="flex items-center text-sm font-semibold text-gray-600 mb-1">
              <FaEnvelope className="mr-1" />
              <TextAnimation text="Email" />
            </label>
            <input
              type="email"
              name="email"
              value={editedUser.email}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 transition-all duration-300 ease-in-out hover:border-purple-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="flex items-center text-sm font-semibold text-gray-600 mb-1">
              <FaPhone className="mr-1" />
              <TextAnimation text="Phone Number" />
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={editedUser.phoneNumber || ''}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 transition-all duration-300 ease-in-out hover:border-purple-500"
            />
          </div>
          <div className="flex flex-col relative">
            <label className="flex items-center text-sm font-semibold text-gray-600 mb-1">
              <FaKey className="mr-1" />
              <TextAnimation text="Password" />
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={isEditing ? newPassword : '••••••••'}
              onChange={handlePasswordChange}
              readOnly={!isEditing}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 transition-all duration-300 ease-in-out hover:border-purple-500"
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-10 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={handleEditToggle}
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

export default Profile;
