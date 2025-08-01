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
// type
import { zValidator } from '@hono/zod-validator';
import { createAccountBody, CreateAccountResponse, DeleteAccountResponse, GetAccountsResponse, GetAccountsVariables, UpdateAccountResponse } from '@/types/api/accounts';
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
    if (!user) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    c.set('userId', user.id);
    c.set('user', user);
    await next();
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    throw new HTTPException(401, { message: 'Authentication failed' });
  }
};

// ─── Handler Functions ──────────────────────────────────────────
async function getAccountsHandler(c: Context) {
  const userId: string = c.get('userId') as string;

  const user: { businessId: string | null } | null = await prisma.user.findUnique({
    where: { id: userId },
    select: { businessId: true },
  });

  if (!user) {
    throw new HTTPException(404, { message: 'User not found' });
  }

  if (!user.businessId) {
    throw new HTTPException(404, { message: 'Business not found for this user' });
  }

  const accounts: Account[] = await prisma.account.findMany({
    where: { businessId: user.businessId },
  });

  if (!accounts.length) {
    throw new HTTPException(404, { message: 'No accounts found for this user' });
  }

  //   const totalBanks: number = accounts.length;
  //   const totalCurrentBalance: number = accounts.reduce(
  //     (sum: number, acc: Account) => sum + acc.currentBalance,
  //     0
  //   );

  const response: GetAccountsResponse = {
    success: true,
    data: parseStringify(accounts),
    // totalBanks,
    // totalCurrentBalance,
  };

  return c.json<GetAccountsResponse>(response, 200);
}

async function createAccountHandler(c: Context) {
  const userId: string = c.get('userId') as string;

  // Get VALIDATED request body from zValidator
  const body : createAccountBody = await c.req.json(); // This gives you the validated data

  const user: { businessId: string | null } | null = await prisma.user.findUnique({
    where: { id: userId },
    select: { businessId: true },
  });

  if (!user) {
    throw new HTTPException(404, { message: 'User not found' });
  }

  if (!user.businessId) {
    throw new HTTPException(404, { message: 'Business not found for this user' });
  }

  // Create new account
  const account = await prisma.account.create({
    data: {
      ...body,
      businessId: user.businessId,
    },
  });

  const response: CreateAccountResponse = {
    success: true,
    data: parseStringify(account),
    message: 'Account created successfully'
  };

  return c.json<CreateAccountResponse>(response, 201);
}

async function updateAccountHandler(  c: Context) {
  const userId: string = c.get('userId') as string;
  const accountId = c.req.param('id');

  // Get VALIDATED request body from zValidator
  const body : createAccountBody = await c.req.json(); // This gives you the validated data

  const user: { businessId: string | null } | null = await prisma.user.findUnique({
    where: { id: userId },
    select: { businessId: true },
  });

  if (!user || !user.businessId) {
    throw new HTTPException(404, { message: 'User or business not found' });
  }

  // Verify account belongs to user's business
  const existingAccount = await prisma.account.findFirst({
    where: {
      id: accountId,
      businessId: user.businessId
    },
  });

  if (!existingAccount) {
    throw new HTTPException(404, { message: 'Account not found' });
  }

  const updatedAccount = await prisma.account.update({
    where: { id: accountId },
    data: body,
  });

  const response: UpdateAccountResponse = {
    success: true,
    data: parseStringify(updatedAccount),
    message: 'Account updated successfully'
  };

  return c.json<UpdateAccountResponse>(response, 200);
}

async function deleteAccountHandler(c: Context) {
  const userId: string = c.get('userId') as string;
  const accountId = c.req.param('id');

  const user: { businessId: string | null } | null = await prisma.user.findUnique({
    where: { id: userId },
    select: { businessId: true },
  });

  if (!user || !user.businessId) {
    throw new HTTPException(404, { message: 'User or business not found' });
  }

  // Verify account belongs to user's business
  const existingAccount = await prisma.account.findFirst({
    where: {
      id: accountId,
      businessId: user.businessId
    },
  });

  if (!existingAccount) {
    throw new HTTPException(404, { message: 'Account not found' });
  }

  await prisma.account.delete({
    where: { id: accountId },
  });

  const response: DeleteAccountResponse = {
    success: true,
    message: 'Account deleted successfully'
  };

  return c.json<DeleteAccountResponse>(response, 200);
}

// ─── Accounts Router ──────────────────────────────────────────
export const accountsRouter = new Hono<{
  Variables: GetAccountsVariables;
}>()
  .use('*', withSession)
  .get('/', getAccountsHandler)
  .post('/', zValidator('json', createAccountSchema), createAccountHandler)
  .put('/:id', zValidator('json', updateAccountSchema), updateAccountHandler)
  .delete('/:id', deleteAccountHandler);
