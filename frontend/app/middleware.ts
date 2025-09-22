import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';

export async function middleware(request: NextRequest) {
  const session = await auth();

  if (!session) {
    const requestedUrl = request.nextUrl.pathname;
    const signInUrl = new URL('/signin', request.nextUrl.origin);
    signInUrl.searchParams.set('callbackUrl', requestedUrl);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*'],
};
