import z from 'zod';
import crypto from 'crypto';
import { redisClient } from '@/redis/redis';
import { sessionSchema } from '../schema';

const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7; // 7 days
const COOKIE_SESSION_KEY = 'session-id';

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

export async function createUserSession(user: UserSession, cookies: Cookies){
  const sessionId = crypto.randomBytes(512).toString('hex').normalize();
  await redisClient.set(`session:${sessionId}`, sessionSchema.parse(user), {
    ex: SESSION_EXPIRATION_SECONDS,
	  });
	  setCookie(sessionId, cookies);
}

function setCookie(sessionId: string, cookies: Pick<Cookies, 'set'>) {
  cookies.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000, // Convert seconds to milliseconds
  });

}
