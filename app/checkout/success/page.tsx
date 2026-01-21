"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  CheckCircle2,
  Download,
  Mail,
  MessageCircle,
  Sparkles,
  Shield,
  Clock,
  Zap,
  ArrowRight,
  PartyPopper,
  Gift,
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

const packages = {
  starter: {
    name: "Starter Protocol",
    price: 499,
  },
  elite: {
    name: "Elite Mastery Bundle",
    price: 999,
  },
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const packageId = searchParams.get("package") || "starter";
  const isTestMode = searchParams.get("test") === "true";
  const paymentMethod = searchParams.get("method") || "card";

  const selectedPackage = packages[packageId as keyof typeof packages] || packages.starter;

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Save customer to Google Sheets (backup - in case webhook didn't fire)
    const saveCustomer = async () => {
      // Get stored lead info
      const storedName = localStorage.getItem("apex_lead_name") || "";
      const storedEmail = localStorage.getItem("apex_lead_email") || "";

      if (storedEmail) {
        try {
          await fetch("/api/save-customer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: storedName,
              email: storedEmail,
              package: selectedPackage.name,
              paymentMethod: paymentMethod === "crypto" ? "Crypto" : "Card",
              amount: selectedPackage.price,
              orderId: `WEB-${Date.now()}`,
              timestamp: new Date().toISOString(),
            }),
          });
          console.log("Customer saved to sheet from success page");
        } catch (err) {
          console.log("Customer save failed (non-blocking):", err);
        }
      }
    };

    saveCustomer();

    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    // Show content after a brief delay
    setTimeout(() => setShowContent(true), 500);

    return () => clearInterval(interval);
  }, [selectedPackage.name, selectedPackage.price, paymentMethod]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Test Mode Banner */}
      {isTestMode && (
        <div className="bg-[#F59E0B]/10 border-b border-[#F59E0B]/30 px-6 py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-2 text-[#F59E0B]">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Test Mode - This was a simulated payment</span>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Success Icon */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-[#10B981]/20 rounded-full mb-6">
              <CheckCircle2 className="w-12 h-12 text-[#10B981]" />
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <PartyPopper className="w-6 h-6 text-[#F59E0B]" />
              <h1 className="text-4xl md:text-5xl font-bold">You&apos;re In!</h1>
              <PartyPopper className="w-6 h-6 text-[#F59E0B] scale-x-[-1]" />
            </div>

            <p className="text-xl text-[#888] max-w-2xl mx-auto">
              Congratulations! Your order for <span className="text-white font-semibold">{selectedPackage.name}</span> is confirmed.
              Welcome to the APEX Protocol™ family.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Gift className="w-6 h-6 text-[#3B82F6]" />
              <h2 className="text-xl font-bold">Order Summary</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-[#1a1a1a]">
                  <span className="text-[#888]">Package</span>
                  <span className="font-medium">{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1a1a1a]">
                  <span className="text-[#888]">Payment Method</span>
                  <span className="font-medium capitalize">{paymentMethod === "crypto" ? "Cryptocurrency" : "Card"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1a1a1a]">
                  <span className="text-[#888]">Status</span>
                  <span className="text-[#10B981] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Complete
                  </span>
                </div>
              </div>

              <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-[#10B981] mb-1">Your Life Just Changed</p>
                    <p className="text-sm text-[#888]">
                      You&apos;ve joined an elite group of traders who chose to let AI handle the emotional chaos.
                      Your future self will thank you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold mb-6">What Happens Next</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#3B82F6]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Check Your Email</h3>
                  <p className="text-sm text-[#888]">
                    We&apos;ve sent your license key and download link to your email. Check your spam folder if you don&apos;t see it within 5 minutes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#3B82F6]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Download APEX</h3>
                  <p className="text-sm text-[#888]">
                    Follow the download link in your email to get APEX Protocol™ for MT4/MT5. The setup takes about 23 minutes with our video guide.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#3B82F6]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Join the Discord</h3>
                  <p className="text-sm text-[#888]">
                    Your email contains a private invite link to our Discord community with 400+ profitable traders. Introduce yourself!
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#3B82F6]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Start Trading</h3>
                  <p className="text-sm text-[#888]">
                    Once set up, APEX starts working immediately. Most users see their first trade within 2-4 hours of activation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assurances */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 text-center">
              <Shield className="w-8 h-8 text-[#3B82F6] mx-auto mb-3" />
              <h3 className="font-semibold mb-1">30-Day Guarantee</h3>
              <p className="text-xs text-[#888]">Not happy? Full refund, no questions asked.</p>
            </div>

            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 text-center">
              <Clock className="w-8 h-8 text-[#3B82F6] mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Lifetime Updates</h3>
              <p className="text-xs text-[#888]">Free algorithm updates forever. Stay ahead.</p>
            </div>

            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 text-center">
              <MessageCircle className="w-8 h-8 text-[#3B82F6] mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Priority Support</h3>
              <p className="text-xs text-[#888]">We&apos;re here to help you succeed. Always.</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-[#888] mb-4">Didn&apos;t receive your email?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                Return Home
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="mailto:support@apexprotocol.com"
                className="px-6 py-3 border border-[#333] text-white font-semibold rounded-lg hover:border-[#555] transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
