import { NextResponse } from 'next/server';
import { checkUserPaymentStatus } from '@/lib/payment-check';

export async function GET() {
  try {
    const status = await checkUserPaymentStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error in check-payment API:', error);
    return NextResponse.json(
      { hasPaid: false, tier: 'free', lifetimeAccess: false },
      { status: 500 }
    );
  }
}
