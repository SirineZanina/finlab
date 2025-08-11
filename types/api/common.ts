import { User } from '@prisma/client';

export type GetApiVariables = {
  userId: string;
  user: User;
  businessId: string;
}

export type ApiSuccessResponse<T> ={
  success: true;
  data: T;
  message?: string;
}

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

