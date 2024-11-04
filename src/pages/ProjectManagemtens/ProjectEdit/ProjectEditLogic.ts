import { useState, useCallback } from 'react';
import { getProjectDetails, getProjectCategories, updateProjectDetails } from '../../../api/api';

interface ProjectDetails {
  id: number;
  projectName: string;
  description: string;
  projectCategory: {
    id: number;
    name: string;
  };
  alias: string;
  creator: {
    id: number; 
    name: string;
  };
}

interface Category {
  id: number;
  projectCategoryName: string;
}

interface ProjectResponse {
  data: {
    content: ProjectDetails;
  };
}

interface CategoriesResponse {
  data: {
    content: Category[];
  };
}

export const useProjectEditLogic = (id: string | undefined, navigate: (path: string) => void) => {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchProjectAndCategories = async () => {
    try {
      const [projectResponse, categoriesResponse] = await Promise.all([
        getProjectDetails(id!),
        getProjectCategories()
      ]);

      const typedProjectResponse = projectResponse as ProjectResponse;
      const typedCategoriesResponse = categoriesResponse as CategoriesResponse;

      setProject(typedProjectResponse.data.content);
      setCategories(typedCategoriesResponse.data.content);
    } catch (error) {
      console.error('Error fetching data:', error);
      setNotification({ type: 'error', message: 'Failed to fetch project details or categories.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project) return;

    try {
      const updateData = {
        id: project.id,
        projectName: project.projectName,
        creator: project.creator.id,
        description: project.description,
        categoryId: project.projectCategory.id
      };

      await updateProjectDetails(updateData);
      setNotification({ type: 'success', message: 'Project updated successfully' });
      setTimeout(() => navigate('/project'), 2000);
    } catch (error) {
      console.error('Error updating project:', error);
      setNotification({ type: 'error', message: 'Failed to update project. You can only update projects you created.' });
    }
  }, [project, navigate]);

  return {
    project,
    setProject,
    loading,
    notification,
    categories,
    fetchProjectAndCategories,
    handleSubmit
  };
};
