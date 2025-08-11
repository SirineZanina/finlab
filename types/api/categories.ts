import { Category } from '@prisma/client';
import { ApiSuccessResponse } from './common';

// ─── API Response Types ───────────────────────────────────────
export type GetCategoriesResponse = ApiSuccessResponse<Omit<Category, 'createdAt' | 'updatedAt'>[]>;

export type GetCategoryResponse = ApiSuccessResponse<Category>;

export type CreateCategoryResponse = ApiSuccessResponse<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>;

export type UpdateCategoryResponse = ApiSuccessResponse<Category>;

export type BulkDeleteCategoriesResponse = ApiSuccessResponse<{
  deletedCount: number;
  deletedCategoriesIds: string[];
}>;

export type DeleteCategoryResponse = ApiSuccessResponse<{ id: string}>;
