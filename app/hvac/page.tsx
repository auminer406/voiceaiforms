import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Voice Invoicing for HVAC Contractors | VoiceAIForms',
  description: 'Stop losing billable hours to incomplete service reports. HVAC contractors use VoiceAIForms to create detailed invoices in 60 seconds—hands-free. Join 1000 founders for $25 lifetime access.',
  keywords: 'HVAC invoicing software, HVAC service reports, voice invoicing, HVAC contractor app, field service invoicing, HVAC billing software',
  openGraph: {
    title: 'Voice Invoicing for HVAC Contractors - Get Paid Faster',
    description: 'Create detailed HVAC service invoices in 60 seconds using your voice. No typing. No apps. Just talk.',
    url: 'https://aivoiceforms.com/hvac',
    siteName: 'VoiceAIForms',
    images: [
      {
        url: 'https://aivoiceforms.com/images/VoiceAIFormsYouCanTalkTo.png',
        width: 1200,
        height: 630,
        alt: 'VoiceAIForms - Voice Invoicing for HVAC',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voice Invoicing for HVAC Contractors',
    description: 'Create HVAC invoices in 60 seconds using your voice. Join 1000 founders for $25.',
    images: ['https://aivoiceforms.com/images/VoiceAIFormsYouCanTalkTo.png'],
  },
};

export default function HVACLandingPage() {
  // Schema.org structured data
  const hvacServiceSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VoiceAIForms for HVAC Contractors",
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "HVAC Service Management",
    "operatingSystem": "Web, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "25",
      "priceCurrency": "USD",
      "priceValidUntil": "2025-11-27",
      "availability": "https://schema.org/InStock"
    },
    "description": "Voice-to-invoice software specifically designed for HVAC contractors. Create detailed service reports and invoices in 60 seconds using voice commands.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://aivoiceforms.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "HVAC",
        "item": "https://aivoiceforms.com/hvac"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do my techs need to learn new software?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. They just talk. The voice prompts guide them through every field. If they can have a conversation, they can use VoiceAIForms."
        }
      },
      {
        "@type": "Question",
        "name": "Does it work with my existing invoicing software?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. We integrate with QuickBooks, Stripe, Square, FreshBooks, and more. Or we can send invoices directly via email."
        }
      },
      {
        "@type": "Question",
        "name": "What if there's no cell signal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "VoiceAIForms works offline. Your tech's voice is recorded locally and syncs when they're back online."
        }
      },
      {
        "@type": "Question",
        "name": "Can I customize the invoice template?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. You control what questions get asked, what fields are required, and how the invoice looks."
        }
      },
      {
        "@type": "Question",
        "name": "Is this really $25 for life?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. This is a limited-time offer for the first 1000 founders. After Nov 27, 2025, it's $49/month. Lock in your price now."
        }
      }
    ]
  };

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hvacServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-slate-900 to-indigo-900 text-white">
        {/* Header */}
        <header className="container mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image 
                src="/images/VoiceAIFormsYouCanTalkTo.png" 
                alt="VoiceAIForms" 
                width={600} 
                height={180}
                className="h-32 w-auto ml-4"
              />
            </Link>
            <Link 
              href="/sign-in"
              className="relative px-6 py-2 rounded-lg overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-teal-500 via-indigo-500 to-teal-500 opacity-75 blur-sm group-hover:opacity-100 transition bg-[length:200%_100%] animate-gradient"></span>
              <span className="relative block bg-slate-900 px-6 py-2 rounded-lg">
                Sign In
              </span>
            </Link>
          </div>
        </header>

        {/* Breadcrumb Navigation */}
        <nav className="container mx-auto px-4 py-4">
          <ol className="flex items-center gap-2 text-sm text-slate-400">
            <li><Link href="/" className="hover:text-white transition">Home</Link></li>
            <li>/</li>
            <li className="text-white">HVAC</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Stop Losing <span className="text-teal-400">$30K/Year</span> to Incomplete Service Reports
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-8">
              HVAC contractors use VoiceAIForms to create detailed invoices in 60 seconds—hands-free. 
              No typing. No apps. Just talk, and your customer gets an invoice with a pay link.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/#pricing"
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-lg text-xl font-semibold hover:from-teal-600 hover:to-indigo-700 transition"
              >
                Join 1000 Founders - $25 →
              </Link>
              <Link
                href="/demo?formId=early-access-v1"
                className="px-8 py-4 bg-slate-800/50 border border-slate-700 rounded-lg text-xl font-semibold hover:bg-slate-700/50 transition"
              >
                Try the Demo
              </Link>
            </div>

            <p className="text-sm text-slate-400">
              Worth $588/year. Yours for $25. Forever. Offer ends Nov 27, 2025.
            </p>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              The $30K Problem Every HVAC Company Has
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="text-4xl mb-4">💸</div>
                <h3 className="text-xl font-semibold mb-3">Lost Billable Hours</h3>
                <p className="text-slate-300">
                  Your tech finishes a 4-hour job but only documents 3 hours. That's $85+ left on the table. Per job.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-semibold mb-3">Incomplete Reports</h3>
                <p className="text-slate-300">
                  "Did you check the refrigerant levels?" Customer calls back because there's no record. Another truck roll.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="text-xl font-semibold mb-3">Slow Payment Cycles</h3>
                <p className="text-slate-300">
                  Invoice sent 3 days after the job. Customer pays 30 days later. Your cash flow is bleeding.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-2xl font-semibold text-teal-400 mb-4">
                The average HVAC company loses $30,000/year to these problems.
              </p>
              <p className="text-lg text-slate-300">
                Not because your techs are bad. Because documentation sucks.
              </p>
            </div>
          </div>
        </section>

        {/* The Solution Section */}
        <section className="container mx-auto px-4 py-20 bg-slate-800/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              Voice-to-Invoice: The Solution Your Techs Will Actually Use
            </h2>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="text-5xl">1️⃣</div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Tech Finishes Job</h3>
                  <p className="text-slate-300 text-lg">
                    Packs up tools, pulls out phone. Taps "Create Invoice" button.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="text-5xl">2️⃣</div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Voice Guides Through Every Field</h3>
                  <p className="text-slate-300 text-lg mb-4">
                    "What's the customer name?" → "Sarah Johnson"<br/>
                    "What services did you provide?" → "Replaced condenser unit, recharged refrigerant, tested airflow"<br/>
                    "How many hours?" → "Four hours"<br/>
                    "Any parts used?" → "Yes, 3-ton condenser unit, 5 pounds R-410A"
                  </p>
                  <p className="text-teal-400 font-semibold">
                    Nothing gets missed. Every billable item captured.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="text-5xl">3️⃣</div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Customer Gets Invoice Instantly</h3>
                  <p className="text-slate-300 text-lg">
                    Email arrives with detailed service report, before/after photos, and a "Pay Now" button. 
                    Your tech is already driving to the next job.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/#pricing"
                className="inline-block px-8 py-4 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-lg text-xl font-semibold hover:from-teal-600 hover:to-indigo-700 transition"
              >
                Get Lifetime Access - $25 →
              </Link>
            </div>
          </div>
        </section>

        {/* ROI Calculator Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              The ROI: Get Paid 23 Days Faster
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-900/20 border border-red-700 rounded-xl p-8">
                <h3 className="text-2xl font-semibold mb-4 text-red-400">Without VoiceAIForms</h3>
                <ul className="space-y-3 text-slate-300">
                  <li>✗ Invoice sent 3 days after job</li>
                  <li>✗ Customer pays in 30 days (if you're lucky)</li>
                  <li>✗ <strong>Total: 33 days to get paid</strong></li>
                  <li>✗ $50K/month revenue = $50K tied up in receivables</li>
                  <li>✗ Can't afford to hire another tech</li>
                </ul>
              </div>

              <div className="bg-teal-900/20 border border-teal-700 rounded-xl p-8">
                <h3 className="text-2xl font-semibold mb-4 text-teal-400">With VoiceAIForms</h3>
                <ul className="space-y-3 text-slate-300">
                  <li>✓ Invoice sent instantly after job</li>
                  <li>✓ Customer pays in 7-10 days (pay link in email)</li>
                  <li>✓ <strong>Total: 7-10 days to get paid</strong></li>
                  <li>✓ $50K/month revenue = $11K tied up in receivables</li>
                  <li>✓ <strong>$39K cash flow unlocked → hire that tech</strong></li>
                </ul>
              </div>
            </div>

            <div className="mt-12 text-center bg-gradient-to-r from-teal-500/20 to-indigo-500/20 border border-teal-500 rounded-xl p-8">
              <p className="text-3xl font-bold mb-4">
                VoiceAIForms pays for itself in the first invoice.
              </p>
              <p className="text-xl text-slate-300">
                $25 one-time payment. Unlimited invoices. Forever.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20 bg-slate-800/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              Built for HVAC Contractors
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">✅ Hands-Free Operation</h3>
                <p className="text-slate-300">
                  Your tech's hands are full. They speak, we capture. No typing required.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">✅ Guided Checklists</h3>
                <p className="text-slate-300">
                  Ensures every critical field is captured: refrigerant levels, filter size, parts used.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">✅ Photo Attachments</h3>
                <p className="text-slate-300">
                  Before/after photos attached to every invoice. Proof of work. Fewer disputes.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">✅ Integrates with QuickBooks</h3>
                <p className="text-slate-300">
                  Automatically creates invoices in QuickBooks, Stripe, Square, or FreshBooks.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">✅ Instant Customer Delivery</h3>
                <p className="text-slate-300">
                  Customer gets email with invoice + pay link within 60 seconds of job completion.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">✅ Works Offline</h3>
                <p className="text-slate-300">
                  No signal in the basement? No problem. Syncs when back online.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              HVAC Contractors Love VoiceAIForms
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-2xl">
                    M
                  </div>
                  <div>
                    <p className="font-semibold">Mike Rodriguez</p>
                    <p className="text-sm text-slate-400">Rodriguez HVAC</p>
                  </div>
                </div>
                <p className="text-slate-300 italic">
                  "We increased monthly revenue by $12K just by capturing all the billable work we were forgetting to document. Game changer."
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-2xl">
                    J
                  </div>
                  <div>
                    <p className="font-semibold">Jennifer Kim</p>
                    <p className="text-sm text-slate-400">Cool Air Solutions</p>
                  </div>
                </div>
                <p className="text-slate-300 italic">
                  "My techs used to wait until end of day to write invoices. Now they do it on-site in 60 seconds. Customers pay faster too."
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-2xl">
                    D
                  </div>
                  <div>
                    <p className="font-semibold">David Chen</p>
                    <p className="text-sm text-slate-400">Chen Heating & Cooling</p>
                  </div>
                </div>
                <p className="text-slate-300 italic">
                  "Training new techs is so much easier. They just follow the voice prompts. No more missing critical details."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-20 bg-slate-800/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">Do my techs need to learn new software?</h3>
                <p className="text-slate-300">
                  No. They just talk. The voice prompts guide them through every field. If they can have a conversation, they can use VoiceAIForms.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">Does it work with my existing invoicing software?</h3>
                <p className="text-slate-300">
                  Yes. We integrate with QuickBooks, Stripe, Square, FreshBooks, and more. Or we can send invoices directly via email.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">What if there's no cell signal?</h3>
                <p className="text-slate-300">
                  VoiceAIForms works offline. Your tech's voice is recorded locally and syncs when they're back online.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">Can I customize the invoice template?</h3>
                <p className="text-slate-300">
                  Absolutely. You control what questions get asked, what fields are required, and how the invoice looks.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">Is this really $25 for life?</h3>
                <p className="text-slate-300">
                  Yes. This is a limited-time offer for the first 1000 founders. After Nov 27, 2025, it's $49/month. Lock in your price now.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-6">
              Join 1000 HVAC Contractors Getting Paid Faster
            </h2>
            
            <p className="text-2xl text-slate-300 mb-8">
              Lifetime Pro access for $25. Unlimited invoices. Forever.
            </p>

            <div className="bg-gradient-to-r from-teal-500/20 to-indigo-500/20 border border-teal-500 rounded-xl p-8 mb-8">
              <p className="text-3xl font-bold mb-4">
                ⏰ Offer Ends Nov 27, 2025 at 10PM MST
              </p>
              <p className="text-xl text-slate-300">
                After that, it's $49/month. Lock in $25 lifetime access now.
              </p>
            </div>

            <Link
              href="/#pricing"
              className="inline-block px-12 py-5 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-lg text-2xl font-semibold hover:from-teal-600 hover:to-indigo-700 transition shadow-lg"
            >
              Claim Your Spot - $25 →
            </Link>

            <p className="text-sm text-slate-400 mt-6">
              No monthly fees. No contracts. Just $25, one time, forever.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 border-t border-slate-700">
          <div className="text-center text-slate-400">
            <p className="mb-4">
              <Link href="/" className="hover:text-white transition">Home</Link>
              {' • '}
              <Link href="/demo" className="hover:text-white transition">Try Demo</Link>
              {' • '}
              <Link href="/#faq" className="hover:text-white transition">FAQ</Link>
            </p>
            <p className="text-sm">
              © 2025 WebSuite Media - All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
