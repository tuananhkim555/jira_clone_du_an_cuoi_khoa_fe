import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

interface AvatarUploadProps {
  currentAvatar: string;
  defaultAvatar: string;
  isCurrentUser: boolean;
  cloneAvatar: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  currentAvatar, 
  defaultAvatar, 
  isCurrentUser,
  cloneAvatar
}) => {
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const avatarSrc = isCurrentUser 
    ? (tempAvatar || cloneAvatar) 
    : (currentAvatar || defaultAvatar);

  return (
    <div className="relative">
      <img
        src={avatarSrc}
        alt="User Avatar"
        className="w-32 h-32 rounded-full object-cover border-4 border-purple-900"
      />
      {isCurrentUser && (
        <label 
          htmlFor="avatar-upload" 
          className="absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center bg-gradient-to-r from-purple-900 to-orange-800 text-white rounded-full cursor-pointer hover:from-purple-800 hover:to-orange-700 transition-all duration-300"
        >
          <FaPlus />
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </label>
      )}
    </div>
  );
};

export default AvatarUpload;
