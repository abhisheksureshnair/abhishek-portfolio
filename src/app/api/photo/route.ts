import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

// ── Allowed origins ────────────────────────────────────────────────────────────
// Add every domain that legitimately loads this portfolio.
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://localhost:3000',
  'https://abhishek-portfolio-nine-navy.vercel.app',
  // If you add a custom domain later, add it here too:
  // 'https://yourname.dev',
];

// ── Shared security headers ────────────────────────────────────────────────────
const SECURITY_HEADERS = {
  'Content-Type':              'image/jpeg',
  'Content-Disposition':       'inline; filename="photo.jpg"',
  'X-Robots-Tag':              'noindex, nofollow, noarchive, nosnippet',
  'X-Frame-Options':           'SAMEORIGIN',
  'X-Content-Type-Options':    'nosniff',
  'Cache-Control':             'private, no-store, no-cache, must-revalidate',
  'Pragma':                    'no-cache',
};

function getAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) return null;

  return ALLOWED_ORIGINS.includes(origin) ? origin : null;
}

function getHeaders(request: NextRequest) {
  const allowedOrigin = getAllowedOrigin(request);

  return {
    ...SECURITY_HEADERS,
    // `self` is not a valid Access-Control-Allow-Origin value. Echo only a
    // validated origin so the canvas's crossOrigin="anonymous" image request
    // works locally and on the production Vercel domain.
    ...(allowedOrigin ? {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Vary': 'Origin',
    } : {}),
  };
}

export async function GET(request: NextRequest) {
  // ── 1. Referrer / Origin guard ─────────────────────────────────────────────
  const referer = request.headers.get('referer') || '';
  const origin  = request.headers.get('origin')  || '';

  const isAllowed = getAllowedOrigin(request) !== null || ALLOWED_ORIGINS.some(
    (allowedOrigin) => {
      try {
        return new URL(referer).origin === allowedOrigin;
      } catch {
        return false;
      }
    }
  );

  const isDev = process.env.NODE_ENV !== 'production';

  // Block requests from external referrers in production.
  // Allow empty-referer (e.g. canvas Image() fetch has no referer header).
  if (!isDev && !isAllowed && referer !== '') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // ── 2a. Vercel production: optimized, private single-variable image ──────
  // PHOTO_B64 contains the base64-encoded 512px production derivative. It is
  // intentionally stored only in Vercel Production environment variables.
  const photoBase64 = process.env.PHOTO_B64;

  if (photoBase64) {
    try {
      const imageBuffer = Buffer.from(photoBase64, 'base64');
      if (imageBuffer.length === 0) throw new Error('Empty photo payload');

      return new NextResponse(new Uint8Array(imageBuffer), {
        status: 200,
        headers: getHeaders(request),
      });
    } catch {
      // Fall through to file system if decode fails
    }
  }

  // ── 2b. Local dev / Vercel CLI deploy: read from private-assets ───────────
  try {
    const filePath = path.join(
      process.cwd(),
      'src',
      'private-assets',
      'photo.jpg'
    );
    const imageBuffer = await readFile(filePath);
    return new NextResponse(new Uint8Array(imageBuffer), {
      status: 200,
      headers: getHeaders(request),
    });
  } catch {
    // Neither env var nor file — return 404
    return new NextResponse('Not Found', { status: 404 });
  }
}
