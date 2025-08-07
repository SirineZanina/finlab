// hono
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
// zod
import z from 'zod';
import { zValidator } from '@hono/zod-validator';
// date-fns
import { subDays, parse } from 'date-fns';
// prisma
import { prisma } from '@/lib/prisma';
// middleware
import { withSession } from '@/lib/middleware';
// utils
import { parseStringify } from '@/lib/utils';
// schema types
import { CreateTransactionSchema, UpdateTransactionSchema } from '@/types/schemas/transaction-schema';
// api types
import {
  BulkDeleteTransactionsResponse,
  CreateTransactionResponse,
  DeleteTransactionResponse,
  GetTransactionsResponse,
  GetTransactionsVariables,
  UpdateTransactionResponse
} from '@/types/api/transactions';

// Main transactions router
export const transactionsRouter = new Hono<{
  Variables: GetTransactionsVariables;
}>()
  // GET /transactions
  .get('/',
    withSession,
    zValidator('query', z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().cuid().optional(),
    })),
    async (c) => {
      const businessId: string = c.get('businessId') as string;

      if (!businessId) {
        return c.json({ error: 'Unauthorized'}, 401);
      }

	  const { from, to, accountId } = c.req.valid('query');

	  const defaultTo = new Date(); // in case we don't get a "to" date, we use today
	  const defaultFrom = subDays(defaultTo, 30); // default to 30 days ago

	  const startDate = from
	  	? parse(from, 'yyyy-MM-dd', new Date())
        : defaultFrom;

	  const endDate = to
	   	? parse(to, 'yyyy-MM-dd', new Date())
	   	: defaultTo;

      const data = await prisma.transaction.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate
          },
          ...(accountId && {
            accountId: accountId,
            account: {
              id: accountId,
              businessId: businessId
            }
          }),
        },
        orderBy: { date: 'desc' },
        select: {
          id: true,
		  date: true,
          name: true,
          payee: true,
          amount: true,
          notes: true,
          account: {
            select: {
              id: true,
              name: true,
            }
          },
          category: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      });

	  const response: GetTransactionsResponse = {
        success: true,
        data: parseStringify(data),
	  };
	  return c.json<GetTransactionsResponse>(response, 200);

    })

  // GET /transactions/:id
  .get('/:id',
    withSession,
    zValidator('param', z.object({
      id: z.string()
    })),
    async (c) => {
      const businessId: string = c.get('businessId') as string;
      const { id } = c.req.valid('param');

      if (!businessId) {
        return c.json({ error: 'Unauthorized'}, 401);
      }

      const transaction = await prisma.transaction.findFirst({
        where: {
          id: id,
          account: {
            businessId: businessId
          }
        },
        select: {
          id: true,
          date: true,
          name: true,
          payee: true,
          amount: true,
          notes: true,
		  paymentChannel: true,
          account: {
            select: {
              id: true,
            }
          },
          category: {
            select: {
              id: true,
            }
          }
        }
      });

      if (!transaction) {
        throw c.json({ error: 'Transaction not found' }, 404);
      }

      return c.json({
        success: true,
        data: transaction
      }, 200);
    })

  .get('/all',
    withSession,
    zValidator('query', z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().cuid().optional(),
    })),
    async (c) => {
      const businessId: string = c.get('businessId') as string;

      if (!businessId) {
        return c.json({ error: 'Unauthorized'}, 401);
      }

      const { from, to, accountId } = c.req.valid('query');

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from
        ? parse(from, 'yyyy-MM-dd', new Date())
        : defaultFrom;

      const endDate = to
        ? parse(to, 'yyyy-MM-dd', new Date())
        : defaultTo;

      // Build where clause step by step
      const whereClause: any = {
        account: {
          businessId: businessId // Only filter by businessId, not specific accountId
        }
      };

      // Add date filter only if dates are provided
      if (from || to) {
        whereClause.date = {
          gte: startDate,
          lte: endDate
        };
      }

      // Add specific account filter only if provided
      if (accountId) {
        whereClause.accountId = accountId;
      }

      console.log('Query filters:', {
        businessId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        accountId,
        whereClause: JSON.stringify(whereClause, null, 2)
      });

      const data = await prisma.transaction.findMany({
        where: whereClause,
        include: {
          account: true,
          category: true,
        },
        orderBy: { date: 'desc' },
      });

      console.log(`Found ${data.length} transactions`);

      const response: GetTransactionsResponse = {
        success: true,
        data: parseStringify(data),
      };
      return c.json<GetTransactionsResponse>(response, 200);
    })

  // POST /transactions
  .post('/',
    withSession,
    zValidator('json', CreateTransactionSchema ), async (c) => {
      const businessId: string = c.get('businessId') as string;

      if (!businessId) {
		  return c.json({ error: 'Unauthorized'}, 401);
      }

      const body = c.req.valid('json');

	  console.log('Creating transaction with body:', body);

      const transaction = await prisma.transaction.create({
        data: {
          ...body,
        }
	  });

	  const response: CreateTransactionResponse = {
        success: true,
        data: transaction,
        message: 'Transaction created successfully'
		  };

      return c.json<CreateTransactionResponse>(response, 201);

    })

  // PATCH /transactions/:id
  .patch('/:id', withSession,
    zValidator('param', z.object({
      id: z.string().optional()
    })),
    zValidator('json', UpdateTransactionSchema),
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

      // Verify transaction account belongs to user's business
      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          id: id,
          account: {
            businessId: businessId
		  },
        },
      });

      if (!existingTransaction) {
        return c.json({ error: "Transaction doesn't exist"}, 404);
      }

      const updatedTransaction = await prisma.transaction.update({
        where: {
          id: id,
          account: {
            businessId: businessId
		  }
        },
        data: body,
      });

      const response: UpdateTransactionResponse = {
        success: true,
        data: parseStringify(updatedTransaction),
        message: 'Transaction updated successfully'
      };

      return c.json<UpdateTransactionResponse>(response, 200);
    })

  // POST /transactions/bulk-create
  .post('/bulk-create',
    withSession,
    zValidator('json',
      z.array(CreateTransactionSchema)
    ),
    async (c) => {
      const businessId: string = c.get('businessId') as string;
      const transactionsData = c.req.valid('json');

      if (!businessId) {
        return c.json({ error: 'Unauthorized'}, 401);
      }

      try {
        const result = await prisma.$transaction(async (tx) => {
        // First, verify all accounts belong to the business
          const accountIds = [...new Set(transactionsData.map(t => t.accountId))];

          const validAccounts = await tx.account.findMany({
            where: {
              id: { in: accountIds },
              businessId
            },
            select: { id: true }
          });

          const validAccountIds = new Set(validAccounts.map(a => a.id));

          // Check if all provided accounts are valid
          const invalidAccountIds = accountIds.filter(id => !validAccountIds.has(id));
          if (invalidAccountIds.length > 0) {
            throw new HTTPException(403, {
              message: `Invalid account IDs: ${invalidAccountIds.join(', ')}`
            });
          }

          // Create all transactions
          const createdTransactions = await tx.transaction.createMany({
            data: transactionsData.map(transaction => ({
              ...transaction,
              // Ensure any required fields are included
              createdAt: new Date(),
              updatedAt: new Date()
            })),
            skipDuplicates: false // Set to true if you want to skip duplicates
          });

          return createdTransactions;
        });

        const response = {
          success: true,
          message: `${result.count} transaction${result.count === 1 ? '' : 's'} created successfully`,
          data: {
            createdCount: result.count
          }
        };

        return c.json(response, 201);

      } catch (error) {
        if (error instanceof HTTPException) {
          throw error;
        }

        console.error('Bulk create transactions error:', error);
        return c.json({
          success: false,
          error: 'Failed to create transactions'
        }, 500);
      }
    }
  )

  // DELETE /transactions/bulk-delete
  .delete('/bulk-delete',
    withSession,
    zValidator('json', z.object({
      transactionIds: z.array(z.string()).min(1, 'At least one transaction ID is required')
    })),
    async (c) => {
      const businessId: string = c.get('businessId') as string;
      const { transactionIds } = c.req.valid('json');

      if (!businessId) {
        return c.json({ error: 'Unauthorized'}, 401);
      }

      const result = await prisma.$transaction(async (tx) => {
      // Verify all transactions belong to the business
        const transactionsToDelete = await tx.transaction.findMany({
          where: {
            id: { in: transactionIds },
            account: { businessId }
          },
          select: { id: true }
        });

        if (transactionsToDelete.length !== transactionIds.length) {
          throw new HTTPException(403, {
            message: 'Some transactions do not belong to your business or do not exist'
          });
        }

        // Delete the transactions using the verified IDs
        const deletedTransactions = await tx.transaction.deleteMany({
          where: {
            id: { in: transactionsToDelete.map(t => t.id) }, // Use verified IDs
            account: { businessId }
          }
        });

        return {
          count: deletedTransactions.count,
          deletedTransactionIds: transactionsToDelete.map(t => t.id)
        };
      });

      const response: BulkDeleteTransactionsResponse = {
        success: true,
        message: `${result.count} transaction${result.count === 1 ? '' : 's'} deleted successfully`,
        data: {
          deletedCount: result.count,
          deletedTransactionsIds: result.deletedTransactionIds
        }
      };

      return c.json<BulkDeleteTransactionsResponse>(response, 200);
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

      // Verify transaction belongs to user's business
	  const existingTransaction = await prisma.transaction.findFirst({
        where: {
          id: id,
          account: {
            businessId
          }
        }
	  });

      if (!existingTransaction) {
        return c.json({ error: "Transaction doesn't exist"}, 404);
      }

      const transactionDeleted = await prisma.transaction.delete({
        where: {
          id,
		  account: {
            businessId
		  }
		 },
      });

      const response: DeleteTransactionResponse = {
        success: true,
        message: `Transaction with id ${transactionDeleted.id} deleted successfully`
      };

      return c.json<DeleteTransactionResponse>(response, 200);
    });
