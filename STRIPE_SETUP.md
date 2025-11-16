# Stripe Paywall Setup Guide

This guide walks you through setting up the $25 lifetime paywall for VoiceAIForms.

## Overview

The paywall system is fully implemented and ready to use. You just need to:
1. Configure Stripe API keys
2. Create a Stripe product
3. Run the database migration
4. Set up the webhook endpoint

## Step 1: Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)
3. Add it to `.env.local`:
   ```bash
   STRIPE_SECRET_KEY=sk_test_your_key_here
   ```

## Step 2: Create Stripe Product

1. Go to [Stripe Products](https://dashboard.stripe.com/products)
2. Click **Add product**
3. Fill in:
   - **Name:** VoiceAIForms Lifetime Pro
   - **Description:** Lifetime access to VoiceAIForms Pro features
   - **Pricing:** One-time payment, $25.00 USD
4. Click **Save product**
5. Copy the **Price ID** (starts with `price_`)
6. Add it to `.env.local`:
   ```bash
   STRIPE_PRICE_ID=price_your_price_id_here
   ```

## Step 3: Run Database Migration

The users table migration already exists. Run it:

```bash
# Using psql directly
psql $DATABASE_URL -f migration-add-users-table.sql

# OR if you have the connection string in .env.local
source .env.local
psql $DATABASE_URL -f migration-add-users-table.sql
```

This creates the `users` table with these columns:
- `id` - Primary key
- `email` - User email (unique)
- `clerk_user_id` - Clerk user ID (unique)
- `tier` - 'free' or 'pro'
- `lifetime_access` - Boolean for lifetime access
- `affiliate_ref` - Optional affiliate reference
- `stripe_session_id` - Stripe checkout session ID
- `stripe_customer_id` - Stripe customer ID
- `created_at` / `updated_at` - Timestamps

## Step 4: Set Up Stripe Webhook

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Set endpoint URL:
   ```
   https://your-domain.com/api/webhooks/stripe
   ```
   For local development:
   ```
   Use Stripe CLI: stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Select these events to listen to:
   - `checkout.session.completed`
   - `checkout.session.expired` (optional)

5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add it to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

## Step 5: Configure Base URL

Add your base URL to `.env.local`:

```bash
# For production
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# For local development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Step 6: Optional - High Level CRM Integration

If you want to track conversions in High Level CRM:

```bash
HIGHLEVEL_WEBHOOK_URL=your_highlevel_webhook_url
```

## Complete .env.local Example

Your `.env.local` should have these Stripe-related variables:

```bash
# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_PRICE_ID=price_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# High Level CRM (optional)
HIGHLEVEL_WEBHOOK_URL=
```

## Testing the Payment Flow

### Test Mode (Recommended First)

1. Use test mode API keys (start with `sk_test_`)
2. Visit `/forms/create` - you should see the paywall
3. Enter your email and click payment button
4. Use Stripe test card: `4242 4242 4242 4242`
5. Any future expiry date, any CVC
6. Complete the payment
7. You should be redirected to `/thank-you?session_id=...`
8. Check the `users` table - you should see your entry with `tier='pro'` and `lifetime_access=true`
9. Try accessing `/forms/create` again - you should now see the form creation page

### Live Mode

1. Switch to live mode API keys in Stripe Dashboard
2. Update `.env.local` with live keys (start with `sk_live_`)
3. Test with a real payment (you can refund it later)
4. Verify webhook is receiving events in Stripe Dashboard

## Troubleshooting

### Payment succeeded but user still sees paywall

**Problem:** Webhook not configured or not firing

**Solution:**
1. Check Stripe webhook logs in dashboard
2. Verify `STRIPE_WEBHOOK_SECRET` is correct
3. Check webhook endpoint is accessible (test with Stripe CLI)
4. Look at server logs for webhook errors

### "Domain not verified" error

**Problem:** Different issue - this is for Resend email, not Stripe

**Solution:** See previous documentation about Resend setup

### User table doesn't exist

**Problem:** Migration not run

**Solution:** Run the migration:
```bash
psql $DATABASE_URL -f migration-add-users-table.sql
```

### Webhook signature verification failed

**Problem:** Wrong webhook secret

**Solution:**
1. Go to Stripe webhooks dashboard
2. Click on your endpoint
3. Click "Reveal" on signing secret
4. Copy the `whsec_...` value
5. Update `STRIPE_WEBHOOK_SECRET` in `.env.local`
6. Restart your dev server

## Architecture Overview

### Payment Flow

1. User visits `/forms/create`
2. `checkPaymentStatusClient()` checks if user has paid
3. If not paid → show `<Paywall />` component
4. User enters email → click button → creates Stripe checkout session
5. User redirected to Stripe Checkout → completes payment
6. Stripe sends `checkout.session.completed` webhook
7. Webhook handler creates/updates user in `users` table with `tier='pro', lifetime_access=true`
8. User redirected to `/thank-you?session_id=...`
9. User can now access all protected routes

### Protected Routes

These routes check payment status and show paywall if unpaid:
- `/forms/create` - Create new forms
- `/forms` - Forms list
- `/forms/[id]/edit` - Edit existing forms

### Payment Check Flow

**Client-side:**
```typescript
checkPaymentStatusClient() → /api/check-payment → lib/payment-check.ts
```

**Server-side:**
```typescript
checkUserPaymentStatus() → queries users table for clerk_user_id → returns {hasPaid, tier, lifetimeAccess}
```

## Files Reference

- `app/components/Paywall.tsx` - Paywall UI component
- `lib/payment-check.ts` - Payment validation logic
- `app/api/check-payment/route.ts` - Payment status API
- `app/api/create-checkout/route.ts` - Create Stripe session
- `app/api/webhooks/stripe/route.ts` - Handle Stripe webhooks
- `app/thank-you/page.tsx` - Post-payment success page
- `migration-add-users-table.sql` - Database schema

## Support

For issues:
1. Check Stripe webhook logs
2. Check server console for errors
3. Verify all environment variables are set
4. Test with Stripe CLI for local development
