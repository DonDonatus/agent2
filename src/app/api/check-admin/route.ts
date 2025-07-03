// /app/api/check-admin/route.ts
// ============================
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const cookieHeader = req.headers.get('cookie');
  const isAdmin = cookieHeader?.includes('userId=admin') || false;
  return NextResponse.json({ isAdmin });
}