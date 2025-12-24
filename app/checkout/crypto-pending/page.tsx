"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import {
  Clock,
  Copy,
  Check,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  Mail,
} from "lucide-react";
import Link from "next/link";

const cryptoOptions: Record<string, { name: string; symbol: string; icon: string; color: string }> = {
  btc: { name: "Bitcoin", symbol: "BTC", icon: "₿", color: "#F7931A" },
  eth: { name: "Ethereum", symbol: "ETH", icon: "Ξ", color: "#627EEA" },
  usdt: { name: "Tether", symbol: "USDT", icon: "₮", color: "#26A17B" },
  sol: { name: "Solana", symbol: "SOL", icon: "◎", color: "#9945FF" },
  ltc: { name: "Litecoin", symbol: "LTC", icon: "Ł", color: "#BFBBBB" },
};

const packages: Record<string, { name: string; cryptoPrice: number }> = {
  starter: { name: "Starter Protocol", cryptoPrice: 399 },
  elite: { name: "Elite Mastery Bundle", cryptoPrice: 799 },
};

function CryptoPendingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const packageId = searchParams.get("package") || "starter";
  const cryptoId = searchParams.get("crypto") || "btc";
  const email = searchParams.get("email") || "";

  const crypto = cryptoOptions[cryptoId] || cryptoOptions.btc;
  const selectedPackage = packages[packageId] || packages.starter;

  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const cryptoAddresses: Record<string, string> = {
    btc: process.env.NEXT_PUBLIC_BTC_ADDRESS || "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    eth: process.env.NEXT_PUBLIC_ETH_ADDRESS || "0x742d35Cc6634C0532925a3b844Bc9e7595f0aB1c",
    usdt: process.env.NEXT_PUBLIC_USDT_ADDRESS || "0x742d35Cc6634C0532925a3b844Bc9e7595f0aB1c",
    sol: process.env.NEXT_PUBLIC_SOL_ADDRESS || "DYw8jCTfbox65qTdqU7KHsS3HqdQfdfSCpDdLB7QLSCD",
    ltc: process.env.NEXT_PUBLIC_LTC_ADDRESS || "ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!firstName.trim()) {
      setError("Please enter your first name");
      return;
    }

    if (!txHash.trim()) {
      setError("Please enter your transaction hash");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Submit transaction for verification
      const response = await fetch("/api/verify-crypto-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txHash: txHash.trim(),
          crypto: cryptoId,
          email: decodeURIComponent(email),
          firstName: firstName.trim(),
          packageName: selectedPackage.name,
          expectedAmount: selectedPackage.cryptoPrice,
          packageId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Show success message, don't redirect
      } else {
        setError(data.error || "Failed to submit transaction. Please try again.");
      }
    } catch (err) {
      setError("Failed to submit transaction. Please contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] bg-black/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/checkout" className="flex items-center gap-2 text-[#888] hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to checkout</span>
          </Link>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-sm text-[#888]">Payment Pending</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{ backgroundColor: `${crypto.color}20` }}
          >
            <span className="text-4xl" style={{ color: crypto.color }}>{crypto.icon}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Complete Your {crypto.symbol} Payment</h1>
          <p className="text-[#888]">
            Send exactly <span className="text-white font-semibold">${selectedPackage.cryptoPrice}</span> worth of {crypto.name}
          </p>
        </div>

        {/* Payment Instructions */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center text-xs">1</span>
            Send {crypto.symbol} to this address
          </h2>

          <div className="bg-black border border-[#1a1a1a] rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#888]">{crypto.name} Address</span>
              <button
                onClick={() => copyToClipboard(cryptoAddresses[cryptoId])}
                className="flex items-center gap-1 text-sm text-[#3B82F6] hover:text-[#60a5fa] transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <code className="block text-sm text-white break-all font-mono">
              {cryptoAddresses[cryptoId]}
            </code>
          </div>

          <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#F59E0B] font-medium">Important</p>
                <p className="text-xs text-[#888] mt-1">
                  Send exactly ${selectedPackage.cryptoPrice} worth of {crypto.symbol}. Transactions are typically confirmed within 10-30 minutes depending on network congestion.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Hash */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center text-xs">2</span>
            Submit Payment Details
          </h2>

          <p className="text-sm text-[#888] mb-4">
            After sending, paste your transaction hash below so we can verify your payment.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#888] mb-2">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full bg-black border border-[#1a1a1a] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[#888] mb-2">Transaction Hash *</label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="0x... or transaction ID"
                className="w-full bg-black border border-[#1a1a1a] rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
              />
              <p className="text-xs text-[#666] mt-2">
                Find this in your wallet after sending. Also called TX ID or Transaction ID.
              </p>
            </div>
          </div>

          {error && (
            <p className="text-[#EF4444] text-sm mt-4 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}

          {success && (
            <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#10B981] font-medium">Transaction Submitted!</p>
                  <p className="text-xs text-[#888] mt-1">
                    We're verifying your payment on the blockchain. You'll receive an email confirmation shortly. Check your inbox at: <span className="text-white">{decodeURIComponent(email)}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || success}
          className="w-full bg-white text-black font-semibold py-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {success ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Submitted Successfully
            </>
          ) : isSubmitting ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Submit for Verification
            </>
          )}
        </button>

        {/* Help */}
        <div className="mt-8 text-center">
          <p className="text-[#888] text-sm mb-2">Need help with your payment?</p>
          <a
            href="mailto:support@apexprotocol.com"
            className="inline-flex items-center gap-2 text-[#3B82F6] hover:underline text-sm"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </a>
        </div>
      </main>
    </div>
  );
}

export default function CryptoPendingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <CryptoPendingContent />
    </Suspense>
  );
}
