import { redisClient } from '@/redis/redis';
import crypto from 'crypto';
import { SESSION_EXPIRATION_SECONDS } from '@/constants/session';
import { Cookies, setCookie, UserSession } from './session';

export async function createUserSession(user: UserSession, cookies: Cookies){
  const sessionId = crypto.randomBytes(512).toString('hex').normalize();
  await redisClient.set(`session:${sessionId}`, JSON.stringify(user), {
    ex: SESSION_EXPIRATION_SECONDS,
	  });
	  setCookie(sessionId, cookies);
}
