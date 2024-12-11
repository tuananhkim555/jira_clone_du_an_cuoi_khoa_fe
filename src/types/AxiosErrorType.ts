import { AxiosError } from 'axios';
import { TypeApiResponse } from './typeApiResponse';

// Cập nhật ErrorResponse để phù hợp với TypeApiResponse
export interface ErrorResponse {
  success: boolean
  message: string
  status: number
  data?: any
}

// Type chung cho AxiosError
export type TAxiosError = AxiosError<ErrorResponse>

// Định nghĩa chi tiết hơn cho lỗi validation
export interface ValidationError extends ErrorResponse {
  data: {
    errors: Record<string, string[]>
  }
}

export type TValidationAxiosError = AxiosError<ValidationError>

// Thêm một số type error phổ biến
export interface AuthError extends ErrorResponse {
  data: {
    code: string
    expired?: string
  }
}

export type TAuthAxiosError = AxiosError<AuthError>
