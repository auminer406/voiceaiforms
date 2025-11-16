export interface PaymentStatus {
  hasPaid: boolean;
  tier: string;
  lifetimeAccess: boolean;
}

/**
 * CLIENT-SIDE: Check payment status via API
 * Makes API request to check payment status
 */
export async function checkPaymentStatusClient(): Promise<PaymentStatus> {
  try {
    const response = await fetch('/api/check-payment');
    if (!response.ok) {
      return { hasPaid: false, tier: 'free', lifetimeAccess: false };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking payment status:', error);
    return { hasPaid: false, tier: 'free', lifetimeAccess: false };
  }
}
