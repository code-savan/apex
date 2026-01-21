"use client";

import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import Footer from "../components/Footer";

export default function TermsOfServicePage() {
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
            <FileText className="w-4 h-4 text-[#3B82F6]" />
            <span className="text-sm text-[#888]">Terms of Service</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-[#666] mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
            <p className="text-[#aaa] leading-relaxed">
              By purchasing, downloading, installing, or using APEX Protocol™ (&quot;the Software&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not purchase or use the Software.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. License Grant</h2>
            <p className="text-[#aaa] leading-relaxed mb-4">
              Upon purchase, we grant you a non-exclusive, non-transferable license to use APEX Protocol™ subject to the following conditions:
            </p>
            <ul className="list-disc list-inside text-[#aaa] space-y-2 ml-4">
              <li><strong className="text-white">Starter Protocol:</strong> License for unlimited use on your own MT4/MT5 accounts</li>
              <li><strong className="text-white">Elite Mastery Bundle:</strong> License for unlimited use on your own MT4/MT5 accounts, plus access to VIP features and priority support</li>
            </ul>
            <p className="text-[#aaa] leading-relaxed mt-4">
              You may NOT resell, redistribute, sublicense, or share your license key with others.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Disclaimer of Warranties</h2>
            <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 p-4 rounded-lg mb-4">
              <p className="text-[#EF4444] font-semibold">IMPORTANT DISCLAIMER</p>
            </div>
            <p className="text-[#aaa] leading-relaxed mb-4">
              THE SOFTWARE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE:
            </p>
            <ul className="list-disc list-inside text-[#aaa] space-y-2 ml-4">
              <li>That the Software will generate profits</li>
              <li>Any specific trading results or returns</li>
              <li>That the Software will be error-free or uninterrupted</li>
              <li>That trading losses will not occur</li>
            </ul>
            <p className="text-[#aaa] leading-relaxed mt-4">
              Past performance shown in testimonials or marketing materials is not indicative of future results. Trading forex involves substantial risk of loss and is not suitable for all investors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Risk Acknowledgment</h2>
            <p className="text-[#aaa] leading-relaxed mb-4">By using APEX Protocol™, you acknowledge and agree that:</p>
            <ul className="list-disc list-inside text-[#aaa] space-y-2 ml-4">
              <li>Forex trading is highly speculative and carries a high level of risk</li>
              <li>You may lose some or all of your invested capital</li>
              <li>You should only trade with money you can afford to lose</li>
              <li>You are solely responsible for your trading decisions</li>
              <li>We are not financial advisors and do not provide financial advice</li>
              <li>You have read and understood all risk disclosures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
            <p className="text-[#aaa] leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, APEX PROTOCOL™ AND ITS CREATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, TRADING LOSSES, DATA, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SOFTWARE.
            </p>
            <p className="text-[#aaa] leading-relaxed mt-4">
              Our total liability shall not exceed the amount you paid for the Software.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Software Updates</h2>
            <p className="text-[#aaa] leading-relaxed">
              Your purchase includes lifetime access to algorithm updates at no additional cost. We reserve the right to modify, update, or discontinue the Software at any time. We will make reasonable efforts to notify users of significant changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Prohibited Uses</h2>
            <p className="text-[#aaa] leading-relaxed mb-4">You agree NOT to:</p>
            <ul className="list-disc list-inside text-[#aaa] space-y-2 ml-4">
              <li>Reverse engineer, decompile, or disassemble the Software</li>
              <li>Share, sell, or distribute your license key</li>
              <li>Use the Software for any illegal purpose</li>
              <li>Attempt to circumvent any security features</li>
              <li>Use the Software to manipulate markets or engage in fraudulent activity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Third-Party Services</h2>
            <p className="text-[#aaa] leading-relaxed">
              APEX Protocol™ requires integration with third-party trading platforms (MT4/MT5) and brokers. We are not affiliated with any broker and do not control trade execution, spreads, slippage, or order quality. Your choice of broker may affect your trading results.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Support and Community</h2>
            <p className="text-[#aaa] leading-relaxed">
              Your purchase includes access to email support and our private Discord community. Support response times vary by package tier. We reserve the right to remove users from the community for abusive behavior, spam, or violations of community guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Refund Policy</h2>
            <p className="text-[#aaa] leading-relaxed">
              We offer a 30-day money-back guarantee. See our <Link href="/refund" className="text-[#3B82F6] hover:underline">Refund Policy</Link> for complete details and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>
            <p className="text-[#aaa] leading-relaxed">
              We reserve the right to terminate your license if you violate these Terms of Service. Upon termination, you must cease all use of the Software and delete all copies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law</h2>
            <p className="text-[#aaa] leading-relaxed">
              These Terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through binding arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Changes to Terms</h2>
            <p className="text-[#aaa] leading-relaxed">
              We reserve the right to modify these Terms at any time. Continued use of the Software after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">14. Contact</h2>
            <p className="text-[#aaa] leading-relaxed">
              For questions about these Terms, contact us at:
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
