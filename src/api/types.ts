// User interface Profile.tsx
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phoneNumber?: string;
    role?: string;
    password?: string;
}
export interface ApiResponse {
    statusCode: number;
    content?: string;
    message?: string;
  }
  