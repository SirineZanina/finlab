
import { z } from 'zod';

// Schema for creating a new category (excludes auto-generated fields)
export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'category name is required'),
});

// Schema for updating an category (all fields optional)
export const UpdateCategorySchema = CreateCategorySchema.partial();

// Type inference
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>
