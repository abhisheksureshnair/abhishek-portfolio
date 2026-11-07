import { NextResponse } from 'next/server';
import { getGitHubProfileData } from '@/lib/github/githubService';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
  try {
    const data = await getGitHubProfileData();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to retrieve GitHub profile data' },
      { status: 500 }
    );
  }
}
