'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown timer to Nov 27, 2025 10PM MST
  useEffect(() => {
    const targetDate = new Date('2025-11-27T22:00:00-07:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Detect affiliate ref parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      // Store in cookie for 30 days
      document.cookie = `affiliate_ref=${ref}; max-age=2592000; path=/`;
    }
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Get affiliate ref from cookie
      const cookies = document.cookie.split(';');
      const refCookie = cookies.find(c => c.trim().startsWith('affiliate_ref='));
      const affiliateRef = refCookie ? refCookie.split('=')[1] : null;

      // Capture email first
      await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          affiliate_ref: affiliateRef,
          timestamp: new Date().toISOString()
        })
      });

      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          affiliate_ref: affiliateRef
        })
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDemo = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Open in new tab for mobile
      window.open('/demo?formId=demo-form', '_blank');
    } else {
      // Open modal for desktop
      setShowDemoModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-slate-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-8 py-8">
        <div className="flex items-center justify-between">
          <Image
            src="/images/VoiceAIFormsYouCanTalkTo.png"
            alt="VoiceAIForms"
            width={600}
            height={180}
            className="h-32 w-auto ml-4"
          />

          <Link
            href="/sign-in"
            className="relative px-6 py-2 rounded-lg overflow-hidden group"
          >
            {/* Animated gradient border */}
            <span className="absolute inset-0 bg-gradient-to-r from-teal-500 via-indigo-500 to-teal-500 opacity-75 blur-sm group-hover:opacity-100 transition bg-[length:200%_100%] animate-gradient"></span>

            {/* Button background */}
            <span className="relative block bg-slate-900 px-6 py-2 rounded-lg">
              Sign In
            </span>
          </Link>

        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 bg-teal-500/20 rounded-full text-teal-300 text-sm mb-6">
            Early Access Lifetime Deal
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Join 1000 Founders.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">
              $25 for Life.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-8">
            Voice AI Forms. Pro features. Lifetime access.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="text-2xl">🔥</span>
            <span className="text-lg font-semibold text-teal-300">
              847 spots remaining
            </span>
          </div>

          {/* Email Capture Form */}
          <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-lg font-semibold hover:from-teal-600 hover:to-indigo-700 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Claim Your Spot - $25'}
              </button>
            </div>
          </form>

          <p className="text-sm text-slate-400">
            Worth $588/year. Yours for $25. Forever.
          </p>
        </div>
      </section>

      {/* Demo Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Every Form Deserves a <span className="text-teal-400">Conversation</span>
          </h2>

          {/* Video Placeholder */}
          <div className="relative aspect-video bg-slate-800/50 rounded-2xl overflow-hidden mb-8 border border-slate-700">
            <Image
              src="/images/VoiceAIFormsAppLayoutExample.png"
              alt="Formversation Demo"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-teal-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
                <p className="text-slate-300">Demo video coming soon</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={openDemo}
              className="px-8 py-4 bg-slate-800/50 border border-slate-700 rounded-lg font-semibold hover:bg-slate-700/50 transition"
            >
              Try Live Demo →
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            What You Get with Pro
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎤',
                title: 'Voice Recognition',
                description: 'Users speak their answers naturally - no typing required'
              },
              {
                icon: '🎨',
                title: 'Custom Themes',
                description: 'Match your brand with 5 beautiful themes'
              },
              {
                icon: '📊',
                title: 'Unlimited Forms',
                description: 'Create as many voice forms as you need'
              },
              {
                icon: '🔗',
                title: 'Webhook Integration',
                description: 'Connect to Zapier, Make, or your own systems'
              },
              {
                icon: '✨',
                title: 'Smart Validation',
                description: 'AI-powered confirmation and error handling'
              },
              {
                icon: '🚀',
                title: 'Priority Support',
                description: 'Get help when you need it most'
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-slate-800/30 border border-slate-700 rounded-xl">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            What Early Users Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Voice forms are a game-changer for our senior community. No more struggling with tiny keyboards!",
                author: "Sarah M.",
                role: "AARP Chapter Lead"
              },
              {
                quote: "We're getting 3x more form completions since switching to voice. People actually enjoy filling out our intake forms now.",
                author: "Dr. James K.",
                role: "Healthcare Provider"
              },
              {
                quote: "The $25 lifetime deal is insane value. I've already created 20 forms for different clients.",
                author: "Mike T.",
                role: "Marketing Agency Owner"
              }
            ].map((testimonial, i) => (
              <div key={i} className="p-6 bg-slate-800/30 border border-slate-700 rounded-xl">
                <p className="text-slate-300 mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            This Offer Ends Soon
          </h2>

          <div className="flex justify-center gap-4 mb-8">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((unit, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-center">
                  <span className="text-3xl font-bold text-teal-400">{unit.value}</span>
                </div>
                <span className="text-sm text-slate-400 mt-2">{unit.label}</span>
              </div>
            ))}
          </div>

          <p className="text-slate-300 mb-8">
            November 27, 2025 at 10:00 PM MST
          </p>

          <p className="text-lg font-semibold text-teal-300">
            Only 1000 spots. No exceptions.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "What happens after the 1000 spots are filled?",
                a: "The $25 lifetime deal ends permanently. Pro tier will be $49/month."
              },
              {
                q: "Can I upgrade to Agency tier later?",
                a: "Yes! Lifetime members can upgrade to Agency ($197/mo) anytime."
              },
              {
                q: "What's included in the Pro tier?",
                a: "Unlimited forms, 10k submissions/month, all themes, webhook integrations, and priority support."
              },
              {
                q: "Is there a money-back guarantee?",
                a: "Yes! 30-day full refund if you're not satisfied."
              },
              {
                q: "Will my price ever increase?",
                a: "Never. $25 lifetime means lifetime. You're grandfathered forever."
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 bg-slate-800/30 border border-slate-700 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                <p className="text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to Join?
          </h2>

          <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-lg font-semibold hover:from-teal-600 hover:to-indigo-700 transition disabled:opacity-50"
              >
                Claim Your Spot - $25
              </button>
            </div>
          </form>

          <p className="text-sm text-slate-400">
            30-day money-back guarantee • Secure payment via Stripe
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-400">
              © 2025 VoiceAIForms. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-slate-400">
              <Link href="/terms" className="hover:text-white transition">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
              <Link href="/contact" className="hover:text-white transition">Contact</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Modal (Desktop only) */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Try Voice Form Demo</h3>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                src="/demo?formId=early-access-v1"
                className="w-full h-full"
                allow="microphone"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
