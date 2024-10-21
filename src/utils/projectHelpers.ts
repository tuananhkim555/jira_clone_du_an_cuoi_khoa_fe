import React from 'react';
import { Tooltip } from 'antd';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { Project } from '../types/Project';

export const renderMembers = (project: Project, handleRemoveMember: (projectId: number, userId: number) => void) => {
  return project.members.map((member, index) => 
    React.createElement(Tooltip, { key: member.userId, title: member.name },
      React.createElement('div', { className: "relative inline-block" },
        React.createElement('img', {
          src: member.avatar,
          alt: member.name,
          className: "w-8 h-8 rounded-full border-2 border-white",
          style: { marginLeft: index > 0 ? '-10px' : '0' }
        }),
        React.createElement('button', {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            handleRemoveMember(project.id, member.userId);
          },
          className: "absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs"
        }, React.createElement(FaTimes))
      )
    )
  );
};

export const renderAddMemberButton = (projectId: number, handleAddMember: (projectId: number, event: React.MouseEvent) => void) => {
  return (
    <Tooltip title="Add member">
      <button
        onClick={(e) => handleAddMember(projectId, e)}
        className="w-8 h-8 rounded-full bg-purple-950 text-white flex items-center justify-center hover:bg-purple-900"
      >
        <FaPlus size={12} />
      </button>
    </Tooltip>
  );
};
