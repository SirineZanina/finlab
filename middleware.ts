import { getUserFromSession, Cookies, updateUserSessionExpiration } from '@/app/(auth)/_core/session/session';
import { NextResponse, type NextRequest } from 'next/server';

const privateRoutesPrefix = ['/dashboard'];
const adminRoutesPrefix = ['/admin'];
const apiRoutesPrefix = ['/api'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware processing for API routes
  if (apiRoutesPrefix.some(prefix => path.startsWith(prefix))) {
    return NextResponse.next();
  }

  const response = (await middlewareAuth(request)) ?? NextResponse.next();

  updateUserSessionExpiration({
    set: (key, value, options) => {
      response.cookies.set({ ...options, name: key, value});
    },
    get: key => request.cookies.get(key),
  });

  return response;
}

async function middlewareAuth(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const compatibleCookies: Pick<Cookies, 'get'> = {
    get: (key: string) => request.cookies.get(key),
  };

  if (privateRoutesPrefix.some(prefix => path.startsWith(prefix))) {
    const user = await getUserFromSession(compatibleCookies);
    if (user == null) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (adminRoutesPrefix.some(prefix => path.startsWith(prefix))) {
    const user = await getUserFromSession(compatibleCookies);
    if (user == null) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    if (user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  return undefined;
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
