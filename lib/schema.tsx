// lib/schema.tsx
// Reusable Schema.org structured data components for SEO

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VoiceAIForms",
    "url": "https://voiceaiforms.com",
    "logo": "https://voiceaiforms.com/images/VoiceAIFormsYouCanTalkTo.png",
    "description": "Voice-to-invoice software for field service professionals. Create detailed invoices in 60 seconds using your voice.",
    "foundingDate": "2025",
    "sameAs": [
      // Add your social media URLs here when ready
      // "https://twitter.com/voiceaiforms",
      // "https://www.facebook.com/voiceaiforms",
      // "https://www.linkedin.com/company/voiceaiforms"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@voiceaiforms.com"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SoftwareApplicationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VoiceAIForms",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "25",
      "priceCurrency": "USD",
      "priceValidUntil": "2025-11-27",
      "availability": "https://schema.org/InStock",
      "description": "Lifetime Pro access - Limited time offer for first 1000 founders"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "description": "Voice-to-invoice software that helps field service professionals create detailed invoices in 60 seconds using voice commands. No typing required.",
    "screenshot": "https://voiceaiforms.com/images/VoiceAIFormsAppLayoutExample.png",
    "featureList": [
      "Voice-to-text invoice creation",
      "Hands-free operation",
      "QuickBooks integration",
      "Stripe integration",
      "Photo attachments",
      "Offline mode",
      "Instant customer delivery"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQPageSchema({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "VoiceAIForms Pro - Lifetime Access",
    "description": "Lifetime Pro access to VoiceAIForms voice-to-invoice software. Limited time offer for first 1000 founders.",
    "image": "https://voiceaiforms.com/images/VoiceAIFormsYouCanTalkTo.png",
    "brand": {
      "@type": "Brand",
      "name": "VoiceAIForms"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://voiceaiforms.com",
      "priceCurrency": "USD",
      "price": "25",
      "priceValidUntil": "2025-11-27",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Industry-specific schema for vertical pages
export function HVACServiceSchema() {
  const schema = {
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
      "priceValidUntil": "2025-11-27"
    },
    "description": "Voice-to-invoice software specifically designed for HVAC contractors. Create detailed service reports and invoices in 60 seconds using voice commands.",
    "featureList": [
      "HVAC service report templates",
      "Refrigerant level tracking",
      "Parts and labor documentation",
      "Before/after photo attachments",
      "QuickBooks integration",
      "Instant customer invoicing"
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": "HVAC Contractors, Heating and Cooling Professionals"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
