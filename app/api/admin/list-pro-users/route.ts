import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Admin user IDs (add your Clerk user ID here)
const ADMIN_USER_IDS = [
  process.env.ADMIN_USER_ID || 'user_34z6SV6CUjsOp5GUOzhjq6L4wNO', // Your current user ID
];

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    // Check if user is admin
    if (!userId || !ADMIN_USER_IDS.includes(userId)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Fetch all pro users
    const users = await sql`
      SELECT email, tier, lifetime_access, created_at
      FROM users
      WHERE tier = 'pro' OR lifetime_access = true
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      users: users || [],
    });
  } catch (error) {
    console.error('Error fetching pro users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pro users' },
      { status: 500 }
    );
  }
}
