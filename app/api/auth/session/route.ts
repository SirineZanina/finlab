import { getUserFromSession } from '@/app/(auth)/_lib/utils/session/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const cookies = {
      get: (key: string) => {
        const cookie = request.cookies.get(key);
        return cookie ? { name: cookie.name, value: cookie.value } : undefined;
      }
    };

    const user = await getUserFromSession(cookies);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
