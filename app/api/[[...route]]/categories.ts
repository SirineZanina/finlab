import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import z from 'zod';
import { zValidator } from '@hono/zod-validator';

import { prisma } from '@/lib/prisma';
// Middleware
import { withSession } from '@/lib/middleware';
// Utils
import { parseStringify } from '@/lib/utils';
// Schema types
import { CreateCategorySchema, UpdateCategorySchema } from '@/types/schemas/category-schema';
// Api types
import {
  CreateCategoryResponse,
  DeleteCategoryResponse,
  BulkDeleteCategoriesResponse,
  GetCategoriesResponse,
  UpdateCategoryResponse
} from '@/types/api/categories';
import { GetApiVariables, ApiErrorResponse } from '@/types/api/common';

// Main categories router
export const categoriesRouter = new Hono<{
  Variables: GetApiVariables;
}>()
  // GET /categories
  .get('/', withSession, async (c) => {
    try {
      const businessId: string = c.get('businessId') as string;

      if (!businessId) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Business ID is required'
          }
        };
        return c.json(errorResponse, 401);
      }

      const categories = await prisma.category.findMany({
        where: { businessId },
        select: {
          id: true,
          name: true
        },
      });

      const response: GetCategoriesResponse = {
        success: true,
        data: parseStringify(categories),
      };

      return c.json<GetCategoriesResponse>(response, 200);
    } catch (error) {
      console.error('Error fetching categories:', error);

      const errorResponse: ApiErrorResponse = {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch categories',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      };
      return c.json(errorResponse, 500);
    }
  })

  // GET /categories/:id
  .get('/:id', withSession, zValidator('param', z.object({
    id: z.string()
  })), async (c) => {
    try {
      const businessId: string = c.get('businessId') as string;
      const { id } = c.req.valid('param');

      if (!businessId) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Business ID is required'
          }
        };
        return c.json(errorResponse, 401);
      }

      const category = await prisma.category.findFirst({
        where: {
          id,
          businessId
        },
        select: {
          id: true,
          name: true
        }
      });

      if (!category) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Category not found'
          }
        };
        return c.json(errorResponse, 404);
      }

      return c.json({
        success: true,
        data: category
      }, 200);
    } catch (error) {
      console.error('Error fetching category:', error);

      const errorResponse: ApiErrorResponse = {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch category',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      };
      return c.json(errorResponse, 500);
    }
  })

  // POST /categories
  .post('/', withSession, zValidator('json', CreateCategorySchema), async (c) => {
    try {
      const businessId: string = c.get('businessId') as string;
      const body = c.req.valid('json');

      if (!businessId) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Business ID is required'
          }
        };
        return c.json(errorResponse, 401);
      }

      const category = await prisma.category.create({
        data: {
          ...body,
          businessId
        },
      });

      const response: CreateCategoryResponse = {
        success: true,
        data: parseStringify(category),
        message: 'Category created successfully'
      };

      return c.json<CreateCategoryResponse>(response, 201);
    } catch (error) {
      console.error('Error creating category:', error);

      // Handle Prisma unique constraint errors
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: {
            code: 'DUPLICATE_ENTRY',
            message: 'Category with this name already exists',
            details: error
          }
        };
        return c.json(errorResponse, 409);
      }

      const errorResponse: ApiErrorResponse = {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create category',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      };
      return c.json(errorResponse, 500);
    }
  })

  // PATCH /categories/:id
  .patch('/:id', withSession,
    zValidator('param', z.object({
      id: z.string().optional()
    })),
    zValidator('json', UpdateCategorySchema),
    async (c) => {
      try {
        const businessId: string = c.get('businessId') as string;
        const { id } = c.req.valid('param');
        const body = c.req.valid('json');

        if (!id) {
          const errorResponse: ApiErrorResponse = {
            success: false,
            error: {
              code: 'MISSING_ID',
              message: 'Category ID is required'
            }
          };
          return c.json(errorResponse, 400);
        }

        if (!businessId) {
          const errorResponse: ApiErrorResponse = {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Business ID is required'
            }
          };
          return c.json(errorResponse, 401);
        }

        // Verify category belongs to user's business
        const existingCategory = await prisma.category.findFirst({
          where: {
            id: id,
            businessId
          },
        });

        if (!existingCategory) {
          const errorResponse: ApiErrorResponse = {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Category not found or does not belong to this business'
            }
          };
          return c.json(errorResponse, 404);
        }

        const updatedCategory = await prisma.category.update({
          where: {
            id: id,
            businessId: businessId
          },
          data: body,
        });

        const response: UpdateCategoryResponse = {
          success: true,
          data: parseStringify(updatedCategory),
          message: 'Category updated successfully'
        };

        return c.json<UpdateCategoryResponse>(response, 200);
      } catch (error) {
        console.error('Error updating category:', error);

        // Handle Prisma unique constraint errors
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
          const errorResponse: ApiErrorResponse = {
            success: false,
            error: {
              code: 'DUPLICATE_ENTRY',
              message: 'Category with this name already exists',
              details: error
            }
          };
          return c.json(errorResponse, 409);
        }

        const errorResponse: ApiErrorResponse = {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to update category',
            details: error instanceof Error ? error.message : 'Unknown error'
          }
        };
        return c.json(errorResponse, 500);
      }
    })

  // DELETE /categories/bulk-delete
  .delete('/bulk-delete', withSession, zValidator('json', z.object({
    categoryIds: z.array(z.string()).min(1, 'At least one category ID is required')
  })), async (c) => {
    try {
      const businessId: string = c.get('businessId') as string;
      const { categoryIds } = c.req.valid('json');

      if (!businessId) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Business ID is required'
          }
        };
        return c.json(errorResponse, 401);
      }

      // Verify all categories belong to the user's business before deleting
      const result = await prisma.$transaction(async (tx) => {
        const categoriesToDelete = await tx.category.findMany({
          where: {
            id: { in: categoryIds },
            businessId
          }
        });

        if (categoriesToDelete.length !== categoryIds.length) {
          throw new Error('Some categories do not belong to this business or do not exist');
        }

        const deletedCategories = await tx.category.deleteMany({
          where: {
            id: { in: categoryIds },
            businessId
          }
        });

        return {
          count: deletedCategories.count,
          deletedCategoriesIds: categoriesToDelete.map(c => c.id)
        };
      });

      const response: BulkDeleteCategoriesResponse = {
        success: true,
        message: `${result.count} category${result.count === 1 ? '' : 's'} deleted successfully`,
        data: {
          deletedCount: result.count,
          deletedCategoriesIds: result.deletedCategoriesIds
        }
      };

      return c.json<BulkDeleteCategoriesResponse>(response, 200);
    } catch (error) {
      console.error('Error bulk deleting categories:', error);

      if (error instanceof Error && error.message.includes('do not belong to this business')) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: {
            code: 'INVALID_CATEGORIES',
            message: 'Some categories do not belong to this business or do not exist'
          }
        };
        return c.json(errorResponse, 404);
      }

      const errorResponse: ApiErrorResponse = {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete categories',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      };
      return c.json(errorResponse, 500);
    }
  })

  // DELETE /categories/:id
  .delete('/:id', withSession,
    zValidator(
      'param',
      z.object({
        id: z.string().optional()
      })
    ),
    async (c) => {
      try {
        const businessId: string = c.get('businessId') as string;
        const { id } = c.req.valid('param');

        if (!id) {
          const errorResponse: ApiErrorResponse = {
            success: false,
            error: {
              code: 'MISSING_ID',
              message: 'Category ID is required'
            }
          };
          return c.json(errorResponse, 400);
        }

        if (!businessId) {
          const errorResponse: ApiErrorResponse = {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Business ID is required'
            }
          };
          return c.json(errorResponse, 401);
        }

        // Verify category belongs to user's business
        const existingCategory = await prisma.category.findFirst({
          where: {
            id: id,
            businessId
          },
        });

        if (!existingCategory) {
          const errorResponse: ApiErrorResponse = {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Category not found or does not belong to this business'
            }
          };
          return c.json(errorResponse, 404);
        }

        const categoryDeleted = await prisma.category.delete({
          where: {
            id: id,
            businessId: businessId
          },
        });

        const response: DeleteCategoryResponse = {
          success: true,
          message: 'Category deleted successfully',
		  data: {
            id: categoryDeleted.id,
		  }
        };

        return c.json<DeleteCategoryResponse>(response, 200);
      } catch (error) {
        console.error('Error deleting category:', error);

        const errorResponse: ApiErrorResponse = {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to delete category',
            details: error instanceof Error ? error.message : 'Unknown error'
          }
        };
        return c.json(errorResponse, 500);
      }
    });
