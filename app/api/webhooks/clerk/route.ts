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

      // Create or update in users table
      await sql`
        INSERT INTO users (clerk_user_id, email, tier, lifetime_access, created_at)
        VALUES (${clerkUserId}, ${email}, 'free', false, NOW())
        ON CONFLICT (email) 
        DO UPDATE SET 
          clerk_user_id = ${clerkUserId},
          updated_at = NOW()
      `;

      console.log('User created in database:', email);
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