import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreateProject from '../pages/CrateProject/CreateProjects';
import ProjectManagement from '../pages/ProjectManagemtens/ProjectManagement';
import Settings from '../pages/Settings/Settings';
import Profile from '../pages/Profile/Profile';
import JiraBoard from '../pages/JiraBoard/JiraBoard';
import NotFound from '../pages/NotFound/NotFound';
import Helps from '../pages/Help/Help';
import Pages from '../pages/PagesDeploy/Pages';
import ProjectEdit from '../pages/ProjectEdit/ProjectEdit';
import UserManagements from '../pages/UserManagaments/UserManagements';
import Dashboard from '../pages/JiraBoard/Dashboard';
import PrivateRoute from '../redux/PrivateRoute.tsx';
import Login from '../pages/auth/Login/Login.tsx';
import Register from '../pages/auth/Register/Register.tsx';

const ClientRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create" element={
        <PrivateRoute>
          <CreateProject />
        </PrivateRoute>
      } />
      <Route path="/project" element={
        <PrivateRoute>
          <ProjectManagement />
        </PrivateRoute>
      } />
      <Route path="/settings" element={
        <PrivateRoute>
          <Settings />
        </PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
      <Route path="/help" element={
        <PrivateRoute>
          <Helps />
        </PrivateRoute>
      } />
      <Route path="/board/:id" element={
        <PrivateRoute>
          <JiraBoard />
        </PrivateRoute>
      } />
      <Route path="/board" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/pages" element={
        <PrivateRoute>
          <Pages />
        </PrivateRoute>
      } />
      <Route path="/project/edit/:id" element={
        <PrivateRoute>
          <ProjectEdit />
        </PrivateRoute>
      } />
      <Route path="/users-managements" element={
        <PrivateRoute>
          <UserManagements />
        </PrivateRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ClientRoute;
