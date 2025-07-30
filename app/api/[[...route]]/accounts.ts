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
import { GetAccountsResponse, GetAccountsVariables } from '@/types/api/accounts';

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
      throw new HTTPException(401, { message: 'Authentication required' });
    }

    c.set('userId', user.id);
    c.set('user', user);
    await next();
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    throw new HTTPException(401, { message: 'Authentication failed' });
  }
};

// ─── Hono Route ──────────────────────────────────────────
export const getAccounts = new Hono<{ Variables: GetAccountsVariables }>()
  .use('*', withSession)
  .get('/', async (c: Context) => {
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

    const totalBanks: number = accounts.length;
    const totalCurrentBalance: number = accounts.reduce(
      (sum: number, acc: Account) => sum + acc.currentBalance,
      0
    );

    const response: GetAccountsResponse = {
      success: true,
      data: parseStringify(accounts),
      totalBanks,
      totalCurrentBalance,
    };

    return c.json<GetAccountsResponse>(response);
  });
