import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const auth = request.cookies.get('auth')?.value;
  const userId = request.cookies.get('userId')?.value;
  const url = request.nextUrl;

  const isLoginPage = url.pathname === '/';
  const isChatPage = url.pathname.startsWith('/chat');
  const isAdminPage = url.pathname.startsWith('/admin');

  if ((isChatPage || isAdminPage) && auth !== 'true') {
    return NextResponse.redirect(new URL('/', url));
  }

  if (isLoginPage && auth === 'true') {
    return NextResponse.redirect(new URL('/chat', url));
  }

  if (isAdminPage && userId !== 'admin') {
    return NextResponse.redirect(new URL('/chat', url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/chat', '/chat/:path*', '/admin', '/admin/:path*'],
};
