'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Navigation from '@/app/components/Navigation';
import { checkPaymentStatusClient } from '@/lib/payment-check-client';

export default function ProfilePage() {
  const { user } = useUser();
  const [paymentStatus, setPaymentStatus] = useState<{
    hasPaid: boolean;
    tier: string;
    lifetimeAccess: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPaymentStatus() {
      const status = await checkPaymentStatusClient();
      setPaymentStatus(status);
      setLoading(false);
    }
    loadPaymentStatus();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

          {/* User Info */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Profile</h2>
            <div className="space-y-3">
              <div>
                <label className="text-slate-400 text-sm">Email</label>
                <p className="text-white">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Name</label>
                <p className="text-white">{user?.fullName || 'Not set'}</p>
              </div>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Subscription Status</h2>

            {loading ? (
              <p className="text-slate-400">Loading...</p>
            ) : paymentStatus?.hasPaid ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 font-semibold">Lifetime Pro Member</span>
                </div>
                <p className="text-slate-400">
                  You have lifetime access to all VoiceAIForms Pro features.
                </p>
                <div className="mt-4 p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">Your Benefits:</h3>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>✓ Unlimited voice forms</li>
                    <li>✓ Automated workflows & invoices</li>
                    <li>✓ Premium voice AI</li>
                    <li>✓ Form templates library</li>
                    <li>✓ Priority support</li>
                    <li>✓ All future updates</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                  <span className="text-slate-400 font-semibold">Free Plan</span>
                </div>
                <p className="text-slate-400">
                  Upgrade to Pro for unlimited forms and automated workflows.
                </p>
                <a
                  href="/forms/create"
                  className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-teal-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-indigo-700 transition"
                >
                  Upgrade to Pro - $25 Lifetime →
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
