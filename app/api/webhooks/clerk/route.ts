import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { neon } from '@neondatabase/serverless';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
    }>;
  };
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const headers = {
      'svix-id': request.headers.get('svix-id')!,
      'svix-timestamp': request.headers.get('svix-timestamp')!,
      'svix-signature': request.headers.get('svix-signature')!,
    };

    const wh = new Webhook(webhookSecret);
    const evt = wh.verify(payload, headers) as ClerkWebhookEvent;

    const eventType = evt.type;

    if (eventType === 'user.created') {
      const { id: clerkUserId, email_addresses } = evt.data;
      const email = email_addresses[0]?.email_address;

      if (!email) {
        console.error('No email found for user:', clerkUserId);
        return NextResponse.json({ error: 'No email' }, { status: 400 });
      }

      const sql = neon(process.env.DATABASE_URL!);

      // Check if user already exists (from payment or invite)
      const existingUser = await sql`
        SELECT tier, lifetime_access FROM users WHERE email = ${email}
      `;

      // REJECT signup if user hasn't paid or been invited
      if (existingUser.length === 0) {
        console.error('❌ REJECTED: User attempted signup without payment or invite:', email);
        
        // We can't delete the Clerk user from here easily, but we can refuse to create the DB record
        // The user will exist in Clerk but won't have database access
        // Your app should check if user exists in database and show payment page if not
        
        return NextResponse.json({ 
          error: 'Payment or invite required before signup',
          message: 'Please complete payment or use an invite link first'
        }, { status: 403 });
      }

      const tier = existingUser[0].tier;
      const lifetimeAccess = existingUser[0].lifetime_access;

      // Only create database record if they have paid or been invited
      await sql`
        INSERT INTO users (clerk_user_id, email, tier, lifetime_access, created_at)
        VALUES (${clerkUserId}, ${email}, ${tier}, ${lifetimeAccess}, NOW())
        ON CONFLICT (email) 
        DO UPDATE SET 
          clerk_user_id = ${clerkUserId},
          updated_at = NOW()
      `;

      console.log('✅ User approved and created in database:', email, 'tier:', tier, 'lifetime_access:', lifetimeAccess);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Clerk webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}