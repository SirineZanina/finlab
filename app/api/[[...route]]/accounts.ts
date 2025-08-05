// zod
import z from 'zod';
import { zValidator } from '@hono/zod-validator';
// hono
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
// prisma
import { Account } from '@prisma/client';
import { prisma } from '@/lib/prisma';
// middleware
import { withSession } from '@/lib/middleware';
// utils
import { parseStringify } from '@/lib/utils';
// api types
import {
  CreateAccountResponse,
  DeleteAccountResponse,
  DeleteMultipleAccountsResponse,
  GetAccountsResponse,
  GetAccountsVariables,
  UpdateAccountResponse }
  from '@/types/api/accounts';
// schema types
import { CreateAccountSchema, UpdateAccountSchema } from '@/types/schemas/account-schema';

// Main accounts router
export const accountsRouter = new Hono<{
  Variables: GetAccountsVariables;
}>()
  // GET /accounts
  .get('/', withSession, async (c) => {
    const businessId: string = c.get('businessId') as string;

    if (!businessId) {
      return c.json({ error: 'Unauthorized'}, 401);
    }

    const accounts: Account[] = await prisma.account.findMany({
      where: { businessId },
    });

    const response: GetAccountsResponse = {
      success: true,
      data: parseStringify(accounts),
    };

    return c.json<GetAccountsResponse>(response, 200);
  })

  // GET /accounts/:id
  .get('/:id', withSession, zValidator('param', z.object({
    id: z.string()
  })), async (c) => {
    const businessId: string = c.get('businessId') as string;
    const { id } = c.req.valid('param');

    if (!businessId) {
      return c.json({ error: 'Unauthorized'}, 401);
    }

    const account = await prisma.account.findFirst({
      where: {
        id,
        businessId
      },
	  select: {
        id: true,
        name: true
	  }
    });

    if (!account) {
      throw c.json({ error: 'Account not found' }, 404);
    }

    return c.json({
      success: true,
      data: account
    }, 200);
  })

  // POST /accounts
  .post('/', withSession, zValidator('json', CreateAccountSchema), async (c) => {
    const businessId: string = c.get('businessId') as string;
    const body = c.req.valid('json');

    if (!businessId) {
      return c.json({ error: 'Unauthorized'}, 401);
    }

    const account = await prisma.account.create({
      data: {
        ...body,
        businessId,
      },
    });

    const response: CreateAccountResponse = {
      success: true,
      data: parseStringify(account),
      message: 'Account created successfully'
    };

    return c.json<CreateAccountResponse>(response, 201);
  })

  // PUT /accounts/:id
  .patch('/:id', withSession,
    zValidator('param', z.object({
      id: z.string().optional()
    })),
    zValidator('json',UpdateAccountSchema),
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

      // Verify account belongs to user's business
      const existingAccount = await prisma.account.findFirst({
        where: {
          id: id,
          businessId
        },
      });

      if (!existingAccount) {
        return c.json({ error: "Account doesn't exist"}, 404);
      }

      const updatedAccount = await prisma.account.update({
        where: {
          id: id,
          businessId: businessId
        },
        data: body,
      });

      const response: UpdateAccountResponse = {
        success: true,
        data: parseStringify(updatedAccount),
        message: 'Account updated successfully'
      };

      return c.json<UpdateAccountResponse>(response, 200);
    })

  // DELETE /accounts/bulk-delete
  .delete('/bulk-delete', withSession, zValidator('json', z.object({
    accountIds: z.array(z.string()).min(1, 'At least one account ID is required')
  })), async (c) => {
    const businessId: string = c.get('businessId') as string;
    const { accountIds } = c.req.valid('json');

    if (!businessId) {
      throw new HTTPException(404, { message: 'Business ID not found.' });
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
        throw new HTTPException(404, { message: 'Some accounts not found.' });
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
      const businessId: string = c.get('businessId') as string;
      const { id } = c.req.valid('param');

	 if (!id) {
        return c.json({ error: 'Missing id'}, 400);
	  }

      if (!businessId) {
        return c.json({ error: 'Unauthorized'}, 401);
      }

      // Verify account belongs to user's business
      const existingAccount = await prisma.account.findFirst({
        where: {
          id: id,
          businessId
        },
      });

      if (!existingAccount) {
        return c.json({ error: "Account doesn't exist"}, 404);
      }

      const accountDeleted = await prisma.account.delete({
        where: {
          id: id,
          businessId: businessId
		 },
      });

      const response: DeleteAccountResponse = {
        success: true,
        message: `Account with id ${accountDeleted.id} deleted successfully`
      };

      return c.json<DeleteAccountResponse>(response, 200);
    });
