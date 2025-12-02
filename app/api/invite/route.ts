import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Secret token to prevent abuse
const INVITE_SECRET = process.env.INVITE_SECRET || 'your-secret-token-here';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, token } = body;

    // Verify the secret token
    if (token !== INVITE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid invite token' },
        { status: 403 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Create user with free pro access
    await sql`
      INSERT INTO users (email, tier, lifetime_access, created_at)
      VALUES (${email}, 'pro', true, NOW())
      ON CONFLICT (email) 
      DO UPDATE SET 
        tier = 'pro',
        lifetime_access = true,
        updated_at = NOW()
    `;

    return NextResponse.json({ 
      success: true,
      message: 'Pro access granted! Please sign up to activate your account.',
      signup_url: `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up`
    });
  } catch (error) {
    console.error('Error granting invite:', error);
    return NextResponse.json(
      { error: 'Failed to grant access' },
      { status: 500 }
    );
  }
}