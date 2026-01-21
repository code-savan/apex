"use client";

import { ArrowLeft, RefreshCw, CheckCircle2, XCircle, Clock, Mail } from "lucide-react";
import Link from "next/link";
import Footer from "../components/Footer";

export default function RefundPolicyPage() {
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
            <RefreshCw className="w-4 h-4 text-[#10B981]" />
            <span className="text-sm text-[#888]">Refund Policy</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Refund Policy</h1>
        <p className="text-[#666] mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        {/* Guarantee Badge */}
        <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-2xl p-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#10B981]/20 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#10B981] mb-1">30-Day Money-Back Guarantee</h2>
              <p className="text-[#aaa]">We stand behind APEX Protocol™. If you&apos;re not satisfied, get a full refund within 30 days.</p>
            </div>
          </div>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Our Promise</h2>
            <p className="text-[#aaa] leading-relaxed">
              We want you to be completely satisfied with your purchase of APEX Protocol™. If for any reason you&apos;re not happy with the product within the first 30 days, we&apos;ll give you a full refund — no questions asked.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Eligibility for Refund</h2>

            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                  <h3 className="text-lg font-bold text-white">Eligible for Refund</h3>
                </div>
                <ul className="space-y-3 text-[#aaa] text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    Request made within 30 days of purchase
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    First-time purchase of APEX Protocol™
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    Product not working as described
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    Technical issues we cannot resolve
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    Simply not satisfied with the product
                  </li>
                </ul>
              </div>

              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="w-6 h-6 text-[#EF4444]" />
                  <h3 className="text-lg font-bold text-white">Not Eligible</h3>
                </div>
                <ul className="space-y-3 text-[#aaa] text-sm">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                    Request made after 30 days
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                    Previously received a refund
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                    Violation of Terms of Service
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                    Fraudulent purchase attempt
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                    Shared or resold license key
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How to Request a Refund</h2>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-[#3B82F6]/20 rounded-full flex items-center justify-center shrink-0 text-[#3B82F6] font-bold">1</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Email Our Support Team</h4>
                  <p className="text-[#888] text-sm">Send an email to <span className="text-[#3B82F6]">support@apexprotocolsystem.com</span> with the subject line &quot;Refund Request&quot;</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-[#3B82F6]/20 rounded-full flex items-center justify-center shrink-0 text-[#3B82F6] font-bold">2</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Include Your Details</h4>
                  <p className="text-[#888] text-sm">Please include your purchase email, order ID, and reason for the refund (optional but helps us improve)</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-[#3B82F6]/20 rounded-full flex items-center justify-center shrink-0 text-[#3B82F6] font-bold">3</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Wait for Confirmation</h4>
                  <p className="text-[#888] text-sm">We&apos;ll confirm your refund request within 24-48 hours</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-[#10B981]/20 rounded-full flex items-center justify-center shrink-0 text-[#10B981] font-bold">4</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Receive Your Refund</h4>
                  <p className="text-[#888] text-sm">Refunds are processed within 5-7 business days to your original payment method</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Refund Timeline</h2>

            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-[#F59E0B]" />
                <h3 className="text-lg font-semibold text-white">Processing Times</h3>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-[#1a1a1a]">
                  <span className="text-[#888]">Card Payments</span>
                  <span className="text-white font-medium">5-7 business days</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1a1a1a]">
                  <span className="text-[#888]">PayPal</span>
                  <span className="text-white font-medium">3-5 business days</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#888]">Cryptocurrency</span>
                  <span className="text-white font-medium">1-3 business days</span>
                </div>
              </div>

              <p className="text-xs text-[#666] mt-4">
                * Actual timing depends on your bank or payment provider. Crypto refunds are processed in the original cryptocurrency or USDT equivalent.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">After Refund</h2>
            <p className="text-[#aaa] leading-relaxed">
              Upon receiving a refund, your license key will be deactivated and you will lose access to:
            </p>
            <ul className="list-disc list-inside text-[#aaa] space-y-2 ml-4 mt-4">
              <li>APEX Protocol™ software</li>
              <li>Private Discord community</li>
              <li>Email support</li>
              <li>Algorithm updates</li>
              <li>Setup videos and training materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Questions?</h2>
            <p className="text-[#aaa] leading-relaxed mb-4">
              If you have any questions about our refund policy, please don&apos;t hesitate to contact us.
            </p>
            <div className="p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg inline-flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#3B82F6]" />
              <div>
                <p className="text-white font-semibold">support@apexprotocolsystem.com</p>
                <p className="text-[#666] text-sm">We typically respond within 6 hours</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer showDisclaimers={false} />
    </div>
  );
}
