export interface TypeApiResponse<T> {
  status: number;
  success: boolean;
  data: T;
  message: string;
}

// Định nghĩa thêm một số type phổ biến
export type ListResponse<T> = TypeApiResponse<T[]>;
export type SingleResponse<T> = TypeApiResponse<T>;
export type CreateResponse<T> = TypeApiResponse<{
  data: T;
  message: string;
}>;
export type UpdateResponse<T> = TypeApiResponse<{
  data: T;
  updatedAt: string;
}>;
export type DeleteResponse = TypeApiResponse<{
  message: string;
}>;
