export interface Project {
  id?: number;
  img: string;
  title: string;
  description: string;
  links: {
    site: string;
    github: string;
  };
}

export interface UploadProjectProps {
  onClose: () => void;
  onSubmit: (project: Project) => void;
}

export interface EditProjectProps {
  project: Project;
  onClose: () => void;
  onSubmit: (updatedProject: Project) => void;
}

export interface NotificationType {
  type: 'success' | 'error';
  message: string;
}
