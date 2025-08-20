import { withSession } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import { ApiErrorResponse, GetApiVariables } from '@/types/api/common';
import { Hono } from 'hono';

export const countriesRouter = new Hono<{
	Variables: GetApiVariables
}>()
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
	  // Fetch countries from the database or an external API
      const countries = await prisma.country.findMany({
        select: {
          id: true,
          name: true,
          code: true
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
  });
