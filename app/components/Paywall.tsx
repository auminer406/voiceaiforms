'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Navigation from './Navigation';

export default function Paywall() {
  const { user } = useUser();
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          affiliate_ref: new URLSearchParams(window.location.search).get('ref') || ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-slate-900 to-indigo-900 text-white">
      <Navigation />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-4 py-2 mb-4">
              <p className="text-yellow-300 text-sm font-semibold">⚠️ Pro Subscription Required</p>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Upgrade to Access This Feature
            </h1>
            <p className="text-xl text-slate-300">
              Join 1000 founders getting lifetime Pro access for just $25
            </p>
          </div>

          {/* Pricing Card */}
          <div className="bg-slate-800/50 border-2 border-teal-500/30 rounded-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Limited Time Beta Launch
              </div>

              <div className="flex items-center justify-center gap-4 mb-2">
                <span className="text-3xl text-slate-500 line-through">$588/year</span>
                <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">
                  $25
                </span>
              </div>

              <p className="text-slate-400 text-lg">One-time payment. Lifetime access.</p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-teal-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-semibold mb-1">Unlimited Voice Forms</h3>
                  <p className="text-slate-400 text-sm">Create as many forms as you need</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-teal-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-semibold mb-1">Automated Workflows</h3>
                  <p className="text-slate-400 text-sm">Invoices, emails, auto-responders, and more</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-teal-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-semibold mb-1">Premium Voice AI</h3>
                  <p className="text-slate-400 text-sm">Natural conversations with ElevenLabs voice</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-teal-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-semibold mb-1">Form Templates Library</h3>
                  <p className="text-slate-400 text-sm">Pre-built templates for common use cases</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-teal-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-semibold mb-1">Priority Support</h3>
                  <p className="text-slate-400 text-sm">Get help from our team when you need it</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-teal-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="font-semibold mb-1">Lifetime Updates</h3>
                  <p className="text-slate-400 text-sm">All future features and improvements included</p>
                </div>
              </div>
            </div>

            {/* Email Input & CTA */}
            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                disabled={isLoading}
              />

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full px-8 py-4 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-lg font-semibold text-lg hover:from-teal-600 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Get Lifetime Access - $25 →'}
              </button>

              <p className="text-xs text-slate-500 text-center">
                Secure payment powered by Stripe. Cancel anytime (but you won't need to - it's lifetime!)
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-4">
              Trusted by 1000+ founders, contractors, and businesses
            </p>
            <div className="flex items-center justify-center gap-6 text-slate-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-sm">Email Support</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Lifetime Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
