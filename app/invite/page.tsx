'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function InvitePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          token: new URLSearchParams(window.location.search).get('token')
        })
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-slate-900 to-indigo-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8 max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4 text-teal-400">You're In! 🎉</h1>
          <p className="text-slate-300 mb-6">
            Free Pro access has been granted to {email}
          </p>
          <Link
            href="/sign-up"
            className="inline-block px-8 py-4 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-lg font-semibold hover:from-teal-600 hover:to-indigo-700 transition"
          >
            Create Your Account →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-slate-900 to-indigo-900 text-white flex items-center justify-center p-4">
      <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8 max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-teal-400">Free Pro Invite</h1>
        <p className="text-slate-300 mb-6">
          You've been invited to get free lifetime Pro access!
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-6 py-4 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-8 py-4 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-lg font-semibold hover:from-teal-600 hover:to-indigo-700 transition disabled:opacity-50"
          >
            {status === 'loading' ? 'Activating...' : 'Claim Free Pro Access'}
          </button>
        </form>
        {status === 'error' && (
          <p className="text-red-400 mt-4 text-sm">Invalid invite link</p>
        )}
      </div>
    </div>
  );
}