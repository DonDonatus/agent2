import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value;
  if (userId !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { userId: targetUserId, newPassword } = await req.json();

  if (!targetUserId || !newPassword) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { userId: targetUserId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { userId: targetUserId },
    data: { password: hashedPassword },
  });

  return NextResponse.json({ success: true });
}
