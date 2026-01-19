"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function TestPaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success Card */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden text-center">
          {/* Icon */}
          <div className="p-8 border-b border-[#1a1a1a]">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-[#10B981]/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-[#666]">Your $1 test payment was processed successfully</p>
          </div>

          {/* Details */}
          <div className="p-6 border-b border-[#1a1a1a]">
            <div className="bg-[#111] rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#666]">Amount Paid</span>
                <span className="font-bold">$1.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#666]">Payment Method</span>
                <span className="font-bold">Card</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#666]">Status</span>
                <span className="text-[#10B981] font-bold">Completed</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 space-y-3">
            <Link
              href="/test-payment"
              className="block w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-[#f0f0f0] transition-all text-center"
            >
              Test Another Payment
            </Link>
            <Link
              href="/"
              className="block w-full bg-[#111] text-white font-semibold py-3 rounded-xl hover:bg-[#161616] transition-all text-center flex items-center justify-center gap-2"
            >
              Back to Home
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-6 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-xl p-4">
          <p className="text-xs text-[#3B82F6] text-center">
            This was a real payment transaction. The $1 has been processed through DodoPayments.
          </p>
        </div>
      </div>
    </div>
  );
}
