import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import { readFile } from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import os from 'os';

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req: NextRequest): Promise<{ fields: any; files: any }> {
  const form = formidable({ multiples: false, uploadDir: os.tmpdir(), keepExtensions: true });
  return new Promise((resolve, reject) => {
    form.parse(req as any, (err: any, fields: any, files: any) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export async function POST(req: NextRequest) {
  const auth = req.cookies.get('auth')?.value;
  if (auth !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { fields, files } = await parseForm(req);
  const messages = JSON.parse(fields.messages || '[]');
  const latestMessage = messages[messages.length - 1]?.content;

  let fileContent = '';
  const uploadedFile = files.file;

  if (uploadedFile) {
    const filePath = uploadedFile.filepath || uploadedFile.path;
    const mime = uploadedFile.mimetype || uploadedFile.type;
    const ext = path.extname(uploadedFile.originalFilename || uploadedFile.name || '').toLowerCase();

    try {
      const buffer = await readFile(filePath);

      if (mime?.includes('pdf') || ext === '.pdf') {
        const pdfData = await pdfParse(buffer);
        fileContent = pdfData.text;
      } else if (mime?.includes('word') || ext === '.docx') {
        const docResult = await mammoth.extractRawText({ buffer });
        fileContent = docResult.value;
      } else if (mime?.startsWith('image/')) {
        fileContent = `Image uploaded: ${uploadedFile.originalFilename}`;
      } else {
        fileContent = 'Unsupported file type';
      }
    } catch (error) {
      console.error('File parsing failed:', error);
      return NextResponse.json({ content: 'Failed to read uploaded file.' }, { status: 400 });
    }
  }

  const question = latestMessage || fileContent;

  if (!question) {
    return NextResponse.json({ content: 'Please provide a message or file.' }, { status: 400 });
  }

  try {
    const aiRes = await fetch('http://localhost:8000/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (!aiRes.ok) {
      return NextResponse.json({ content: 'Server error. Try again.' }, { status: 500 });
    }

    const data = await aiRes.json();
    return NextResponse.json({ content: data.answer });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ content: 'Something went wrong.' }, { status: 500 });
  }
}
