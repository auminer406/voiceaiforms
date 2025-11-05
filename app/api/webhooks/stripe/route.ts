import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { neon } from '@neondatabase/serverless';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Extract customer info
        const email = session.customer_email || session.customer_details?.email;
        const affiliateRef = session.metadata?.affiliate_ref;
        const sessionId = session.id;
        const amountTotal = session.amount_total;
        
        console.log('Payment successful:', {
          email,
          affiliateRef,
          sessionId,
          amountTotal,
        });

        // Store in database
        const sql = neon(process.env.DATABASE_URL!);
        
        // Create or update user with lifetime access
        await sql`
          INSERT INTO users (email, tier, lifetime_access, affiliate_ref, stripe_session_id, created_at)
          VALUES (${email}, 'pro', true, ${affiliateRef || null}, ${sessionId}, NOW())
          ON CONFLICT (email) 
          DO UPDATE SET 
            tier = 'pro',
            lifetime_access = true,
            stripe_session_id = ${sessionId},
            updated_at = NOW()
        `;

        // Send to High Level CRM
        const HIGHLEVEL_WEBHOOK_URL = process.env.HIGHLEVEL_WEBHOOK_URL;
        if (HIGHLEVEL_WEBHOOK_URL) {
          await fetch(HIGHLEVEL_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              affiliate_ref: affiliateRef,
              event: 'payment_completed',
              amount: amountTotal ? amountTotal / 100 : 25,
              session_id: sessionId,
              timestamp: new Date().toISOString(),
            }),
          });
        }

        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session expired:', session.id);
        
        // You could track abandoned carts here
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
