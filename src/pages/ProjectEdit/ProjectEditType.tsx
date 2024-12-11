export interface ProjectDetails {
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

export interface Category {
  id: number;
  projectCategoryName: string;
}

export interface ProjectResponse {
  data: {
    content: ProjectDetails;
  };
}

export interface CategoriesResponse {
  data: {
    content: Category[];
  };
}
