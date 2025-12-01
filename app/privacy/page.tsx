import Image from 'next/image';
import Link from 'next/link';

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-slate-400 mb-8">Last Updated: November 30, 2025</p>

          <div className="prose prose-invert prose-slate max-w-none">
            {/* Section 1 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">1. Introduction</h2>
            <p className="text-slate-300 mb-4">
              Welcome to WebSuite Media and VoiceAIForms. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we handle your personal data when you visit our websites (including https://websuitemedia.com, https://voiceaiforms.com, https://aivoiceforms.com, and https://formversation.com), use our services, and tells you about your privacy rights and how the law protects you.
            </p>

            {/* Section 2 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">2. Who We Are</h2>
            <p className="text-slate-300 mb-4">
              Schultz Resource Management, Inc., doing business as WebSuite Media ("Company," "we," "us," or "our"), is the controller and responsible for your personal data.
            </p>
            <p className="text-slate-300 mb-2"><strong className="text-white">Contact Details:</strong></p>
            <p className="text-slate-300 mb-1">Schultz Resource Management, Inc. dba WebSuite Media</p>
            <p className="text-slate-300 mb-1">5515 Ferry Dr., Helena, MT 59602, USA</p>
            <p className="text-slate-300 mb-4">
              Email: <a href="mailto:eric@websuitemedia.com" className="text-teal-400 hover:text-teal-300">eric@websuitemedia.com</a>
            </p>

            {/* Section 3 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">3. The Data We Collect About You</h2>
            <p className="text-slate-300 mb-4">
              We may collect, use, store, and transfer different kinds of personal data about you, including:
            </p>
            
            <h3 className="text-xl font-semibold text-teal-400 mt-6 mb-3">3.1. Data We Collect Directly From You</h3>
            <p className="text-slate-300 mb-2"><strong className="text-white">Identity Data:</strong> First name, last name, username or similar identifier</p>
            <p className="text-slate-300 mb-2"><strong className="text-white">Contact Data:</strong> Email address, telephone numbers, billing address</p>
            <p className="text-slate-300 mb-2"><strong className="text-white">Financial Data:</strong> Payment card details (processed securely through Stripe; we do not store complete card details)</p>
            <p className="text-slate-300 mb-2"><strong className="text-white">Form Data:</strong> Forms you create, form questions, form settings, themes, and customizations</p>
            <p className="text-slate-300 mb-4"><strong className="text-white">Voice Data:</strong> Voice recordings and audio data when you use voice input features (processed temporarily for transcription purposes only)</p>

            <h3 className="text-xl font-semibold text-teal-400 mt-6 mb-3">3.2. Data We Collect Automatically</h3>
            <p className="text-slate-300 mb-2"><strong className="text-white">Technical Data:</strong> IP address, browser type and version, time zone setting, operating system, and platform</p>
            <p className="text-slate-300 mb-2"><strong className="text-white">Usage Data:</strong> Information about how you use our websites, products, and services</p>
            <p className="text-slate-300 mb-4"><strong className="text-white">Cookie Data:</strong> Data collected through cookies, pixels, and similar technologies</p>

            <h3 className="text-xl font-semibold text-teal-400 mt-6 mb-3">3.3. Special Note About Form Responses</h3>
            <p className="text-slate-300 mb-4">
              <strong className="text-white">If you are a VoiceAIForms user creating forms:</strong> You are the data controller for any personal data collected through your forms. We act as a data processor. You are responsible for providing privacy notices to your form respondents, obtaining necessary consents, and complying with applicable data protection laws.
            </p>
            <p className="text-slate-300 mb-4">
              <strong className="text-white">If you are responding to a form:</strong> The form creator is responsible for how your data is collected and used. Please review their privacy policy.
            </p>

            {/* Section 4 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">4. How We Use Your Personal Data</h2>
            <p className="text-slate-300 mb-4">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to:
            </p>
            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
              <li>Provide and maintain our Service</li>
              <li>Process your transactions and manage your account</li>
              <li>Communicate with you about service updates and support</li>
              <li>Improve our services through analytics</li>
              <li>Protect our services and users from fraud and abuse</li>
              <li>Comply with legal obligations</li>
            </ul>

            {/* Section 5 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">5. Cookies and Similar Technologies</h2>
            <p className="text-slate-300 mb-4">
              We use cookies and similar technologies to enhance your experience, gather general visitor information, and track visits to our website. Cookies are small files that offer a better user experience. You can control cookies through your browser settings.
            </p>
            <p className="text-slate-300 mb-4">
              Pixels (web beacons) are used in connection with cookies to track activity on our website and capture data to improve the efficiency of our ads and marketing efforts.
            </p>

            {/* Section 6 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">6. How We Share Your Personal Data</h2>
            <p className="text-slate-300 mb-4">
              We may share your personal data with:
            </p>
            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
              <li><strong className="text-white">Service Providers:</strong> Stripe for payment processing, third-party AI services for voice-to-text conversion, cloud hosting providers, analytics services</li>
              <li><strong className="text-white">Affiliate Partners:</strong> Limited data for commission purposes (we do not share financial details)</li>
              <li><strong className="text-white">Form Creators:</strong> If you submit a form response, your data is shared with that form creator</li>
              <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
            <p className="text-slate-300 mb-4">
              <strong className="text-white">We do not sell your personal data to third parties.</strong>
            </p>

            {/* Section 7 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">7. Voice Data and AI Processing</h2>
            <p className="text-slate-300 mb-4">
              When you use voice input features in VoiceAIForms:
            </p>
            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
              <li>Your device captures audio when you speak</li>
              <li>Audio is transmitted securely (encrypted) to our voice processing service</li>
              <li>Third-party AI services convert speech to text</li>
              <li>Audio recordings are temporarily stored during processing only</li>
              <li>Audio is typically deleted within 24 hours</li>
              <li>Text transcriptions are stored as form responses</li>
            </ul>
            <p className="text-slate-300 mb-4">
              <strong className="text-white">Important:</strong> AI transcription may not be 100% accurate. You should review and verify transcribed text.
            </p>

            {/* Section 8 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">8. Data Security</h2>
            <p className="text-slate-300 mb-4">
              We have implemented appropriate technical and organizational security measures designed to protect your personal data, including:
            </p>
            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
              <li>Encryption of data in transit (SSL/TLS)</li>
              <li>Encryption of sensitive data at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="text-slate-300 mb-4">
              However, no electronic transmission over the Internet can be guaranteed to be 100% secure. You are responsible for keeping your password and account credentials confidential.
            </p>

            {/* Section 9 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">9. Data Retention</h2>
            <p className="text-slate-300 mb-4">
              We retain your personal data only for as long as necessary:
            </p>
            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
              <li><strong className="text-white">Account Data:</strong> While your account is active and for 90 days after closure</li>
              <li><strong className="text-white">Transaction Data:</strong> 7 years for tax and accounting purposes</li>
              <li><strong className="text-white">Form Data:</strong> While your account is active (you can delete forms anytime)</li>
              <li><strong className="text-white">Voice Data:</strong> Temporarily during transcription (typically deleted within 24 hours)</li>
              <li><strong className="text-white">Marketing Data:</strong> Until you unsubscribe or request deletion</li>
            </ul>

            {/* Section 10 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">10. Your Legal Rights</h2>
            
            <h3 className="text-xl font-semibold text-teal-400 mt-6 mb-3">10.1. GDPR Rights (EEA Residents)</h3>
            <p className="text-slate-300 mb-4">
              If you are in the European Economic Area, you have the following rights:
            </p>
            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
              <li><strong className="text-white">Right to Access:</strong> Request a copy of your personal data</li>
              <li><strong className="text-white">Right to Rectification:</strong> Correct inaccurate data</li>
              <li><strong className="text-white">Right to Erasure:</strong> Request deletion of your data</li>
              <li><strong className="text-white">Right to Restrict Processing:</strong> Limit how we use your data</li>
              <li><strong className="text-white">Right to Data Portability:</strong> Receive your data in a portable format</li>
              <li><strong className="text-white">Right to Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong className="text-white">Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
            </ul>

            <h3 className="text-xl font-semibold text-teal-400 mt-6 mb-3">10.2. CCPA Rights (California Residents)</h3>
            <p className="text-slate-300 mb-4">
              If you are a California resident, you have the right to:
            </p>
            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
              <li><strong className="text-white">Know:</strong> Request information about data collection and use</li>
              <li><strong className="text-white">Delete:</strong> Request deletion of your personal information</li>
              <li><strong className="text-white">Opt-Out:</strong> We do not sell your personal information</li>
              <li><strong className="text-white">Non-Discrimination:</strong> You will not be discriminated against for exercising your rights</li>
            </ul>

            <h3 className="text-xl font-semibold text-teal-400 mt-6 mb-3">10.3. How to Exercise Your Rights</h3>
            <p className="text-slate-300 mb-4">
              To exercise any of these rights, please contact us at <a href="mailto:eric@websuitemedia.com" className="text-teal-400 hover:text-teal-300">eric@websuitemedia.com</a>. We aim to respond to all legitimate requests within 30 days.
            </p>

            {/* Section 11 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">11. International Data Transfers</h2>
            <p className="text-slate-300 mb-4">
              Our servers are located in the United States. If you are accessing our services from outside the United States, your information may be transferred to, stored, and processed in the United States. We take appropriate safeguards to ensure your data remains protected.
            </p>

            {/* Section 12 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">12. Children's Privacy</h2>
            <p className="text-slate-300 mb-4">
              Our services are not intended for children under 13 years of age (or under 16 in the EEA). We do not knowingly collect personal data from children. If you are a parent or guardian and believe your child has provided us with personal data, please contact us.
            </p>

            {/* Section 13 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">13. Marketing Communications</h2>
            <p className="text-slate-300 mb-4">
              You can opt out of marketing communications at any time by:
            </p>
            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
              <li>Clicking the unsubscribe link in any marketing email</li>
              <li>Contacting us at <a href="mailto:eric@websuitemedia.com" className="text-teal-400 hover:text-teal-300">eric@websuitemedia.com</a></li>
              <li>Updating your preferences in your account settings</li>
            </ul>

            {/* Section 14 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">14. Affiliate Relations</h2>
            <p className="text-slate-300 mb-4">
              Some links on our websites are affiliate links. We may earn a commission if you make a purchase using these links. The price you pay is the same whether you use an affiliate link or not. We use cookies to track affiliate referrals, which typically expire after 30 days.
            </p>

            {/* Section 15 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">15. Changes to This Privacy Policy</h2>
            <p className="text-slate-300 mb-4">
              We may update this privacy policy from time to time. When we do, we will update the "Last Updated" date at the top of this page and notify you by email of material changes (if we have your email address). We encourage you to review this privacy policy periodically.
            </p>

            {/* Section 16 */}
            <h2 className="text-2xl font-bold text-teal-300 mt-8 mb-4">16. Contact Us</h2>
            <p className="text-slate-300 mb-2">
              If you have any questions about this privacy policy or wish to exercise your privacy rights, please contact us:
            </p>
            <p className="text-slate-300 mb-1"><strong className="text-white">Email:</strong> <a href="mailto:eric@websuitemedia.com" className="text-teal-400 hover:text-teal-300">eric@websuitemedia.com</a></p>
            <p className="text-slate-300 mb-4">
              <strong className="text-white">Postal Address:</strong> Schultz Resource Management, Inc. dba WebSuite Media, 5515 Ferry Dr., Helena, MT 59602, USA
            </p>

            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 mt-8">
              <p className="text-slate-300 font-semibold mb-2">Websites Covered by This Privacy Policy:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-1">
                <li>https://websuitemedia.com</li>
                <li>https://voiceaiforms.com</li>
                <li>https://aivoiceforms.com</li>
                <li>https://formversation.com</li>
              </ul>
            </div>

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