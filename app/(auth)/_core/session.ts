'use server';
import z from 'zod';
import { redisClient } from '@/redis/redis';
import { sessionSchema } from '../_nextjs/schema';
import { COOKIE_SESSION_KEY, SESSION_EXPIRATION_SECONDS } from '@/constants';

// This type represents the minimal data stored in Redis
export type UserSession = z.infer<typeof sessionSchema>;

export type Cookies = {
	set: (
		key: string,
		value: string,
		options?: {
			secure?: boolean
			httpOnly?: boolean
			sameSite?: 'strict' | 'lax'
			expires?: number
		}
	) => void;
	get: (key: string) => { name: string; value: string} | undefined;
	delete: (key: string) => void;
}

export async function getUserFromSession(cookies: Pick<Cookies, 'get'>) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (!sessionId) return null;

  return getUserSessionById(sessionId);

}

export async function updateUserSession(user: UserSession, cookies: Pick<Cookies, 'get'>) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;

  if (sessionId == null) return null;
  await redisClient.set(`session:${sessionId}`, JSON.stringify(user), {
    ex: SESSION_EXPIRATION_SECONDS,
	  });

}
export async function removeUserFromSession(cookies: Pick<Cookies, 'get' | 'delete'>) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;

  if (sessionId == null) return null;

  await redisClient.del(`session:${sessionId}`);
  cookies.delete(COOKIE_SESSION_KEY);

}

export async function setCookie(sessionId: string, cookies: Pick<Cookies, 'set'>) {
  cookies.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000, // Convert seconds to milliseconds
  });

}

async function getUserSessionById(sessionId: string) {
  const rawUser = await redisClient.get(`session:${sessionId}`);

  const { success, data: user } = sessionSchema.safeParse(rawUser);

  return success ? user : null;
}

export async function updateUserSessionExpiration(cookies: Pick<Cookies, 'set' | 'get'>) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;

  if (sessionId == null) return;

  const user = await getUserSessionById(sessionId);
  if (user == null) return;

  await redisClient.set(`session:${sessionId}`, user, {
    ex: SESSION_EXPIRATION_SECONDS
  });

  setCookie(sessionId, cookies);
}
