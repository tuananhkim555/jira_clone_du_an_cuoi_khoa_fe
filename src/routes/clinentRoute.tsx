import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import CreateProject from '../pages/CrateProject/CreateProjects';
import ProjectManagement from '../pages/ProjectManagemtens/ProjectManagement';
import Settings from '../pages/Settings/Settings';
import Profile from '../pages/Profile/Profile';
import JiraBoard from '../pages/JiraBoard/JiraBoard';
import NotFound from '../pages/NotFound/NotFound';
import Helps from '../pages/Help/Help';
import Pages from '../pages/PagesDeploy/Pages';
import ProjectEdit from '../pages/ProjectManagemtens/ProjectEdit';
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
      <Route path="/board" element={<JiraBoard />} />
      <Route path="/board/:id" element={<JiraBoard />} />
      <Route path="/pages" element={<Pages />} />
      <Route path="/project/edit/:id" element={<ProjectEdit />} />
      <Route path="/users-managements" element={<UserManagements />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ClientRoute;
