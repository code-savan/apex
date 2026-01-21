"use client";

import { Mail, MessageCircle, Clock, ArrowLeft, Shield, Phone, HelpCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const ADMIN_EMAILS = [
  { email: "support@apexprotocolsystem.com", type: "General Support" },
  { email: "admin@apexprotocolsystem.com", type: "Admin & Technical" },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#3B82F6] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#10B981] rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-[#1a1a1a] relative z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#888] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#10B981]" />
            <span className="text-sm text-[#888]">Support Center</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#3B82F6]/20 to-[#10B981]/20 rounded-2xl flex items-center justify-center border border-[#10B981]/50 shadow-lg shadow-[#10B981]/20">
              <Image
                src="/logo.png"
                alt="APEX"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white to-[#10B981] bg-clip-text text-transparent">
            How Can We Help?
          </h1>
          <p className="text-[#888] text-lg">
            We&apos;re here to support you 24/7
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Email Support */}
          {ADMIN_EMAILS.map((contact, index) => (
            <div key={index} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#10B981]/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#10B981]/20 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-[#10B981]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{contact.type}</h3>
                  <p className="text-sm text-[#666] mb-3">Get help via email</p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-[#10B981] hover:text-[#059669] font-medium text-sm cursor-pointer inline-flex items-center gap-2"
                  >
                    {contact.email}
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Response Time */}
        <div className="bg-gradient-to-r from-[#3B82F6]/10 to-[#10B981]/10 border border-[#10B981]/30 rounded-2xl p-6 mb-12">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-[#10B981]" />
            <h3 className="text-lg font-bold text-white">Response Time</h3>
          </div>
          <p className="text-[#aaa]">
            We typically respond within <span className="text-[#10B981] font-semibold">6 hours</span> for general inquiries and <span className="text-[#10B981] font-semibold">2 hours</span> for technical issues. Elite members receive priority support with responses under 90 minutes.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-[#3B82F6]" />
            <h2 className="text-2xl font-bold text-white">Quick Answers</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-white font-semibold mb-2">📧 What information should I include in my support email?</h4>
              <p className="text-[#888] text-sm">
                Please include your account number, license key, and a detailed description of your issue. Screenshots or error messages are very helpful!
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">🔑 I lost my license key, what should I do?</h4>
              <p className="text-[#888] text-sm">
                Email us at support@apexprotocolsystem.com with your purchase email and order confirmation. We&apos;ll verify your purchase and resend your license key.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">⚙️ How do I set up APEX Bot?</h4>
              <p className="text-[#888] text-sm">
                All packages include a 23-minute setup video. After purchase, you&apos;ll receive an email with access to the video tutorial and installation guide.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">💰 What&apos;s your refund policy?</h4>
              <p className="text-[#888] text-sm">
                We offer a 30-day money-back guarantee. If you&apos;re not satisfied, email us and we&apos;ll process your refund within 5-7 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#10B981]/50 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 rotate-180" />
            Back to Home
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-8 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Disclaimer */}
          <div className="mb-6">
            <p className="text-xs text-[#666] text-center max-w-2xl mx-auto leading-relaxed">
              <span className="font-semibold text-[#888]">Risk Disclaimer:</span> Trading forex and other financial instruments involves substantial risk of loss and is not suitable for all investors. Past performance is not indicative of future results. APEX Protocol™ is an automated trading system. No trading system is guaranteed to be profitable. Only trade with money you can afford to lose.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-xs text-[#444]">
              © {new Date().getFullYear()} APEX Protocol™. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

