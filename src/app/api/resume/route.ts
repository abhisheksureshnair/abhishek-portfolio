import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

// Allowed origins for downloading the resume
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://localhost:3000',
  'https://abhishek-portfolio-nine-navy.vercel.app',
];

const SECURITY_HEADERS = {
  'Content-Type': 'application/pdf',
  'Content-Disposition': 'attachment; filename="Abhishek_S_Nair_Resume.pdf"',
  'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Cache-Control': 'private, no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
};

function isOriginAllowed(request: NextRequest): boolean {
  const referer = request.headers.get('referer') || '';
  const origin = request.headers.get('origin') || '';

  if (!referer && !origin) return true; // Direct user action or same-origin navigation

  return ALLOWED_ORIGINS.some((allowed) => {
    try {
      if (origin && origin === allowed) return true;
      if (referer && new URL(referer).origin === allowed) return true;
    } catch {
      // Invalid URL
    }
    return false;
  });
}

export async function GET(request: NextRequest) {
  const isDev = process.env.NODE_ENV !== 'production';

  // Anti-hotlink / anti-scraper guard for production
  if (!isDev && !isOriginAllowed(request)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Look for the PDF in private assets first, then fallback to public directory
  const candidatePaths = [
    path.join(process.cwd(), 'src', 'private-assets', 'resume.pdf'),
    path.join(process.cwd(), 'public', 'resume.pdf'),
  ];

  for (const filePath of candidatePaths) {
    try {
      const fileBuffer = await readFile(/*turbopackIgnore: true*/ filePath);
      return new NextResponse(new Uint8Array(fileBuffer), {
        status: 200,
        headers: SECURITY_HEADERS,
      });
    } catch {
      // Try next path
    }
  }

  return new NextResponse('Resume not found', { status: 404 });
}
