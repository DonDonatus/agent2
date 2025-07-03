// /app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, userId: true, createdAt: true }
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Fetch users failed:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId || userId === 'admin') {
    return NextResponse.json({ error: 'Cannot delete this user' }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user failed:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
