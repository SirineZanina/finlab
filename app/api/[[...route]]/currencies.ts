import { withSession } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import { ApiErrorResponse, GetApiVariables } from '@/types/api/common';
import { Hono } from 'hono';

export const currenciesRouter = new Hono<{
	Variables: GetApiVariables
}>()
  .get('/', async (c) => {
    try {

	  const currencies = await prisma.currency.findMany({
        select: {
          id: true,
          name: true,
          code: true,
          symbol: true,
        },
        orderBy: { name: 'asc' }
	  });

	  if (!currencies || currencies.length === 0) {
        const errorResponse: ApiErrorResponse = {
		  success: false,
		  error: {
            code: 'NO_CURRENCIES_FOUND',
            message: 'No currencies found for the business'
		  }
        };
        return c.json(errorResponse, 404);
	  }

	  return c.json({ success: true, data: currencies });

    } catch (error) {
      console.error('Error in currencyRouter:', error);
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch currencies',
		  details: error instanceof Error ? error.message : 'Unknown error'
        }
      };
      return c.json(errorResponse, 500);
    }
  });
