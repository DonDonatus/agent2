import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function DELETE(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  if (userId === 'admin') {
    return NextResponse.json({ error: 'Cannot delete admin account' }, { status: 403 });
  }

  try {
    await prisma.user.delete({ where: { userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}
