import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import CreateProject from '../pages/create_project/CreateProjects';
import ProjectManagement from '../pages/project_managements/ProjectManagement';
import Components from '../pages/components/Components';
import Releases from '../pages/Releases/Releases';
import KanbanBoard from '../pages/kaban_board/KanbanBoard';
import NotFound from '../components/NotFound';
import IssuesFilters from '../pages/issues_filter/IssuesFilters';
import Pages from '../pages/pages_jira/Pages';
import ProjectEdit from '../pages/project_managements/ProjectEdit';
import ProjectBoard from '../pages/project_managements/ProjectBoard';

const ClientRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create" element={<CreateProject />} />
      <Route path="/project" element={<ProjectManagement />} />
      <Route path="/components" element={<Components />} />
      <Route path="/releases" element={<Releases />} />
      <Route path="/issues" element={<IssuesFilters />} />
      <Route path="/kanban" element={<KanbanBoard />} />
      <Route path="/pages" element={<Pages />} />
      <Route path="/project/edit/:id" element={<ProjectEdit />} />
      <Route path="/board/:id" element={<ProjectBoard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ClientRoute;
