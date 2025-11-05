'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const [isPayment, setIsPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if this is a payment success (has Stripe session_id)
    const sessionId = searchParams.get('session_id');
    setIsPayment(!!sessionId);
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-slate-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Payment Success Page
  if (isPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-slate-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 mx-auto mb-8 bg-teal-500/20 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to the Club! 🎉
            </h1>

            <p className="text-xl text-slate-300 mb-8">
              You're now a lifetime Pro member. Your account has been activated.
            </p>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4">What's Next?</h2>
              
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <h3 className="font-semibold mb-1">Create Your First Voice Form</h3>
                    <p className="text-slate-400">Head to your dashboard and start building</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <h3 className="font-semibold mb-1">Join Our Community</h3>
                    <p className="text-slate-400">Get tips, templates, and support from other founders</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <h3 className="font-semibold mb-1">Check Your Email</h3>
                    <p className="text-slate-400">We've sent you a welcome guide with pro tips</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/forms"
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-lg font-semibold hover:from-teal-600 hover:to-indigo-700 transition"
              >
                Go to Dashboard →
              </Link>
              <a
                href="https://discord.gg/YOUR_DISCORD_LINK"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-slate-800/50 border border-slate-700 rounded-lg font-semibold hover:bg-slate-700/50 transition"
              >
                Join Discord Community
              </a>
            </div>

            <p className="text-sm text-slate-400 mt-8">
              Questions? Email us at support@voiceaiforms.com
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Demo Completion Page (with social sharing)
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-slate-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 mx-auto mb-8 bg-teal-500/20 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Thanks for Trying VoiceAIForms! 🎤
          </h1>

          <p className="text-xl text-slate-300 mb-8">
            Pretty cool, right? Imagine using this for your own forms.
          </p>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Ready to Build Your Own?</h2>
            
            <p className="text-slate-300 mb-6">
              Join 1000 founders getting <strong className="text-teal-400">lifetime Pro access for just $25</strong>
            </p>

            <Link
              href="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-lg font-semibold hover:from-teal-600 hover:to-indigo-700 transition"
            >
              Claim Your Spot - $25 →
            </Link>

            <p className="text-sm text-slate-400 mt-4">
              Worth $588/year. Yours for $25. Forever.
            </p>
          </div>

          {/* Social Sharing */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Share with Your Network</h3>
            
            <div className="flex gap-3 justify-center">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Just tried @VoiceAIForms - voice forms are the future! Check it out:')}&url=${encodeURIComponent('https://voiceaiforms.com')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#1DA1F2] rounded-lg font-semibold hover:bg-[#1a8cd8] transition"
              >
                Share on Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://voiceaiforms.com')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#0077B5] rounded-lg font-semibold hover:bg-[#006399] transition"
              >
                Share on LinkedIn
              </a>
            </div>
          </div>

          <div className="text-sm text-slate-400">
            <Link href="/" className="hover:text-white transition">
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
