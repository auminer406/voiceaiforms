import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, affiliate_ref, timestamp } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // TODO: Add your High Level CRM webhook URL here
    const HIGHLEVEL_WEBHOOK_URL = process.env.HIGHLEVEL_WEBHOOK_URL;

    if (HIGHLEVEL_WEBHOOK_URL) {
      // Send to High Level CRM
      await fetch(HIGHLEVEL_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          affiliate_ref,
          timestamp,
          source: '1000_founders_campaign',
          campaign: 'lifetime_deal_25'
        }),
      });
    }

    // Log to console for now (you can add database storage later)
    console.log('Email captured:', {
      email,
      affiliate_ref,
      timestamp,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error capturing email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
