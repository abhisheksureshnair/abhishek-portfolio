import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

// Allowed origins — your own domain + localhost for dev
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://localhost:3000',
  // Add your Vercel production domain below after first deploy, e.g.:
  // 'https://your-portfolio.vercel.app',
  // 'https://yourname.dev',
];

export async function GET(request: NextRequest) {
  // ── 1. Referrer / Origin check ──────────────────────────────────────────────
  const referer = request.headers.get('referer') || '';
  const origin  = request.headers.get('origin')  || '';

  const isAllowed = ALLOWED_ORIGINS.some(
    (o) => referer.startsWith(o) || origin.startsWith(o)
  );

  // In development with no referer (e.g. direct fetch), allow anyway.
  // On production we block direct external access.
  const isDev = process.env.NODE_ENV !== 'production';
  if (!isDev && !isAllowed && referer !== '') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // ── 2. Read private image (outside /public) ──────────────────────────────────
  let imageBuffer: Buffer;
  try {
    // process.cwd() = project root at build/runtime
    const filePath = path.join(process.cwd(), 'src', 'private-assets', 'photo.jpg');
    imageBuffer = await readFile(filePath);
  } catch {
    return new NextResponse('Not Found', { status: 404 });
  }

  // ── 3. Return with strong security headers ───────────────────────────────────
  return new NextResponse(new Uint8Array(imageBuffer), {
    status: 200,
    headers: {
      // Serve inline — do NOT trigger "Save As" dialog
      'Content-Type':        'image/jpeg',
      'Content-Disposition': 'inline; filename="photo.jpg"',

      // Block search engine indexing of the endpoint
      'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',

      // Block hotlinking from other sites
      'X-Frame-Options': 'SAMEORIGIN',

      // Never expose in browser cache or CDN cache
      'Cache-Control': 'private, no-store, no-cache, must-revalidate',
      'Pragma':        'no-cache',

      // CORS — only same-origin JS can request this
      'Access-Control-Allow-Origin': 'self',

      // Prevent MIME sniffing
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
