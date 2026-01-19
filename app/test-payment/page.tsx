"use client";

import { useState } from "react";
import { Lock, CreditCard, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function TestPaymentPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setIsProcessing(true);
    setError("");

    try {
      const response = await fetch("/api/create-test-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.error) {
        setError(data.message || data.error);
        setIsProcessing(false);
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError("Unable to process payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#111] rounded-2xl flex items-center justify-center border border-[#222]">
              <Image
                src="/logo.png"
                alt="APEX"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Test Payment</h1>
          <p className="text-[#666]">Quick $1 payment test</p>
        </div>

        {/* Payment Card */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden">
          {/* Amount */}
          <div className="p-8 text-center border-b border-[#1a1a1a]">
            <p className="text-sm text-[#666] mb-2">Amount</p>
            <p className="text-5xl font-bold">$1</p>
            <p className="text-xs text-[#444] mt-2">One-time payment</p>
          </div>

          {/* Payment Info */}
          <div className="p-6 border-b border-[#1a1a1a]">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">Card Payment</p>
                <p className="text-xs text-[#666]">
                  You&apos;ll be redirected to a secure payment page to complete your purchase.
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mt-6 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
              <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
          )}

          {/* Pay Button */}
          <div className="p-6">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-[#f0f0f0] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base shadow-[0_0_30px_rgba(255,255,255,0.1)] cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Pay $1
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#444]">
              <Lock className="w-3 h-3" />
              <span>Secure payment powered by DodoPayments</span>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-[#666] hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
