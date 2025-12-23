"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Shield,
  Lock,
  CheckCircle2,
  Copy,
  Check,
  CreditCard,
  Wallet,
  AlertCircle,
  Star,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Package data
const packages = {
  starter: {
    name: "Starter Protocol",
    price: 499,
    cryptoPrice: 399,
    features: [
      "Full APEX Bot (Unlimited MT4/MT5 use)",
      "23-Min Setup Video",
      "Monthly Algorithm Updates (FREE forever)",
      "Private Discord (400+ traders)",
      "Email Support (under 6 hours)",
      "30-Day Money-Back Guarantee",
    ],
  },
  elite: {
    name: "Elite Mastery Bundle",
    price: 999,
    cryptoPrice: 799,
    features: [
      "Everything in Starter, plus:",
      "Personal Onboarding Call (30-min)",
      "Advanced Settings Pack (3 configs)",
      '"Account Resurrection" Protocol',
      "Priority Support (90-min response)",
      "Monthly Live Strategy Sessions",
      "VIP Discord Channel",
    ],
  },
};

// Crypto options
const cryptoOptions = [
  { id: "btc", name: "Bitcoin", symbol: "BTC", icon: "₿", color: "#F7931A" },
  { id: "eth", name: "Ethereum", symbol: "ETH", icon: "Ξ", color: "#627EEA" },
  { id: "usdt", name: "Tether", symbol: "USDT", icon: "₮", color: "#26A17B" },
  { id: "sol", name: "Solana", symbol: "SOL", icon: "◎", color: "#9945FF" },
  { id: "ltc", name: "Litecoin", symbol: "LTC", icon: "Ł", color: "#BFBBBB" },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialPackageId = searchParams.get("package") || "starter";
  const isTestMode = searchParams.get("test") === "true";

  const [selectedPackageId, setSelectedPackageId] = useState<"starter" | "elite">(
    initialPackageId === "elite" ? "elite" : "starter"
  );
  const selectedPackage = packages[selectedPackageId];

  // Update URL when package changes
  const handlePackageChange = (pkgId: "starter" | "elite") => {
    setSelectedPackageId(pkgId);
    const url = new URL(window.location.href);
    url.searchParams.set("package", pkgId);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");
  const [selectedCrypto, setSelectedCrypto] = useState("btc");
  const [copied, setCopied] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({});
  const [pricesLoading, setPricesLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Crypto addresses (these would come from env in production)
  const cryptoAddresses: Record<string, string> = {
    btc: process.env.NEXT_PUBLIC_BTC_ADDRESS || "1F5zkR25VXA9eRSqjWKH7rM7w15qmGgr5F",
    eth: process.env.NEXT_PUBLIC_ETH_ADDRESS || "0x146530c7e40cffd4c2d1579073d40227d1ad5759",
    usdt: process.env.NEXT_PUBLIC_USDT_ADDRESS || "TPDckwaqQ8oShd28htUpvmUFWTkk3Mgsfm",
    sol: process.env.NEXT_PUBLIC_SOL_ADDRESS || "2BG35UaSoyySmnthoQdSCo7LH1w4apfQ3cszCVVVocgp",
    ltc: process.env.NEXT_PUBLIC_LTC_ADDRESS || "LPsxTKzztyszVhqw6jPzaRWRZ9KHyfj7Nn",
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch crypto prices
  useEffect(() => {
    const fetchPrices = async () => {
      setPricesLoading(true);
      try {
        const response = await fetch("/api/crypto-prices");
        const data = await response.json();
        if (data.prices) {
          setCryptoPrices(data.prices);
        }
      } catch (error) {
        console.error("Failed to fetch crypto prices:", error);
      } finally {
        setPricesLoading(false);
      }
    };

    fetchPrices();
    // Refresh prices every 60 seconds
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAmountToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  // Calculate crypto amount based on current price
  const getCryptoAmount = (cryptoId: string) => {
    const price = cryptoPrices[cryptoId];
    if (!price) return null;
    const amount = selectedPackage.cryptoPrice / price;
    // Format based on the crypto type
    if (cryptoId === "btc") return amount.toFixed(6);
    if (cryptoId === "eth") return amount.toFixed(5);
    if (cryptoId === "ltc") return amount.toFixed(4);
    if (cryptoId === "sol") return amount.toFixed(4);
    if (cryptoId === "usdt") return amount.toFixed(2);
    return amount.toFixed(6);
  };

  const handleCardPayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      if (isTestMode) {
        // Test mode - skip actual payment
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Send test confirmation email
        await fetch("/api/send-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            firstName: formData.firstName,
            packageName: selectedPackage.name,
            amount: selectedPackage.price,
            paymentMethod: "card",
            isTest: true,
          }),
        });

        router.push(`/checkout/success?package=${selectedPackageId}&test=true`);
        return;
      }

      // Create DodoPayments checkout session
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPackageId,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (data.error) {
        // Show specific error message
        console.error("DodoPayments error:", data);

        // Show detailed error for debugging
        const errorMsg = data.message || data.error;
        const debugInfo = data.debugInfo ? `\nDebug: ${JSON.stringify(data.debugInfo)}` : '';

        setErrors({
          submit: `${errorMsg}${debugInfo}\n\nPlease check:\n• Product IDs are correct\n• Dodo account is fully set up\n• Test mode is enabled`
        });
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrors({ submit: "Unable to process payment. Please try crypto payment or contact support." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCryptoPayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      if (isTestMode) {
        // Test mode - skip actual payment verification
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Send test confirmation email
        await fetch("/api/send-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            firstName: formData.firstName,
            packageName: selectedPackage.name,
            amount: selectedPackage.cryptoPrice,
            paymentMethod: `crypto_${selectedCrypto}`,
            isTest: true,
          }),
        });

        router.push(`/checkout/success?package=${selectedPackageId}&method=crypto&test=true`);
        return;
      }

      // For real crypto payments, we'd verify the transaction
      // For now, redirect to manual verification page
      router.push(`/checkout/crypto-pending?package=${selectedPackageId}&crypto=${selectedCrypto}&email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      console.error("Crypto payment error:", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsProcessing(false);
    }
  };

  const currentCrypto = cryptoOptions.find(c => c.id === selectedCrypto)!;
  const displayPrice = paymentMethod === "crypto" ? selectedPackage.cryptoPrice : selectedPackage.price;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-[#888]" />
            <span className="text-[#888] text-sm">Back to home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#3B82F6]" />
            <span className="text-sm text-[#888]">Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Test Mode Banner */}
      {isTestMode && (
        <div className="bg-[#F59E0B]/10 border-b border-[#F59E0B]/30 px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-[#F59E0B]">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Test Mode Active - No real payment will be processed</span>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Form */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Complete Your Order</h1>
              <p className="text-[#888]">You&apos;re one step away from transforming your trading</p>
            </div>

            {/* Package Selection */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center text-xs">1</span>
                Select Package
              </h2>

              <div className="grid gap-3">
                {/* Starter Package */}
                <button
                  onClick={() => handlePackageChange("starter")}
                  className={`relative p-4 border rounded-xl text-left transition-all ${
                    selectedPackageId === "starter"
                      ? "border-[#3B82F6] bg-[#3B82F6]/10"
                      : "border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#333]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPackageId === "starter"
                          ? "border-[#3B82F6] bg-[#3B82F6]"
                          : "border-[#444]"
                      }`}>
                        {selectedPackageId === "starter" && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{packages.starter.name}</p>
                        <p className="text-xs text-[#888] mt-0.5">Full bot access + community</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${packages.starter.price}</p>
                      <p className="text-xs text-[#10B981]">${packages.starter.cryptoPrice} crypto</p>
                    </div>
                  </div>
                </button>

                {/* Elite Package - Recommended */}
                <button
                  onClick={() => handlePackageChange("elite")}
                  className={`relative p-4 border rounded-xl text-left transition-all ${
                    selectedPackageId === "elite"
                      ? "border-[#F59E0B] bg-[#F59E0B]/10"
                      : "border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#333]"
                  }`}
                >
                  {/* Recommended Badge */}
                  <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-[#F59E0B] to-[#F97316] rounded-full flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-black" />
                    <span className="text-[10px] font-bold text-black uppercase tracking-wide">Recommended</span>
                  </div>

                  <div className="flex items-start justify-between mt-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPackageId === "elite"
                          ? "border-[#F59E0B] bg-[#F59E0B]"
                          : "border-[#444]"
                      }`}>
                        {selectedPackageId === "elite" && (
                          <Check className="w-3 h-3 text-black" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{packages.elite.name}</p>
                          <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                        </div>
                        <p className="text-xs text-[#888] mt-0.5">1-on-1 onboarding + VIP support + bonus configs</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${packages.elite.price}</p>
                      <p className="text-xs text-[#10B981]">${packages.elite.cryptoPrice} crypto</p>
                    </div>
                  </div>

                  {/* Best Value indicator */}
                  <div className="mt-3 pt-3 border-t border-[#2a2a2a] flex items-center gap-2 text-xs text-[#F59E0B]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Best value for serious traders • Save $500+ in coaching fees</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center text-xs">2</span>
                Contact Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#888] mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full bg-[#0a0a0a] border ${errors.firstName ? 'border-[#EF4444]' : 'border-[#1a1a1a]'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-[#EF4444] text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm text-[#888] mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`w-full bg-[#0a0a0a] border ${errors.lastName ? 'border-[#EF4444]' : 'border-[#1a1a1a]'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-[#EF4444] text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#888] mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full bg-[#0a0a0a] border ${errors.email ? 'border-[#EF4444]' : 'border-[#1a1a1a]'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-[#EF4444] text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm text-[#888] mb-2">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-6 h-6 bg-[#3B82F6] rounded-full flex items-center justify-center text-xs">3</span>
                Payment Method
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 border rounded-lg flex items-center gap-3 transition-all ${
                    paymentMethod === "card"
                      ? "border-[#3B82F6] bg-[#3B82F6]/10"
                      : "border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#333]"
                  }`}
                >
                  <CreditCard className={`w-5 h-5 ${paymentMethod === "card" ? "text-[#3B82F6]" : "text-[#888]"}`} />
                  <div className="text-left">
                    <p className="font-medium">Card Payment</p>
                    <p className="text-xs text-[#888]">${selectedPackage.price} USD</p>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("crypto")}
                  className={`p-4 border rounded-lg flex items-center gap-3 transition-all ${
                    paymentMethod === "crypto"
                      ? "border-[#3B82F6] bg-[#3B82F6]/10"
                      : "border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#333]"
                  }`}
                >
                  <Wallet className={`w-5 h-5 ${paymentMethod === "crypto" ? "text-[#3B82F6]" : "text-[#888]"}`} />
                  <div className="text-left">
                    <p className="font-medium">Crypto</p>
                    <p className="text-xs text-[#888]">${selectedPackage.cryptoPrice} USD <span className="text-[#10B981]">(Save ${selectedPackage.price - selectedPackage.cryptoPrice})</span></p>
                  </div>
                </button>
              </div>

              {/* Crypto Selection */}
              {paymentMethod === "crypto" && (
                <div className="space-y-4 mt-4">
                  <p className="text-sm text-[#888]">Select cryptocurrency:</p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {cryptoOptions.map((crypto) => (
                      <button
                        key={crypto.id}
                        onClick={() => setSelectedCrypto(crypto.id)}
                        className={`p-3 border rounded-lg flex flex-col items-center gap-1 transition-all ${
                          selectedCrypto === crypto.id
                            ? "border-[#3B82F6] bg-[#3B82F6]/10"
                            : "border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#333]"
                        }`}
                      >
                        <span className="text-xl" style={{ color: crypto.color }}>{crypto.icon}</span>
                        <span className="text-xs text-[#888]">{crypto.symbol}</span>
                      </button>
                    ))}
                  </div>

                  {/* Wallet Address */}
                  <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#888]">Send {currentCrypto.symbol} to:</span>
                      <span className="text-sm font-medium" style={{ color: currentCrypto.color }}>
                        ${selectedPackage.cryptoPrice} USD
                      </span>
                    </div>

                    {/* Amount to Send */}
                    <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-4 mb-4">
                      <p className="text-xs text-[#888] mb-2">Amount to send:</p>
                      {pricesLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#3B82F6]/30 border-t-[#3B82F6] rounded-full animate-spin" />
                          <span className="text-sm text-[#888]">Fetching live rate...</span>
                        </div>
                      ) : getCryptoAmount(selectedCrypto) ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold" style={{ color: currentCrypto.color }}>
                              {getCryptoAmount(selectedCrypto)}
                            </span>
                            <span className="text-lg text-[#888]">{currentCrypto.symbol}</span>
                          </div>
                          <button
                            onClick={() => copyAmountToClipboard(getCryptoAmount(selectedCrypto)!)}
                            className="flex items-center gap-2 px-3 py-2 bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 border border-[#3B82F6]/50 rounded-lg transition-colors"
                          >
                            {copiedAmount ? (
                              <>
                                <Check className="w-4 h-4 text-[#10B981]" />
                                <span className="text-xs text-[#10B981]">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 text-[#3B82F6]" />
                                <span className="text-xs text-[#3B82F6]">Copy Amount</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-[#666]">Unable to fetch rate</span>
                      )}
                      <p className="text-[10px] text-[#555] mt-2">
                        * Rate refreshes every 60 seconds
                      </p>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center my-4">
                      <div className="bg-white p-3 rounded-lg">
                        <Image
                          src={`/${selectedCrypto}.jpeg`}
                          alt={`${currentCrypto.name} QR Code`}
                          width={400}
                          height={400}
                          className="rounded"
                        />
                      </div>
                    </div>

                    <p className="text-xs text-[#888] mb-2">Wallet Address:</p>
                    <div className="flex items-center gap-2 bg-black border border-[#1a1a1a] rounded-lg p-3">
                      <code className="flex-1 text-xs text-[#888] break-all">
                        {cryptoAddresses[selectedCrypto]}
                      </code>
                      <button
                        onClick={() => copyToClipboard(cryptoAddresses[selectedCrypto])}
                        className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-[#10B981]" />
                        ) : (
                          <Copy className="w-4 h-4 text-[#888]" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-[#666] mt-3">
                      After sending, click &quot;I&apos;ve Sent Payment&quot; below. We&apos;ll verify your transaction.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-[#EF4444]" />
                <span className="text-[#EF4444] text-sm">{errors.submit}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={paymentMethod === "card" ? handleCardPayment : handleCryptoPayment}
              disabled={isProcessing}
              className="w-full bg-white text-black font-semibold py-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Processing...
                </>
              ) : paymentMethod === "card" ? (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay ${displayPrice} with Card
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  I&apos;ve Sent ${displayPrice} in {currentCrypto.symbol}
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 text-xs text-[#666]">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>30-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Instant Access</span>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center p-1">
                  <Image
                    src="/logo.png"
                    alt="APEX Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold">{selectedPackage.name}</h3>
                  <p className="text-sm text-[#888]">APEX Protocol™</p>
                </div>
              </div>

              <div className="border-t border-[#1a1a1a] pt-4 space-y-3">
                <h4 className="text-sm font-medium text-[#888]">What&apos;s included:</h4>
                {selectedPackage.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#aaa]">{feature}</span>
                  </div>
                ))}
              </div>

              {paymentMethod === "crypto" && (
                <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-[#10B981]">
                    <span className="text-xl">🎄</span>
                    <div>
                      <p className="text-sm font-medium">Christmas Crypto Bonus!</p>
                      <p className="text-xs opacity-80">Save ${selectedPackage.price - selectedPackage.cryptoPrice} with crypto payment</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-[#1a1a1a] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#888]">Subtotal</span>
                  <span>${selectedPackage.price}</span>
                </div>
                {paymentMethod === "crypto" && (
                  <div className="flex justify-between text-sm text-[#10B981]">
                    <span>Crypto Discount</span>
                    <span>-${selectedPackage.price - selectedPackage.cryptoPrice}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#1a1a1a]">
                  <span>Total</span>
                  <span>${displayPrice} USD</span>
                </div>
              </div>

              {/* Guarantee */}
              <div className="bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#3B82F6] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">30-Day Money-Back Guarantee</p>
                    <p className="text-xs text-[#888] mt-1">
                      Try APEX risk-free. If you&apos;re not satisfied, get a full refund within 30 days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
