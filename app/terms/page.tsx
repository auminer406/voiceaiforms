import Image from 'next/image';
import Link from 'next/link';

export default function TermsPage() {
  return (
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
              className="h-32 w-auto ml-4 cursor-pointer"
            />
          </Link>

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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">
            Terms of Service
          </h1>
          <p className="text-slate-400 mb-8">Last Updated: November 30, 2025</p>

          <div className="prose prose-invert prose-slate max-w-none">
            {/* Section 1 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">1. Acceptance of the Terms of Service</h2>
            <p className="text-slate-300 mb-4">
              These terms of service are entered into by and between you and Schultz Resource Management, Inc., doing business as "WebSuite Media" ("Company," "we," or "us"). VoiceAIForms is a product of WebSuite Media. The following terms and conditions, together with any documents they expressly incorporate by reference (collectively, "Terms of Service"), govern your access to and use of https://voiceaiforms.com and https://aivoiceforms.com, including any content, functionality and services offered on or through the websites (the "Service"), whether accessed as a guest or a registered user and regardless of the device through which the Service is accessed.
            </p>
            <p className="text-slate-300 mb-4">
              Please read the Terms of Service carefully before you start to use the Service. By using the Service, you accept and agree to be bound and abide by these Terms of Service and our Privacy Policy, found at <Link href="/privacy" className="text-teal-400 hover:text-teal-300">https://aivoiceforms.com/privacy</Link>, incorporated herein by reference. If you do not want to agree to these Terms of Service or the Privacy Policy, you must not access or use the Service.
            </p>
            <p className="text-slate-300 mb-4">
              By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state, province, or country of residence, and, if applicable, you have given your consent to allow any of your minor dependents to use this Service. If you do not meet all of these requirements, you must not access or use the Service.
            </p>

            {/* Section 2 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">2. Changes to the Terms of Service</h2>
            <p className="text-slate-300 mb-4">
              We may revise and update these Terms of Service from time to time in our sole discretion. All changes are effective immediately when we post them and apply to all access to and use of the Service thereafter. The "Last Modified" date for these Terms of Service is set forth at the top of this page. Your continued use of the Service following the posting of revised Terms of Service means that you accept and agree to the changes.
            </p>

            {/* Section 3 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">3. Service Description</h2>
            <p className="text-slate-300 mb-4">
              VoiceAIForms provides voice-enabled form creation and management services ("Service"). We may, in our sole discretion, change, delete, update, modify or otherwise alter features, functionality, and Service Content at any time without providing you notice. We may change the pricing and availability of Service capabilities in our sole discretion at any time without providing you notice to users who are not on lifetime plans.
            </p>

            {/* Section 4 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">4. Subscription Plans and Pricing</h2>
            
            <h3 className="text-xl font-semibold text-teal-400 mt-6 mb-3">4.1. Plan Types</h3>
            <p className="text-slate-300 mb-2"><strong className="text-white">Free Plan:</strong> Basic access with limited features as specified on our pricing page.</p>
            <p className="text-slate-300 mb-2"><strong className="text-white">Pro Plan:</strong> Full-featured access available as monthly subscription or lifetime access for qualifying early adopters at promotional pricing.</p>
            <p className="text-slate-300 mb-4"><strong className="text-white">Agency Plan:</strong> Enterprise-level features with monthly subscription pricing as shown on the Service.</p>

            <h3 className="text-xl font-semibold text-teal-400 mt-6 mb-3">4.2. Lifetime Access</h3>
            <p className="text-slate-300 mb-4">
              Certain users who purchase lifetime access during promotional periods ("Lifetime Members") will receive permanent access to Pro-tier features as they exist at time of purchase, access to Pro-tier feature updates and improvements at our discretion, protection from future Pro-tier price increases, and no recurring subscription fees for Pro-tier access.
            </p>
            <p className="text-slate-300 mb-4">
              Lifetime access does not include Agency-tier features (unless separately purchased), features or products launched as separate offerings, or third-party integrations that require separate accounts or fees.
            </p>

            {/* Section 5 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">5. Payment and Billing</h2>
            
            <h3 className="text-xl font-semibold text-teal-400 mt-6 mb-3">5.1. Payment Processing</h3>
            <p className="text-slate-300 mb-4">
              All payments are processed securely through Stripe, our third-party payment processor. By making a purchase, you agree to Stripe's Terms of Service and Privacy Policy. We do not store your complete payment card information on our servers.
            </p>

            <h3 className="text-xl font-semibold text-teal-400 mt-6 mb-3">5.2. Subscription Billing</h3>
            <p className="text-slate-300 mb-4">
              For monthly subscriptions, billing occurs on the same day each month as your initial subscription. Subscriptions automatically renew unless canceled. You must cancel before your renewal date to avoid charges. Cancellation stops future billing but does not trigger refunds for the current period.
            </p>

            {/* Section 6 - Refund Policy */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">6. Refund Policy</h2>
            <p className="text-slate-300 mb-4">
              <strong className="text-white">All sales are final.</strong> We do not offer refunds for lifetime access purchases, monthly subscription fees (including partial month refunds), Agency plan purchases, or add-on features or services.
            </p>
            <p className="text-slate-300 mb-4">
              <strong className="text-white">Discretionary Refunds:</strong> We may, at our sole discretion, issue refunds on a case-by-case basis within seven (7) days of purchase. Factors we consider include technical issues preventing service use, billing errors, and unusual circumstances warranting review.
            </p>
            <p className="text-slate-300 mb-4">
              To request consideration for a refund, contact us at <a href="mailto:eric@websuitemedia.com" className="text-teal-400 hover:text-teal-300">eric@websuitemedia.com</a> with your account details and reason for the request. Refund requests are not guaranteed and are evaluated individually.
            </p>

            {/* Section 7 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">7. Account Security</h2>
            <p className="text-slate-300 mb-4">
              You are responsible for maintaining the confidentiality of your account credentials. You must treat your password as confidential and must not disclose it to any other person or entity. You agree to notify us immediately of any unauthorized access to or use of your password or any other breach of security.
            </p>

            {/* Section 8 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">8. Intellectual Property Rights</h2>
            <p className="text-slate-300 mb-4">
              The Service and its entire contents, features and functionality are owned by the Company, its licensors or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret and other intellectual property or proprietary rights laws.
            </p>

            {/* Section 9 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">9. Prohibited Uses</h2>
            <p className="text-slate-300 mb-4">
              You may use the Service only for lawful purposes and in accordance with these Terms of Service. You agree not to use the Service in any way that violates any applicable law or regulation, to exploit or harm minors, to transmit spam or unsolicited communications, to impersonate others, or to interfere with the proper working of the Service.
            </p>

            {/* Section 10 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">10. User-Generated Content and Forms</h2>
            <p className="text-slate-300 mb-4">
              When you create forms using our Service, you retain all ownership rights to the content of your forms. You grant us a limited license to host, store, and display your forms as necessary to provide the Service. You are responsible for ensuring your forms comply with all applicable laws and these Terms of Service.
            </p>

            {/* Section 11 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">11. AI Voice Processing</h2>
            <p className="text-slate-300 mb-4">
              Our Service uses artificial intelligence to process voice inputs. By using voice features, you acknowledge that voice data is processed by AI systems, you consent to temporary processing and storage of voice data as necessary to provide the Service, and you understand that AI processing may not be 100% accurate.
            </p>

            {/* Section 12 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">12. Disclaimer of Warranties</h2>
            <p className="text-slate-300 mb-4">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE. WE DO NOT WARRANT THAT THE AI VOICE PROCESSING FEATURES WILL BE ERROR-FREE, SECURE, OR FUNCTION WITHOUT INTERRUPTION.
            </p>

            {/* Section 13 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">13. Limitation on Liability</h2>
            <p className="text-slate-300 mb-4">
              TO THE FULLEST EXTENT PROVIDED BY LAW, IN NO EVENT WILL THE COLLECTIVE LIABILITY OF THE COMPANY EXCEED THE GREATER OF $100 OR THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY.
            </p>

            {/* Section 14 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">14. Governing Law</h2>
            <p className="text-slate-300 mb-4">
              All matters relating to the Service and these Terms of Service shall be governed by and construed in accordance with the internal laws of the State of Montana without giving effect to any choice or conflict of law provision or rule.
            </p>

            {/* Section 15 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">15. Contact Information</h2>
            <p className="text-slate-300 mb-2">
              This Service is operated by:
            </p>
            <p className="text-slate-300 mb-1"><strong className="text-white">Schultz Resource Management, Inc.</strong></p>
            <p className="text-slate-300 mb-1">d/b/a WebSuite Media</p>
            <p className="text-slate-300 mb-1">5515 Ferry Dr.</p>
            <p className="text-slate-300 mb-1">Helena, MT 59602</p>
            <p className="text-slate-300 mb-4">USA</p>
            <p className="text-slate-300">
              <strong className="text-white">Email:</strong> <a href="mailto:eric@websuitemedia.com" className="text-teal-400 hover:text-teal-300">eric@websuitemedia.com</a>
            </p>

            {/* Back to Home */}
            <div className="mt-12 pt-8 border-t border-slate-700">
              <Link href="/" className="text-teal-400 hover:text-teal-300 font-semibold">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 mt-12">
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
    </div>
  );
}