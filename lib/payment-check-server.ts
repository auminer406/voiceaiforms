import { neon } from '@neondatabase/serverless';
import { auth } from '@clerk/nextjs/server';

export interface PaymentStatus {
  hasPaid: boolean;
  tier: string;
  lifetimeAccess: boolean;
}

/**
 * SERVER-SIDE ONLY: Check if the current user has paid for access
 * Returns payment status from the users table
 */
export async function checkUserPaymentStatus(): Promise<PaymentStatus> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { hasPaid: false, tier: 'free', lifetimeAccess: false };
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Check if user exists in users table with payment
    const result = await sql`
      SELECT tier, lifetime_access
      FROM users
      WHERE clerk_user_id = ${userId}
      LIMIT 1
    `;

    if (result.length === 0) {
      // User not in payment table yet
      return { hasPaid: false, tier: 'free', lifetimeAccess: false };
    }

    const user = result[0];
    const hasPaid = user.tier === 'pro' && user.lifetime_access === true;

    return {
      hasPaid,
      tier: user.tier as string,
      lifetimeAccess: user.lifetime_access as boolean
    };
  } catch (error) {
    console.error('Error checking payment status:', error);
    return { hasPaid: false, tier: 'free', lifetimeAccess: false };
  }
}
