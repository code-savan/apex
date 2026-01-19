"use client";

import { useState, useEffect, Suspense, useRef } from "react";
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
  ArrowDown,
  Play,
  Pause,
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
  const prefilledName = searchParams.get("name") || "";
  const prefilledEmail = searchParams.get("email") || "";
  const isTestMode = searchParams.get("test") === "true";

  const [selectedPackageId, setSelectedPackageId] = useState<"test" | "starter" | "elite">(
    initialPackageId === "elite" ? "elite" : initialPackageId === "test" ? "test" : "starter"
  );
  const selectedPackage = packages[selectedPackageId];

  // APEX Scalper Addon State
  const [scalperAdded, setScalperAdded] = useState(false);
  const [scalperSectionVisible, setScalperSectionVisible] = useState(false);
  const scalperPrice = 349;
  const scalperDiscount = 50;

  // Video player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlayButton, setShowPlayButton] = useState(true);

  // Track if scalper section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setScalperSectionVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    const scalperSection = document.getElementById('scalper-section');
    if (scalperSection) {
      observer.observe(scalperSection);
    }

    return () => observer.disconnect();
  }, []);

  // Video player handlers
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
    let basePrice = paymentMethod === "crypto" ? selectedPackage.cryptoPrice : selectedPackage.price;
    if (scalperAdded) {
      const scalperFinalPrice = scalperPrice - scalperDiscount;
      basePrice += scalperFinalPrice;
    }
    return basePrice;
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
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">

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
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold">3</div>
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
                    <Wallet className="w-5 h-5" />
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

            <p className="text-center text-xs text-[#555] mt-5 mb-20 font-semibold">
              By completing this purchase, you agree to our Terms of Service
            </p>


              {/* APEX Scalper Add-on */}
              {selectedPackageId !== "test" && (
              <section id="scalper-section" className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-full bg-[#F59E0B]/20 flex items-center justify-center overflow-hidden">
                    <Image src="/logo.png" alt="APEX" width={20} height={20} className="object-contain" />
                  </div>
                  <h2 className="text-lg font-semibold text-white/80">Boost Your Results</h2>
                </div>

                <div className={`rounded-2xl overflow-hidden transition-all bg-[#0a0a0a] border border-[#1a1a1a] flex flex-col items-center justify-center ${
                  scalperAdded ? "ring-2 ring-[#10B981]/60" : ""
                }`}>
                  {/* Video Container - Full Width */}
                  <div className="relative h-[600px] w-full bg-black flex items-center justify-center group">
                    <video
                      ref={videoRef}
                      className="w-fit h-full object-cover"
                      poster="/scalper-thumbnail.jpg"
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onClick={togglePlay}
                    >
                      <source src="/scalperdemo.mp4" type="video/mp4" />
                    </video>

                    {/* Play/Pause Button Overlay */}
                    <button
                      onClick={togglePlay}
                      onMouseEnter={() => setShowPlayButton(true)}
                      className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                        isPlaying && !showPlayButton ? 'opacity-0' : 'opacity-100'
                      } group-hover:opacity-100`}
                    >
                      <div className="w-16 h-16 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition-all hover:scale-110">
                        {isPlaying ? (
                          <Pause className="w-8 h-8 text-white fill-white" />
                        ) : (
                          <Play className="w-8 h-8 text-white fill-white ml-1" />
                        )}
                      </div>
                    </button>

                    {/* Video Controls - Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-white font-mono">{formatTime(currentTime)}</span>
                        <input
                          type="range"
                          min="0"
                          max={duration || 0}
                          value={currentTime}
                          onChange={handleSeek}
                          className="flex-1 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
                          style={{
                            background: `linear-gradient(to right, white ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%)`
                          }}
                        />
                        <span className="text-xs text-white font-mono">{formatTime(duration)}</span>
                      </div>
                    </div>
                  </div>
                       {/* Floating Info Overlay - Bottom Left */}
                       <div className=" p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent w-full">
                      <div className="flex items-end justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#F59E0B] flex items-center justify-center shrink-0">
                            <Image src="/logo.png" alt="APEX" width={24} height={24} className="object-contain" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white">APEX Scalper</h3>
                            <p className="text-xs text-white/70">Lightning-fast scalping bot</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-white/50 line-through">${scalperPrice}</p>
                          <p className="font-bold text-lg text-[#F59E0B]">${scalperPrice - scalperDiscount}</p>
                        </div>
                      </div>
                    </div>

                  {/* Features & CTA */}
                  <div className={`p-6 w-full ${scalperAdded ? "bg-[#10B981]/10" : "bg-[#111]"}`}>
                    <div className="space-y-4 mb-6">
                      <p className="text-sm text-[#999]">
                        You&apos;re getting the APEX Protocol bot (swing trades, position trading).
                      </p>

                      <p className="text-sm text-white font-medium">
                        But what about the SMALLER moves happening every few seconds?
                      </p>

                      <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#F59E0B]/30">
                        <p className="text-sm text-white font-semibold mb-3">
                          🎯 APEX SCALPER catches the quick profits APEX misses.
                        </p>

                        <div className="space-y-2">
                          {[
                            " ✓⃝  Executes lightning-fast scalp trades (seconds to minutes)",
                            " ✓⃝  Targets 5-20 pip moves during high volatility (compounds FAST)",
                            " ✓⃝  Runs simultaneously with your main bot (zero conflict)",
                            " ✓⃝  Most profitable users run BOTH for 24/7 coverage"
                          ].map((feature, i) => (
                            <div key={i} className="flex items-start gap-2">
                              {/* <span className="text-[#F59E0B] ">→</span> */}
                              <span className="text-xs text-[#999]">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#0a0a0a] p-3 rounded-lg border border-[#3B82F6]/30">
                          <p className="text-xs font-bold text-[#3B82F6] mb-1">MAIN BOT:</p>
                          <p className="text-xs text-[#666]">Swing trades (bigger moves, fewer trades)</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-3 rounded-lg border border-[#F59E0B]/30">
                          <p className="text-xs font-bold text-[#F59E0B] mb-1">SCALPER:</p>
                          <p className="text-xs text-[#666]">Speed trades (smaller moves, constant action)</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-[#10B981]/20 to-[#10B981]/5 p-4 rounded-xl border border-[#10B981]/30">
                        <p className="text-sm text-white font-semibold mb-2">
                          TOGETHER = Maximum market coverage. All timeframes. All opportunities.
                        </p>
                        <p className="text-xs text-[#10B981] font-bold">
                          Verified Result: Users running both average 34% higher monthly returns.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setScalperAdded(!scalperAdded)}
                      className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                        scalperAdded
                          ? "bg-[#F97316] text-white hover:bg-[#F97316]"
                          : "bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-black hover:opacity-90"
                      }`}
                    >
                      {scalperAdded ? (
                        <span>I don&apos;t want Scalper Add-on</span>
                      ) : (
                        <span>+ Add to Order — ${scalperPrice - scalperDiscount}</span>
                      )}
                    </button>
                  </div>
                </div>
              </section>
            )}
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

                  {scalperAdded && (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className="text-[#555] font-medium">APEX Scalper</span>
                        <span className="font-bold">${scalperPrice - scalperDiscount}</span>
                      </div>
                      <div className="flex justify-between text-xs text-[#10B981]">
                        <span className="font-medium">Bundle Discount</span>
                        <span className="font-bold">-${scalperDiscount}</span>
                      </div>
                    </>
                  )}

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

      {/* Fixed Pulsing Addon Button - Shows when scalper section is not visible and not added */}
      {selectedPackageId !== "test" && !scalperSectionVisible && !scalperAdded && (
        <div className="fixed -bottom-5  left-[90px] z-50 p-4  pointer-events-none">
          <div className="max-w-xl mx-auto pointer-events-auto">
            <button
              onClick={() => {
                document.getElementById('scalper-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="w-full py-1.5 px-3 rounded-bl-0 rounded-br-0 rounded-t-xl
               bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-black font-bold text-[10px] flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(245,158,11,0.3)]  hover:animate-none hover:scale-[1.02] transition-transform cursor-pointer"
            >
              {/* <Sparkles className="w-4 h-4" /> */}
              <span className="animate-pulse">Don&apos;t Miss: APEX Scalper Add-on — Over $100,000 monthly in scalping technology</span>
              <ArrowDown className="w-4 h-4 animate-bounce mt-1" />
            </button>
          </div>
        </div>
      )}
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
