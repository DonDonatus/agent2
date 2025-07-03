// File: src/app/api/conversations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Adjust the import path as necessary

// GET: Fetch all saved conversations
export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('GET /api/conversations error:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

// POST: Save or update a conversation
export async function POST(req: NextRequest) {
  try {
    const { id, title, messages } = await req.json();

    const upserted = await prisma.conversation.upsert({
      where: { id },
      update: {
        title,
        messages,
        updatedAt: new Date(),
        
      },
      create: {
        id,
        title,
        messages,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(upserted);
  } catch (error) {
    console.error('POST /api/conversations error:', error);
    return NextResponse.json({ error: 'Failed to save conversation' }, { status: 500 });
  }
}
