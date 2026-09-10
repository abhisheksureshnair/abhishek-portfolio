import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log(`[CONTACT FORM] Message received from ${name} (${email}): ${message}`);

    return NextResponse.json({
      success: true,
      message: 'Message processed successfully',
      recipient: 'nairsabhishek@gmail.com',
      data: { name, email, message }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
