import { withSession } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import { ApiErrorResponse, GetApiVariables } from '@/types/api/common';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import z from 'zod';

export const countriesRouter = new Hono<{
	Variables: GetApiVariables
}>()
  .get('/', async (c) => {
    try {
	  // Fetch countries from the database or an external API
      const countries = await prisma.country.findMany({
        select: {
          id: true,
          name: true,
          code: true,
		  flagUrl: true,
		  dialCode: true,
		  phoneFormat: true,
        },
        orderBy: { name: 'asc' },
      });

	  if (!countries || countries.length === 0) {
        const errorResponse: ApiErrorResponse = {
		  success: false,
		  error: {
            code: 'NO_CURRENCIES_FOUND',
            message: 'No countries found for the business'
		  }
        };
        return c.json(errorResponse, 404);
	  }

	  return c.json({ success: true, data: countries });

    } catch (error) {
	  console.error('Error in countriesRouter:', error);
	  const errorResponse: ApiErrorResponse = {
        success: false,
        error: {
		  code: 'INTERNAL_SERVER_ERROR',
		  message: 'Failed to fetch countries',
		  details: error instanceof Error ? error.message : 'Unknown error'
        }
	  };
	  return c.json(errorResponse, 500);
    }
  })
  .get('/:id', zValidator('param', z.object({
    id: z.string()
  })), async (c) => {
    try {

      const { id } = c.req.valid('param');

      const country = await prisma.country.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
		  code: true,
		  flagUrl: true,
		  dialCode: true,
		  phoneFormat: true,
        }
      });

      if (!country) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Country not found'
          }
        };
        return c.json(errorResponse, 404);
      }

      return c.json({
        success: true,
        data: country
      }, 200);
    } catch (error) {
      console.error('Error fetching country:', error);

      const errorResponse: ApiErrorResponse = {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch country',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      };
      return c.json(errorResponse, 500);
    }
  });
