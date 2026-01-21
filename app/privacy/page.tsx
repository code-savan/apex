"use client";

import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import Footer from "../components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#888] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#3B82F6]" />
            <span className="text-sm text-[#888]">Privacy Policy</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-[#666] mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-[#aaa] leading-relaxed">
              APEX Protocol™ (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or purchase our automated trading software.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-semibold text-white mb-2">Personal Information</h3>
            <p className="text-[#aaa] leading-relaxed mb-4">
              When you purchase APEX Protocol™ or contact us, we may collect:
            </p>
            <ul className="list-disc list-inside text-[#aaa] space-y-2 ml-4">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number (optional)</li>
              <li>Payment information (processed securely by third-party payment processors)</li>
              <li>IP address</li>
              <li>Device and browser information</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-2 mt-6">Usage Information</h3>
            <p className="text-[#aaa] leading-relaxed">
              We automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, and information about how you interact with our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-[#aaa] leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-[#aaa] space-y-2 ml-4">
              <li>Process your purchase and deliver the APEX Protocol™ software</li>
              <li>Send you license keys, download links, and setup instructions</li>
              <li>Provide customer support</li>
              <li>Send important updates about the software (security patches, algorithm updates)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Information Sharing</h2>
            <p className="text-[#aaa] leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-[#aaa] space-y-2 ml-4">
              <li><strong className="text-white">Payment Processors:</strong> To process your payment securely (e.g., Stripe, PayPal, crypto payment processors)</li>
              <li><strong className="text-white">Email Services:</strong> To send transactional emails and support communications</li>
              <li><strong className="text-white">Legal Requirements:</strong> If required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
            <p className="text-[#aaa] leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes SSL encryption for all data transmission and secure storage practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Cookies</h2>
            <p className="text-[#aaa] leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience on our website. These help us understand how you use our site and remember your preferences. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
            <p className="text-[#aaa] leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-[#aaa] space-y-2 ml-4">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent where applicable</li>
            </ul>
            <p className="text-[#aaa] leading-relaxed mt-4">
              To exercise these rights, please contact us at support@apexprotocolsystem.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Data Retention</h2>
            <p className="text-[#aaa] leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Purchase records are retained for accounting and legal compliance purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Third-Party Links</h2>
            <p className="text-[#aaa] leading-relaxed">
              Our website may contain links to third-party websites (such as MT4/MT5 platforms, broker websites). We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
            <p className="text-[#aaa] leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
            <p className="text-[#aaa] leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
              <p className="text-white font-semibold">APEX Protocol™ Support</p>
              <p className="text-[#888]">Email: support@apexprotocolsystem.com</p>
            </div>
          </section>
        </div>
      </main>

      <Footer showDisclaimers={false} />
    </div>
  );
}
