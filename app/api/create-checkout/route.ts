import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, affiliate_ref } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin') || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // You'll set this in env
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment for lifetime access
      success_url: `${baseUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}?canceled=true`,
      metadata: {
        affiliate_ref: affiliate_ref || '',
        campaign: '1000_founders',
        email: email,
      },
      allow_promotion_codes: true, // Enable promo codes
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
