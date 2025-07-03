import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  );

  // Clear the auth cookie
  response.cookies.set({
    name: 'auth',
    value: 'false',
    path: '/',
    maxAge: 0,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}