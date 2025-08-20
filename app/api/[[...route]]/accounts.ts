import { Hono } from 'hono';

import z from 'zod';
import { zValidator } from '@hono/zod-validator';

import { Account } from '@prisma/client';
import { prisma } from '@/lib/prisma';
// Middleware
import { withSession } from '@/lib/middleware';
// Utils
import { encryptId, parseStringify } from '@/lib/utils';
// Schema types
import { CreateAccountSchema, UpdateAccountSchema } from '@/types/schemas/account-schema';
// Api types
import {
  CreateAccountResponse,
  DeleteAccountResponse,
  DeleteMultipleAccountsResponse,
  GetAccountsResponse,
  GetAccountResponse,
  UpdateAccountResponse
} from '@/types/api/accounts';
import { GetApiVariables, ApiErrorResponse } from '@/types/api/common';

// Main accounts router
export const accountsRouter = new Hono<{
  Variables: GetApiVariables;
}>()
  // GET /accounts
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

      const accounts: Account[] = await prisma.account.findMany({
        where: { businessId },
        include: {
          bank: true,
          currency: true
        }
      });

      const response: GetAccountsResponse = {
        success: true,
        data: parseStringify(accounts),
      };

      return c.json<GetAccountsResponse>(response, 200);
    } catch (error) {
      console.error('Error fetching accounts:', error);

      const errorResponse: ApiErrorResponse = {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch accounts',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      };
      return c.json(errorResponse, 500);
    }
  })

  // GET /accounts/:id
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

      const account = await prisma.account.findFirst({
        where: {
          id,
          businessId
        },
        include: {
		  bank: true,
		  currency: true
        }
      });

      if (!account) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Account not found'
          }
        };
        return c.json(errorResponse, 404);
      }

      const response: GetAccountResponse = {
        success: true,
        data: account,
        message: 'Account fetched successfully'
      };

      return c.json<GetAccountResponse>(response, 200);
    } catch (error) {
      console.error('Error fetching account:', error);

      const errorResponse: ApiErrorResponse = {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch account',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      };
      return c.json(errorResponse, 500);
    }
  })

  // POST /accounts
  .post('/', withSession, zValidator('json', CreateAccountSchema), async (c) => {
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

      const account = await prisma.account.create({
        data: {
          name: body.name,
          currencyId: body.currencyId,
          bankId: body.bankId,
		  shareableId: encryptId(body.name),
          businessId,
        },
      });

      const response: CreateAccountResponse = {
        success: true,
        data: parseStringify(account),
        message: 'Account created successfully'
      };

      return c.json<CreateAccountResponse>(response, 201);
    } catch (error) {
      console.error('Error creating account:', error);

      // Handle Prisma unique constraint errors
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: {
            code: 'DUPLICATE_ENTRY',
            message: 'Account with this name already exists',
            details: error
          }
        };
        return c.json(errorResponse, 409);
      }

      const errorResponse: ApiErrorResponse = {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create account',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      };
      return c.json(errorResponse, 500);
    }
  })

  // PATCH /accounts/:id
  .patch('/:id', withSession,
    zValidator('param', z.object({
      id: z.string().optional()
    })),
    zValidator('json', UpdateAccountSchema),
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
              message: 'Account ID is required'
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

        // Verify account belongs to user's business
        const existingAccount = await prisma.account.findFirst({
          where: {
            id: id,
            businessId
          },
        });

        if (!existingAccount) {
          const errorResponse: ApiErrorResponse = {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Account not found or does not belong to this business'
            }
          };
          return c.json(errorResponse, 404);
        }

        const updatedAccount = await prisma.account.update({
          where: {
            id: id,
            businessId: businessId
          },
          data: {
            ...(body.name !== undefined && { name: body.name }),
            ...(body.currencyId !== undefined && { currencyId: body.currencyId }),
            ...(body.bankId !== undefined && { bankId: body.bankId }),
          },
        });

        const response: UpdateAccountResponse = {
          success: true,
          data: parseStringify(updatedAccount),
          message: 'Account updated successfully'
        };

        return c.json<UpdateAccountResponse>(response, 200);
      } catch (error) {
        console.error('Error updating account:', error);

        // Handle Prisma unique constraint errors
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
          const errorResponse: ApiErrorResponse = {
            success: false,
            error: {
              code: 'DUPLICATE_ENTRY',
              message: 'Account with this name already exists',
              details: error
            }
          };
          return c.json(errorResponse, 409);
        }

        const errorResponse: ApiErrorResponse = {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to update account',
            details: error instanceof Error ? error.message : 'Unknown error'
          }
        };
        return c.json(errorResponse, 500);
      }
    })

  // DELETE /accounts/bulk-delete
  .delete('/bulk-delete', withSession, zValidator('json', z.object({
    accountIds: z.array(z.string()).min(1, 'At least one account ID is required')
  })), async (c) => {
    try {
      const businessId: string = c.get('businessId') as string;
      const { accountIds } = c.req.valid('json');

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

      // Verify all accounts belong to the user's business before deleting
      const result = await prisma.$transaction(async (tx) => {
        const accountsToDelete = await tx.account.findMany({
          where: {
            id: { in: accountIds },
            businessId
          },
        });

        if (accountsToDelete.length !== accountIds.length) {
          throw new Error('Some accounts do not belong to this business or do not exist');
        }

        const deletedAccounts = await tx.account.deleteMany({
          where: {
            id: { in: accountIds },
            businessId
          },
        });

        return {
          count: deletedAccounts.count,
          deletedAccountIds: accountsToDelete.map(a => a.id)
        };
      });

      const response: DeleteMultipleAccountsResponse = {
        success: true,
        message: `${result.count} account${result.count === 1 ? '' : 's'} deleted successfully`,
        data: {
          deletedCount: result.count,
          deletedAccountIds: result.deletedAccountIds
        }
      };

      return c.json<DeleteMultipleAccountsResponse>(response, 200);
    } catch (error) {
      console.error('Error bulk deleting accounts:', error);

      if (error instanceof Error && error.message.includes('do not belong to this business')) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: {
            code: 'INVALID_ACCOUNTS',
            message: 'Some accounts do not belong to this business or do not exist'
          }
        };
        return c.json(errorResponse, 404);
      }

      const errorResponse: ApiErrorResponse = {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete accounts',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      };
      return c.json(errorResponse, 500);
    }
  })

  // DELETE /accounts/:id
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
              message: 'Account ID is required'
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

        // Verify account belongs to user's business
        const existingAccount = await prisma.account.findFirst({
          where: {
            id: id,
            businessId
          },
        });

        if (!existingAccount) {
          const errorResponse: ApiErrorResponse = {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Account not found or does not belong to this business'
            }
          };
          return c.json(errorResponse, 404);
        }

        const accountDeleted = await prisma.account.delete({
          where: {
            id: id,
            businessId: businessId
          },
        });

        const response: DeleteAccountResponse = {
          success: true,
          message: 'Account deleted successfully',
		  data: {
            id: accountDeleted.id
		  }
        };

        return c.json<DeleteAccountResponse>(response, 200);
      } catch (error) {
        console.error('Error deleting account:', error);

        const errorResponse: ApiErrorResponse = {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to delete account',
            details: error instanceof Error ? error.message : 'Unknown error'
          }
        };
        return c.json(errorResponse, 500);
      }
    });
