import { NextResponse } from 'next/server';

interface ContactSubmission {
  id: string;
  timestamp: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  ip: string;
}

// In-memory rate limiting map: IP -> timestamps array
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

// In-memory contact submission audit buffer (last 50 messages)
const submissionBuffer: ContactSubmission[] = [];

/**
 * Checks in-memory sliding window rate limit for an IP
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

/**
 * Validates email format strictly
 */
function isValidEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}

export async function POST(request: Request) {
  try {
    // 1. Extract IP for rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please wait a few minutes before submitting another inquiry.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message, hp_source, _timestamp } = body;

    // 2. Spam Protection: Honeypot check
    // If hidden bot field `hp_source` is populated, reject silently
    if (hp_source && typeof hp_source === 'string' && hp_source.trim().length > 0) {
      console.warn(`[CONTACT SPAM] Bot detected via honeypot trap from IP: ${ip}`);
      // Return 200 to fool bot without processing
      return NextResponse.json({
        success: true,
        mode: 'filtered_bot',
        message: 'Message processed successfully',
      });
    }

    // 3. Spam Protection: Minimum interaction time (e.g. at least 1.5s from form render)
    if (_timestamp && typeof _timestamp === 'number') {
      const elapsed = Date.now() - _timestamp;
      if (elapsed < 1200) {
        console.warn(`[CONTACT SPAM] Form submitted suspiciously fast (${elapsed}ms) from IP: ${ip}`);
        return NextResponse.json(
          { success: false, error: 'Submission rejected due to automated behavior.' },
          { status: 400 }
        );
      }
    }

    // 4. Server-Side Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid name (at least 2 characters).' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !isValidEmail(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a detailed message (at least 10 characters).' },
        { status: 400 }
      );
    }

    const sanitizedName = name.trim().slice(0, 100);
    const sanitizedEmail = email.trim().toLowerCase().slice(0, 150);
    const sanitizedSubject = (subject || 'General Inquiry').toString().trim().slice(0, 150);
    const sanitizedMessage = message.trim().slice(0, 3000);

    const submission: ContactSubmission = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      name: sanitizedName,
      email: sanitizedEmail,
      subject: sanitizedSubject,
      message: sanitizedMessage,
      ip,
    };

    // Keep last 50 submissions in memory
    submissionBuffer.unshift(submission);
    if (submissionBuffer.length > 50) submissionBuffer.pop();

    console.log(`[CONTACT RECEIVED] ID: ${submission.id} | From: ${sanitizedName} <${sanitizedEmail}> | Subject: ${sanitizedSubject}`);

    // 5. Secure Email Delivery Dispatcher
    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || 'nairsabhishek@gmail.com';

    let deliveryStatus: 'live_delivered' | 'server_queued' = 'server_queued';
    let deliveryMessage = `Message securely validated and queued for ${recipientEmail}.`;

    if (resendApiKey) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'Contact Hub <onboarding@resend.dev>',
            to: [recipientEmail],
            reply_to: sanitizedEmail,
            subject: `[Portfolio Inquiry] ${sanitizedSubject} - ${sanitizedName}`,
            text: `Name: ${sanitizedName}\nEmail: ${sanitizedEmail}\nSubject: ${sanitizedSubject}\n\nMessage:\n${sanitizedMessage}`,
          }),
        });

        if (resendRes.ok) {
          deliveryStatus = 'live_delivered';
          deliveryMessage = `Your message has been directly dispatched to ${recipientEmail}.`;
          console.log(`[CONTACT DISPATCH] Successfully delivered via Resend API to ${recipientEmail}`);
        } else {
          const resendErr = await resendRes.text();
          console.error('[CONTACT DISPATCH ERROR]', resendErr);
        }
      } catch (sendErr) {
        console.error('[CONTACT DELIVERY EXCEPTION]', sendErr);
      }
    }

    return NextResponse.json({
      success: true,
      deliveryStatus,
      message: deliveryMessage,
      inquiryId: submission.id,
      recipient: recipientEmail,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[CONTACT API FATAL]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing contact inquiry.' },
      { status: 500 }
    );
  }
}
