import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import CreateProject from '../pages/create_project/CreateProjects';
import ProjectManagement from '../pages/project_managements/ProjectManagement';
import Settings from '../pages/Settings/Settings';
import Profile from '../pages/Profile/Profile';
import KanbanBoard from '../pages/kaban_board/KanbanBoard';
import NotFound from '../components/NotFound';
import Helps from '../pages/Help/Help';
import Pages from '../pages/pages_jira/Pages';
import ProjectEdit from '../pages/project_managements/ProjectEdit';
import UserManagements from '../pages/UserManagaments/UserManagements';


const ClientRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create" element={<CreateProject />} />
      <Route path="/project" element={<ProjectManagement />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/help" element={<Helps />} />
      <Route path="/board" element={<KanbanBoard />} />
      <Route path="/board/:id" element={<KanbanBoard />} />
      <Route path="/pages" element={<Pages />} />
      <Route path="/project/edit/:id" element={<ProjectEdit />} />
      <Route path="/users-managements" element={<UserManagements />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ClientRoute;
