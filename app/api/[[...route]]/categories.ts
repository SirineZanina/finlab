// zod
import z from 'zod';
import { zValidator } from '@hono/zod-validator';
// hono
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
// prisma
import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';
// middleware
import { withSession } from '@/lib/middleware';
// utils
import { parseStringify } from '@/lib/utils';
// schema types
import { CreateCategorySchema, UpdateCategorySchema } from '@/types/schemas/category-schema';
// api types
import {
  CreateCategoryResponse,
  DeleteCategoryResponse,
  BulkDeleteCategoriesResponse,
  GetCategoriesResponse,
  GetCategoriesVariables,
  UpdateCategoryResponse
} from '@/types/api/categories';

// Main categories router
export const categoriesRouter = new Hono<{
  Variables: GetCategoriesVariables;
}>()
  // GET /categories
  .get('/', withSession, async (c) => {
    const businessId: string = c.get('businessId') as string;

    if (!businessId) {
      return c.json({ error: 'Unauthorized'}, 401);
    }

    const categories: Category[] = await prisma.category.findMany({
      where: { businessId },
    });

    const response: GetCategoriesResponse = {
      success: true,
      data: parseStringify(categories),
    };

    return c.json<GetCategoriesResponse>(response, 200);
  })

  // GET /categories/:id
  .get('/:id', withSession, zValidator('param', z.object({
    id: z.string()
  })), async (c) => {
    const businessId: string = c.get('businessId') as string;
    const { id } = c.req.valid('param');

    if (!businessId) {
      return c.json({ error: 'Unauthorized'}, 401);
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
      throw c.json({ error: 'Category not found' }, 404);
    }

    return c.json({
      success: true,
      data: category
    }, 200);
  })

  // POST /categories
  .post('/', withSession, zValidator('json', CreateCategorySchema ), async (c) => {
    const businessId: string = c.get('businessId') as string;
    const body = c.req.valid('json');

    if (!businessId) {
      return c.json({ error: 'Unauthorized'}, 401);
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
  })

  // PUT /categories/:id
  .patch('/:id', withSession,
    zValidator('param', z.object({
      id: z.string().optional()
    })),
    zValidator('json', UpdateCategorySchema),
    async (c) => {
      const businessId: string = c.get('businessId') as string;

      const { id } = c.req.valid('param');
	  const body = c.req.valid('json');

	  if (!id) {
        return c.json({ error: 'Missing id'}, 400);
	  }

      if (!businessId) {
        return c.json({ error: 'Unauthorized'}, 401);
      }

      // Verify category belongs to user's business
      const existingCategory = await prisma.category.findFirst({
        where: {
          id: id,
          businessId
        },
      });

      if (!existingCategory) {
        return c.json({ error: "Category doesn't exist"}, 404);
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
    })

  // DELETE /categories/bulk-delete
  .delete('/bulk-delete', withSession, zValidator('json', z.object({
    categoryIds: z.array(z.string()).min(1, 'At least one category ID is required')
  })), async (c) => {
    const businessId: string = c.get('businessId') as string;
    const { categoryIds } = c.req.valid('json');

    if (!businessId) {
      throw new HTTPException(404, { message: 'Business ID not found.' });
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
        throw new HTTPException(404, { message: 'Some categories do not belong to this business.' });
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
      const businessId: string = c.get('businessId') as string;
      const { id } = c.req.valid('param');

	 if (!id) {
        return c.json({ error: 'Missing id'}, 400);
	  }

      if (!businessId) {
        return c.json({ error: 'Unauthorized'}, 401);
      }

      // Verify category belongs to user's business
      const existingCategory = await prisma.category.findFirst({
        where: {
          id: id,
          businessId
        },
      });

      if (!existingCategory) {
        return c.json({ error: "Category doesn't exist"}, 404);
      }

      const categoryDeleted = await prisma.category.delete({
        where: {
          id: id,
          businessId: businessId
		 },
      });

      const response: DeleteCategoryResponse = {
        success: true,
        message: `Category with id ${categoryDeleted.id} deleted successfully`
      };

      return c.json<DeleteCategoryResponse>(response, 200);
    });
