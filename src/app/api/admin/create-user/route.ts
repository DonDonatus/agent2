// /app/api/admin/create-user/route.ts
// ============================
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value;
  if (userId !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { userId: newUserId, password } = await req.json();

  if (!newUserId || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { userId: newUserId } });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { userId: newUserId, password: hashedPassword } });

  return NextResponse.json({ success: true });
}