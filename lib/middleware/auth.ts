import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { getUserFromSession } from '@/app/(auth)/_lib/utils/session/session';

export const withSession = async (c: Context, next: Next) => {
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
