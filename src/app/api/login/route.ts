// /app/api/login/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { userId, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { userId } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set('auth', 'true', { path: '/' });
  res.cookies.set('userId', userId, { path: '/' });

  return res;
}
