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
  Coins,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Package data
const packages = {
  test: {
    name: "Test Product",
    price: 1,
    cryptoPrice: 1,
    features: [
      "Live payment testing",
      "Verify payment flow",
      "Test email notifications",
    ],
  },
  starter: {
    name: "Starter Protocol",
    price: 499,
    cryptoPrice: 399,
    features: [
      "Full APEX Bot (Unlimited MT4/MT5 use)",
      "APEX Scalper — $5K-$10K scalping power",
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
      "APEX Scalper — $100K+ scalping power ⚡",
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
  const prefilledName = searchParams.get("name") || "";
  const prefilledEmail = searchParams.get("email") || "";
  const isTestMode = searchParams.get("test") === "true";

  const [selectedPackageId, setSelectedPackageId] = useState<"test" | "starter" | "elite">(
    initialPackageId === "elite" ? "elite" : initialPackageId === "test" ? "test" : "starter"
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
    email: prefilledEmail,
    phone: "",
    firstName: prefilledName.split(" ")[0] || "",
    lastName: prefilledName.split(" ").slice(1).join(" ") || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate total price
  const getTotalPrice = () => {
    return paymentMethod === "crypto" ? selectedPackage.cryptoPrice : selectedPackage.price;
  };

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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Clean Header */}
      <header className="border-b border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#888] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2 text-[#888]">
            <Lock className="w-4 h-4" />
            <span className="text-sm">Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Test Mode Banner */}
      {isTestMode && (
        <div className="bg-[#F59E0B]/10 border-b border-[#F59E0B]/20 py-2">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-2 text-[#F59E0B]">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Test Mode — No real payment will be processed</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col-reverse md:flex-row gap-8 lg:gap-14">

          {/* LEFT Column - Form */}
          <div className="w-full flex-1  order-2 lg:order-1">
            {/* Page Title */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold tracking-tight mb-3">Complete Your Order</h1>
              <p className="text-[#666] text-lg">Secure checkout — Get instant access after payment</p>
            </div>

            {/* Package Selection */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold">1</div>
                <h2 className="text-lg font-semibold text-white/80">Select Package</h2>
              </div>

              <div className="space-y-4">
                {/* Starter */}
                <button
                  onClick={() => handlePackageChange("starter")}
                  className={`w-full p-5 rounded-2xl text-left transition-all ${
                    selectedPackageId === "starter"
                      ? "bg-gradient-to-r from-[#3B82F6]/20 to-[#3B82F6]/5 ring-2 ring-[#3B82F6]"
                      : "bg-[#111] hover:bg-[#161616]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedPackageId === "starter" ? "border-[#3B82F6] bg-[#3B82F6]" : "border-[#444]"
                      }`}>
                        {selectedPackageId === "starter" && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{packages.starter.name}</p>
                        <p className="text-sm text-[#666]">Full bot access + community</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">${packages.starter.price}</p>
                      <p className="text-xs text-[#10B981]">${packages.starter.cryptoPrice} with crypto</p>
                    </div>
                  </div>
                </button>

                {/* Elite */}
                <button
                  onClick={() => handlePackageChange("elite")}
                  className={`w-full p-5 rounded-2xl text-left transition-all relative ${
                    selectedPackageId === "elite"
                      ? "bg-gradient-to-r from-[#F59E0B]/20 to-[#F59E0B]/5 ring-2 ring-[#F59E0B]"
                      : "bg-[#111] hover:bg-[#161616]"
                  }`}
                >
                  <div className="absolute -top-3 left-5 px-3 py-1 bg-gradient-to-r from-[#F59E0B] to-[#F97316] rounded-full text-xs font-bold text-black uppercase tracking-wide">
                    Most Popular
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedPackageId === "elite" ? "border-[#F59E0B] bg-[#F59E0B]" : "border-[#444]"
                      }`}>
                        {selectedPackageId === "elite" && <Check className="w-3.5 h-3.5 text-black" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-lg">{packages.elite.name}</p>
                          <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                        </div>
                        <p className="text-sm text-[#666]">1-on-1 onboarding + VIP support</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">${packages.elite.price}</p>
                      <p className="text-xs text-[#10B981]">${packages.elite.cryptoPrice} with crypto</p>
                    </div>
                  </div>
                </button>
              </div>
            </section>

            {/* Contact Details */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold">2</div>
                <h2 className="text-lg font-semibold text-white/80">Your Details</h2>
              </div>

              <div className="bg-[#111] rounded-2xl p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#888] mb-2 font-medium">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className={`w-full bg-[#0a0a0a] border ${errors.firstName ? 'border-[#EF4444]' : 'border-[#222]'} rounded-xl px-4 py-3.5 text-white placeholder:text-[#444] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all`}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="text-[#EF4444] text-xs mt-2">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-[#888] mb-2 font-medium">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className={`w-full bg-[#0a0a0a] border ${errors.lastName ? 'border-[#EF4444]' : 'border-[#222]'} rounded-xl px-4 py-3.5 text-white placeholder:text-[#444] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all`}
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-[#EF4444] text-xs mt-2">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#888] mb-2 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full bg-[#0a0a0a] border ${errors.email ? 'border-[#EF4444]' : 'border-[#222]'} rounded-xl px-4 py-3.5 text-white placeholder:text-[#444] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-[#EF4444] text-xs mt-2">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm text-[#888] mb-2 font-medium">Phone Number <span className="text-[#444]">(Optional)</span></label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl px-4 py-3.5 text-white placeholder:text-[#444] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="mb-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex
                items-center justify-center text-sm font-semibold">3</div>
                <h2 className="text-lg font-semibold text-white/80">Payment Method</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`py-4 px-5 rounded-2xl flex items-center justify-center gap-3 transition-all ${
                    paymentMethod === "card"
                      ? "bg-green-400/80 text-black"
                      : "bg-[#111] text-[#888] hover:bg-[#161616]"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-semibold">Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("crypto")}
                  className={`py-4 px-5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === "crypto"
                      ? "bg-green-400/80 text-black"
                      : "bg-[#111] text-[#888] hover:bg-[#161616]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5" />
                    <span className="font-semibold">Crypto</span>
                  </div>

                    {/* <span className="text-[10px] text-[#10B981] font-semibold">Save ${selectedPackage.price - selectedPackage.cryptoPrice}</span> */}

                </button>
              </div>

              {/* Crypto Options */}
              {paymentMethod === "crypto" && (
                <div className="space-y-5">
                  {/* Crypto Selector */}
                  <div className="grid grid-cols-5 gap-2">
                    {cryptoOptions.map((crypto) => (
                      <button
                        key={crypto.id}
                        onClick={() => setSelectedCrypto(crypto.id)}
                        className={`py-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                          selectedCrypto === crypto.id
                            ? "bg-[#1a1a1a] ring-2 ring-white"
                            : "bg-[#111] hover:bg-[#1a1a1a]"
                        }`}
                      >
                        <span className="text-2xl" style={{ color: crypto.color }}>{crypto.icon}</span>
                        <span className="text-xs text-[#888]">{crypto.symbol}</span>
                      </button>
                    ))}
                  </div>

                  {/* Amount & Address */}
                  <div className="bg-[#111] rounded-2xl p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#888] font-medium">Send exactly:</span>
                      {pricesLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#333] border-t-white rounded-full animate-spin" />
                          <span className="text-sm text-[#888]">Loading...</span>
                        </div>
                      ) : getCryptoAmount(selectedCrypto) ? (
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-lg" style={{ color: currentCrypto.color }}>
                            {getCryptoAmount(selectedCrypto)} {currentCrypto.symbol}
                          </span>
                          <button
                            onClick={() => copyAmountToClipboard(getCryptoAmount(selectedCrypto)!)}
                            className="p-2 hover:bg-[#222] rounded-lg transition-colors"
                          >
                            {copiedAmount ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4 text-[#888]" />}
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-[#888]">—</span>
                      )}
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center py-4">
                      <div className="bg-white p-3 rounded-xl">
                        <Image
                          src={`/${selectedCrypto}.jpeg`}
                          alt={`${currentCrypto.name} QR Code`}
                          width={140}
                          height={140}
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-[#888] font-medium">Wallet Address</span>
                        <button
                          onClick={() => copyToClipboard(cryptoAddresses[selectedCrypto])}
                          className="text-xs text-[#3B82F6] hover:text-[#60A5FA] flex items-center gap-1.5 font-medium transition-colors"
                        >
                          {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Address</>}
                        </button>
                      </div>
                      <code className="block text-xs text-[#666] bg-[#0a0a0a] p-4 rounded-xl break-all font-mono border border-[#1a1a1a]">
                        {cryptoAddresses[selectedCrypto]}
                      </code>
                    </div>
                  </div>
                </div>
              )}
            </section>



            {/* Error */}
            {errors.submit && (
              <div className="mb-6 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-2xl p-5 flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
                <p className="text-sm text-[#EF4444]">{errors.submit}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={paymentMethod === "card" ? handleCardPayment : handleCryptoPayment}
              disabled={isProcessing}
              className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-[#f0f0f0] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base shadow-[0_0_30px_rgba(255,255,255,0.1)] cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  {paymentMethod === "card" ? `Pay $${getTotalPrice()}` : `Confirm Payment — $${getTotalPrice()}`}
                </>
              )}
            </button>

            <p className="text-center text-xs text-[#555] mt-5 mb-8 font-semibold">
              By completing this purchase, you agree to our Terms of Service
            </p>
          </div>

          {/* RIGHT Column - Order Summary (Sticky) */}
          <div className="w-full flex-1 shrink-0 order-1 lg:order-2">
            <div className="lg:sticky lg:top-8">
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-[#1a1a1a]">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-[#888] mb-4">Order Summary</h2>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#111] flex items-center justify-center border border-[#1a1a1a]">
                      <Image
                        src="/logo.png"
                        alt="APEX"
                        width={28}
                        height={28}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{selectedPackage.name}</h3>
                      <p className="text-xs text-[#555]">APEX Protocol™</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="p-5 border-b border-[#1a1a1a]">
                  <h4 className="text-[10px] font-bold text-[#444] uppercase tracking-wider mb-3">Included</h4>
                  <div className="space-y-2.5">
                    {selectedPackage.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6] shrink-0 mt-0.5" />
                        <span className="text-md font-medium text-[#777]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="p-5 space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#555] font-medium">{selectedPackage.name}</span>
                    <span className="font-bold">${paymentMethod === "crypto" ? selectedPackage.cryptoPrice : selectedPackage.price}</span>
                  </div>

                  {paymentMethod === "crypto" && (
                    <div className="flex justify-between text-xs text-[#10B981]">
                      <span className="font-medium">Crypto Discount</span>
                      <span className="font-bold">-${selectedPackage.price - selectedPackage.cryptoPrice}</span>
                    </div>
                  )}

                  <div className="pt-4 mt-2 border-t border-[#1a1a1a]">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#555] font-bold uppercase">Total</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold">${getTotalPrice()}</span>
                        <p className="text-[10px] text-[#444] font-medium">One-time payment</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guarantee */}
                <div className="px-5 py-3 bg-[#10B981]/10 border-t border-[#10B981]/20">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    <p className="text-sm font-bold text-[#10B981]">30-Day Money Back Guarantee</p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex justify-center gap-6 mt-4 text-[12px] text-[#444] font-semibold">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  <span>Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Risk Disclaimers */}
      <footer className="border-t border-[#1a1a1a] mt-12">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="p-6 border border-[#1a1a1a] bg-[#0a0a0a] space-y-4 text-xs text-[#666] leading-relaxed">
            <h4 className="text-[#888] font-semibold text-sm mb-3">Important Risk Disclosure</h4>

            <p>
              <span className="text-[#888] font-medium">Trading Foreign Exchange (Forex) and Contracts for Difference (CFDs) is highly speculative and carries a high level of risk.</span> It may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade forex or any other financial instrument, you should carefully consider your investment objectives, level of experience, and risk appetite.
            </p>

            <p>
              <span className="text-[#888] font-medium">APEX Protocol™ is an automated trading system that executes trades based on algorithmic logic.</span> While the system is designed to operate without emotional bias, it does not eliminate market risk. You could sustain a loss of some or all of your initial investment. Therefore, you should not invest money that you cannot afford to lose.
            </p>

            <p>
              <span className="text-[#888] font-medium">Past performance is not indicative of future results.</span> All trading results, testimonials, and performance statistics shown on this website are based on historical data and do not guarantee future profitability. Individual results will vary based on account size, market conditions, leverage used, broker execution, and other factors beyond our control.
            </p>

            <p>
              <span className="text-[#888] font-medium">No Financial Advice:</span> The information provided on this website is for educational and informational purposes only and should not be construed as financial, investment, or trading advice. We are not registered financial advisors. You should seek independent financial advice from a professional before making any trading decisions.
            </p>

            <p>
              <span className="text-[#888] font-medium">Broker Dependency:</span> APEX Protocol™ requires integration with third-party trading platforms (MT4/MT5). We are not affiliated with any broker and do not control trade execution, spreads, slippage, or order fill quality. Your trading results may be affected by your choice of broker.
            </p>

            <p>
              <span className="text-[#888] font-medium">System Performance:</span> While APEX Protocol™ undergoes rigorous testing, software performance can be affected by internet connectivity, server uptime, VPS reliability, and other technical factors. We recommend proper risk management and never risking more than 1-2% of your account per trade.
            </p>

            <p>
              <span className="text-[#888] font-medium">Hypothetical Performance:</span> Any hypothetical or simulated performance results have certain inherent limitations. Unlike actual performance records, simulated results do not represent actual trading and may not reflect the impact of brokerage commissions, slippage, or other real-world trading costs.
            </p>

            <p className="text-[#EF4444] font-semibold">
              By purchasing APEX Protocol™, you acknowledge that you have read, understood, and accepted all risks associated with forex trading and automated trading systems. You agree to use the software at your own risk.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-[#444] space-y-2 mt-6">
            <p>© {new Date().getFullYear()} APEX Protocol™. All rights reserved.</p>
            <p className="text-[#333]">
              This product is not affiliated with, endorsed by, or sponsored by any broker or financial institution.
              <br />
              Forex trading carries substantial risk and is not suitable for every investor.
            </p>
          </div>
        </div>
      </footer>
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
