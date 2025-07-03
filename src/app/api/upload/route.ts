// app/api/upload/route.ts
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileExt = file.name.split('.').pop();
  const uniqueName = `${uuidv4()}.${fileExt}`;
  const filePath = join(process.cwd(), 'public', 'uploads', uniqueName);

  await writeFile(filePath, buffer);

  const fileUrl = `/uploads/${uniqueName}`;

  return NextResponse.json({ url: fileUrl, name: file.name });
}
