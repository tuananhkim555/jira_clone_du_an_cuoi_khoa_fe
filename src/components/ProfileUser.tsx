import React from 'react';

interface ProfileUserProps {
  name: string;
  email: string;
  avatarUrl: string;
  expanded: boolean;
}

const ProfileUser: React.FC<ProfileUserProps> = ({ name, email, avatarUrl, expanded }) => {
  return (
    <div className="border-t flex p-3">
      <img
        src={avatarUrl}
        alt={`${name}'s avatar`}
        className="w-10 h-10 rounded-md"
      />
      <div
        className={`
          flex justify-between items-center
          overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
      `}
      >
        <div className="leading-4">
          <h4 className="font-semibold">{name}</h4>
          <span className="text-xs text-gray-600">{email}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;

