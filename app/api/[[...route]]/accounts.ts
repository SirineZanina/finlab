// zod
import z from 'zod';
import { zValidator } from '@hono/zod-validator';
// hono
import { Context, Hono, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { getCookie } from 'hono/cookie';
// prisma
import { Account } from '@prisma/client';
import { prisma } from '@/lib/prisma';
// session
import { getUserFromSession } from '@/app/(auth)/_core/session/session';
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
import { createAccountSchema, updateAccountSchema } from '@/types/schemas/account-schema';

// ─── Middleware ──────────────────────────────────────────
const withSession = async (c: Context, next: Next) => {
  try {
    const fakeCookies = {
      get: (key: string) => {
        const value = getCookie(c, key);
        return value ? { name: key, value } : undefined;
      }
    };

    const user = await getUserFromSession(fakeCookies);
    if (!user || !user.businessId) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    c.set('userId', user.id);
    c.set('businessId', user.businessId);
    c.set('user', user);
    await next();
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    throw new HTTPException(401, { message: 'Authentication failed' });
  }
};

// Main accounts router with chained methods
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
  .post('/', withSession, zValidator('json', createAccountSchema), async (c) => {
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
    zValidator('json',updateAccountSchema),
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
    const existingAccounts = await prisma.account.findMany({
      where: {
        id: { in: accountIds },
        businessId
      },
      select: { id: true }
    });

    if (existingAccounts.length !== accountIds.length) {
      throw new HTTPException(403, {
        message: 'Some accounts do not belong to your business or do not exist'
      });
    }

    // Delete the accounts
    const result = await prisma.account.deleteMany({
      where: {
        id: { in: accountIds },
        businessId
      },
    });

    const response: DeleteMultipleAccountsResponse = {
      success: true,
      message: `${result.count} account${result.count === 1 ? '' : 's'} deleted successfully`,
      data: {
        deletedCount: result.count,
        deletedAccountIds: accountIds
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
