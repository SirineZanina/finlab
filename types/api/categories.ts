import { Category, User } from '@prisma/client';

// ─── Route Handler Variables ───────────────────────────────────────
export type GetCategoriesVariables = {
  userId: string;
  user: User;
  businessId: string;
}

// ─── API Response Types ───────────────────────────────────────
export type GetCategoriesResponse = {
  success: true;
  data: Omit<Category, 'createdAt' | 'updatedAt' | 'businessId' | 'plaidId'>[];
}

export type GetCategoryResponse = {
	success: true,
	data: Category
}

export type CreateCategoryResponse = {
  success: true;
  data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
  message: string;
}

export type UpdateCategoryResponse = {
  success: true;
  data: Category;
  message: string;
}

export type BulkDeleteCategoriesResponse = {
	success: true;
	message: string;
	data: {
		deletedCount: number;
		deletedCategoriesIds: string[];
	};
}

export type DeleteCategoryResponse = {
  success: true;
  message: string;
}
