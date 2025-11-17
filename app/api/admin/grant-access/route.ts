import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Admin user IDs (add your Clerk user ID here)
const ADMIN_USER_IDS = [
  process.env.ADMIN_USER_ID || 'user_34z6SV6CUjsOp5GUOzhjq6L4wNO', // Your current user ID
];

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    // Check if user is admin
    if (!userId || !ADMIN_USER_IDS.includes(userId)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Grant pro access
    await sql`
      INSERT INTO users (email, tier, lifetime_access, created_at, updated_at)
      VALUES (${email.toLowerCase()}, 'pro', true, NOW(), NOW())
      ON CONFLICT (email)
      DO UPDATE SET
        tier = 'pro',
        lifetime_access = true,
        updated_at = NOW()
    `;

    return NextResponse.json({
      success: true,
      message: `Pro access granted to ${email}`,
    });
  } catch (error) {
    console.error('Error granting access:', error);
    return NextResponse.json(
      { error: 'Failed to grant access' },
      { status: 500 }
    );
  }
}
