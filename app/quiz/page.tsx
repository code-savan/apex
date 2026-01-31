"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  CheckCircle2,
  ChevronDown,
  Download,
  Clock,
  Shield,
  Globe,
  Headphones,
  Gift,
  X,
  Copy,
  Check,
  CreditCard,
  AlertCircle,
  Coins,
  Star,
} from "lucide-react";
import { LICENSES_REMAINING, LICENSES_SOLD, LICENSES_TOTAL, testimonials } from "../constants";

// ============ TYPES ============

interface QuizOption {
  value: string;
  label: string;
  points: number;
  amount?: number;
  buyingPower?: string;
  urgency?: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  description?: string;
  options: QuizOption[];
  trackingKey: string;
}

interface UserData {
  name: string;
  email: string;
  whatsapp: string;
}

interface QuizAnswers {
  [key: string]: QuizOption;
}

// ============ QUIZ DATA ============

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "How long have you been trading forex?",
    options: [
      { value: "beginner", label: "Just started (0-3 months)", points: 5 },
      { value: "learning", label: "Still learning (3-12 months)", points: 10 },
      { value: "active", label: "Actively trading (1-2 years)", points: 15 },
      { value: "experienced", label: "Experienced trader (2+ years)", points: 20 },
    ],
    trackingKey: "experience_level",
  },
  {
    id: 2,
    question: "Which statement describes your trading experience best?",
    options: [
      { value: "profitable", label: "I'm profitable and consistent", points: 5 },
      { value: "breakeven", label: "I break even most months", points: 15 },
      { value: "losing", label: "I lose more than I win", points: 25 },
      { value: "blown", label: "I've blown an account before", points: 30 },
    ],
    trackingKey: "current_state",
  },
  {
    id: 3,
    question: "Have you ever experienced this scenario?",
    description:
      "You're in a winning trade... up $800... then you panic and close early for $200. Hours later you see it hit your original target for $1,400.",
    options: [
      { value: "constantly", label: "Yes, this happens to me constantly", points: 30 },
      { value: "sometimes", label: "Yes, it's happened a few times", points: 20 },
      { value: "rarely", label: "Rarely, but I've done it", points: 10 },
      { value: "never", label: "No, never", points: 0 },
    ],
    trackingKey: "emotional_trading",
  },
  {
    id: 4,
    question: "In the past 12 months, approximately how much have you lost in forex?",
    options: [
      { value: "under500", label: "Under $500", points: 5, amount: 500 },
      { value: "500-2k", label: "$500 - $2,000", points: 10, amount: 2000 },
      { value: "2k-5k", label: "$2,000 - $5,000", points: 20, amount: 5000 },
      { value: "5k-10k", label: "$5,000 - $10,000", points: 25, amount: 10000 },
      { value: "over10k", label: "Over $10,000", points: 30, amount: 10000 },
    ],
    trackingKey: "total_losses",
  },
  {
    id: 5,
    question: "What's the #1 thing holding you back from consistent profits?",
    options: [
      { value: "emotions", label: "Emotional trading (fear, greed, revenge)", points: 25 },
      { value: "strategy", label: "Don't know which strategy to use", points: 15 },
      { value: "time", label: "Not enough time to analyze markets", points: 20 },
      { value: "missed", label: "Missed opportunities (trades happen when I'm asleep)", points: 25 },
      { value: "all", label: "All of the above", points: 30 },
    ],
    trackingKey: "main_blocker",
  },
  {
    id: 6,
    question: "Be honest: Have you ever 'revenge traded' after a loss?",
    description: "(Jumped back in angry, oversized your position, tried to 'get it back')",
    options: [
      { value: "bigtime", label: "Yes, and it cost me big time", points: 30 },
      { value: "occasionally", label: "Yes, occasionally", points: 20 },
      { value: "rarely", label: "Rarely", points: 10 },
      { value: "never", label: "Never", points: 0 },
    ],
    trackingKey: "revenge_trading",
  },
  {
    id: 7,
    question:
      "How often do you miss profitable setups because you were asleep, at work, or away from your computer?",
    options: [
      { value: "daily", label: "All the time (daily)", points: 30 },
      { value: "weekly", label: "Few times per week", points: 20 },
      { value: "occasionally", label: "Occasionally", points: 10 },
      { value: "rarely", label: "Rarely", points: 5 },
    ],
    trackingKey: "missed_opportunities",
  },
  {
    id: 8,
    question: "How many hours per day do you spend trading or analyzing charts?",
    options: [
      { value: "1-2", label: "1-2 hours", points: 10 },
      { value: "3-4", label: "3-4 hours", points: 15 },
      { value: "5-6", label: "5-6 hours", points: 20 },
      { value: "7plus", label: "7+ hours (it's consuming my life)", points: 30 },
    ],
    trackingKey: "time_investment",
  },
  {
    id: 9,
    question: "How much have you spent on trading courses, signals, or indicators?",
    options: [
      { value: "zero", label: "$0 (just learning free)", points: 5, amount: 0 },
      { value: "100-500", label: "$100 - $500", points: 10, amount: 500 },
      { value: "500-2k", label: "$500 - $2,000", points: 20, amount: 2000 },
      { value: "2k-5k", label: "$2,000 - $5,000", points: 25, amount: 5000 },
      { value: "over5k", label: "Over $5,000", points: 30, amount: 5000 },
    ],
    trackingKey: "education_spent",
  },
  {
    id: 10,
    question:
      "If there was a way to trade WITHOUT emotions, 24/7, catching every setup while you sleep—would you be interested?",
    options: [
      { value: "absolutely", label: "Absolutely, that's exactly what I need", points: 30 },
      { value: "skeptical", label: "Yes, but I'm skeptical", points: 20 },
      { value: "maybe", label: "Maybe, tell me more", points: 10 },
      { value: "no", label: "No, I prefer manual trading", points: 0 },
    ],
    trackingKey: "solution_interest",
  },
  {
    id: 11,
    question: "What would emotionless, 24/7 AI trading be worth to you?",
    description: "(Catches trades at 3 AM, no revenge trading, no fear, no greed)",
    options: [
      { value: "100-500", label: "$100 - $500", points: 10, amount: 500 },
      { value: "500-1k", label: "$500 - $1,000", points: 15, amount: 1000 },
      { value: "1k-3k", label: "$1,000 - $3,000", points: 25, amount: 3000 },
      { value: "3k-5k", label: "$3,000 - $5,000", points: 30, amount: 5000 },
      { value: "over5k", label: "Over $5,000", points: 35, amount: 5000 },
    ],
    trackingKey: "perceived_value",
  },
  {
    id: 12,
    question:
      "If the right solution could help you become consistently profitable, how much could you invest TODAY?",
    options: [
      { value: "100-300", label: "$100 - $300", points: 5, buyingPower: "low" },
      { value: "300-500", label: "$300 - $500", points: 15, buyingPower: "medium" },
      { value: "500-1k", label: "$500 - $1,000", points: 25, buyingPower: "high" },
      { value: "1k-3k", label: "$1,000 - $3,000", points: 30, buyingPower: "very-high" },
      { value: "thinking", label: "I need to think about it", points: 0, buyingPower: "cold" },
    ],
    trackingKey: "investment_capacity",
  },
  {
    id: 13,
    question: "How soon do you want to solve your trading struggles?",
    options: [
      { value: "now", label: "Right now (I'm desperate)", points: 35, urgency: "hot" },
      { value: "week", label: "Within the next week", points: 25, urgency: "warm" },
      { value: "month", label: "This month", points: 15, urgency: "medium" },
      { value: "exploring", label: "Just exploring options", points: 5, urgency: "cold" },
    ],
    trackingKey: "urgency_level",
  },
  {
    id: 14,
    question: "If you had access to a proven AI trading system TODAY, would you:",
    options: [
      { value: "start", label: "Start using it immediately", points: 30 },
      { value: "test", label: "Test it for a few days first", points: 20 },
      { value: "research", label: "Research more before deciding", points: 10 },
      { value: "fence", label: "I'm still on the fence", points: 0 },
    ],
    trackingKey: "commitment_level",
  },
  {
    id: 15,
    question: "What would an extra $3,000 - $5,000 per month mean for you?",
    options: [
      { value: "debt", label: "Pay off debt / bills", points: 15 },
      { value: "quit", label: "Quit my 9-5 eventually", points: 20 },
      { value: "freedom", label: "Financial freedom", points: 25 },
      { value: "family", label: "Take care of my family", points: 20 },
      { value: "wealth", label: "Build wealth / invest more", points: 15 },
    ],
    trackingKey: "goal_motivation",
  },
];

// Country codes for WhatsApp
const countryCodes = [
  { code: "+1", country: "US/CA" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "AU" },
  { code: "+91", country: "IN" },
  { code: "+234", country: "NG" },
  { code: "+27", country: "ZA" },
  { code: "+971", country: "UAE" },
  { code: "+65", country: "SG" },
  { code: "+60", country: "MY" },
  { code: "+63", country: "PH" },
  { code: "+254", country: "KE" },
  { code: "+233", country: "GH" },
  { code: "+92", country: "PK" },
  { code: "+880", country: "BD" },
  { code: "+20", country: "EG" },
  { code: "+966", country: "SA" },
  { code: "+49", country: "DE" },
  { code: "+33", country: "FR" },
  { code: "+39", country: "IT" },
  { code: "+34", country: "ES" },
  { code: "+31", country: "NL" },
  { code: "+55", country: "BR" },
  { code: "+52", country: "MX" },
  { code: "+81", country: "JP" },
  { code: "+82", country: "KR" },
  { code: "+86", country: "CN" },
];

// ============ STORAGE HELPERS ============

declare global {
  interface Window {
    storage?: {
      get: (key: string, shared?: boolean) => Promise<{ value: string } | null>;
      set: (key: string, value: string, shared?: boolean) => Promise<void>;
    };
  }
}

async function storageSet(key: string, value: string, shared: boolean = false): Promise<void> {
  try {
    if (typeof window !== "undefined" && window.storage) {
      await window.storage.set(key, value, shared);
    } else {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.error("Storage set error:", error);
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  }
}

async function storageGet(key: string, shared: boolean = false): Promise<string | null> {
  try {
    if (typeof window !== "undefined" && window.storage) {
      const result = await window.storage.get(key, shared);
      return result?.value || null;
    } else {
      return localStorage.getItem(key);
    }
  } catch (error) {
    console.error("Storage get error:", error);
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  }
}

// ============ TOAST COMPONENT ============

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-up">
      <div className="bg-[#EF4444] text-white px-6 py-3 flex items-center gap-3 shadow-lg shadow-[#EF4444]/30">
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="hover:opacity-70 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ============ COMPONENTS ============

// Email Capture Screen
function EmailCaptureScreen({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: UserData) => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [whatsapp, setWhatsapp] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [toast, setToast] = useState("");
  const todayCount = 487;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setToast("Please enter your name");
      return;
    }

    if (!email.trim() || !validateEmail(email)) {
      setToast("Please enter a valid email address");
      return;
    }

    onSubmit({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: whatsapp ? `${countryCode}${whatsapp}` : "",
    });
  };

  return (
    <div className="h-screen bg-[#0a0a0a] flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#0066FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#FFB800]/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[480px] lg:max-w-[600px] xl:max-w-[700px] 2xl:w-[80%] 2xl:max-w-[900px] relative z-10">
        {/* Logo */}
        <div className="text-center mb-4 md:mb-6">
          <Link href="/" className="inline-block">
            <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 flex items-center justify-center border border-white/60 shadow-lg shadow-[#0066FF]/10">
              <Image src="/logo.png" alt="APEX Protocol" width={32} height={32} className="object-contain" />
            </div>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-[#2a2a2a] p-5 md:p-6 lg:p-8 shadow-2xl">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center mb-2">
            Get Your Personalized Trading Assessment
          </h1>
          <p className="text-[#A0A0A0] text-center mb-5 md:mb-6 text-xs md:text-sm">
            Discover if APEX Protocol is right for you + unlock our free{" "}
            <span className="text-[#FFB800] font-semibold">Gold Trading Strategies</span> guide
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {/* Name & Email Row on larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs text-[#A0A0A0] mb-1.5 font-medium">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-3 py-2.5 md:py-3 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/50 transition-all"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-xs text-[#A0A0A0] mb-1.5 font-medium">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-3 py-2.5 md:py-3 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/50 transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* WhatsApp Input */}
            <div>
              <label className="block text-xs text-[#A0A0A0] mb-1.5 font-medium">
                WhatsApp Number <span className="text-[#555]">(optional)</span>
              </label>
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="h-full bg-[#0a0a0a] border border-[#2a2a2a] px-2.5 py-2.5 md:py-3 text-white text-sm flex items-center gap-1 hover:border-[#0066FF] transition-all min-w-[80px] justify-between"
                    disabled={isLoading}
                  >
                    <span>{countryCode}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#666]" />
                  </button>
                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-[#2a2a2a] shadow-2xl z-50 max-h-48 overflow-y-auto w-36">
                      {countryCodes.map((cc) => (
                        <button
                          key={cc.code}
                          type="button"
                          onClick={() => {
                            setCountryCode(cc.code);
                            setShowCountryDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs text-white hover:bg-[#2a2a2a] transition-colors flex justify-between"
                        >
                          <span>{cc.code}</span>
                          <span className="text-[#666]">{cc.country}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Phone number"
                  className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] px-3 py-2.5 md:py-3 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/50 transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold py-3 md:py-3.5 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#0066FF]/25 hover:shadow-[#0066FF]/40 disabled:opacity-50 disabled:cursor-not-allowed group text-sm md:text-base"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Starting...</span>
                </>
              ) : (
                <>
                  <span>Start Assessment</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-2 pt-3 border-t border-[#2a2a2a]">
            <p className="text-[#666] text-xs flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              Your info is secure. No spam, ever.
            </p>
            <p className="text-xs">
              <span className="text-[#FFB800] font-semibold">{todayCount}</span>
              <span className="text-[#A0A0A0]"> traders took this today</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quiz Interface
function QuizInterface({
  currentQuestion,
  answers,
  onAnswer,
  onNext,
  onBack,
  onComplete,
  isSubmitting,
}: {
  currentQuestion: number;
  answers: QuizAnswers;
  onAnswer: (questionKey: string, option: QuizOption) => void;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
  isSubmitting: boolean;
}) {
  const question = questions[currentQuestion];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const selectedAnswer = answers[question.trackingKey];
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  // Track clicked option for immediate UI feedback (before parent state updates)
  // Use a ref to track which question the click was for
  const [clickedOption, setClickedOption] = useState<{questionId: number, value: string} | null>(null);

  // Only consider clickedOption if it's for the current question
  const currentClickedValue = clickedOption?.questionId === currentQuestion ? clickedOption.value : null;

  // Check if current question has an answer (either from parent state or just clicked)
  const hasAnswer = selectedAnswer || currentClickedValue;

  const handleOptionClick = (option: QuizOption) => {
    if (isSubmitting) return;
    setClickedOption({ questionId: currentQuestion, value: option.value }); // Immediate UI feedback
    onAnswer(question.trackingKey, option);

    // Auto-advance to next question (except on last question)
    if (!isLastQuestion) {
      // Small delay for visual feedback before advancing
      setTimeout(() => {
        onNext();
      }, 300);
    }
  };

  const handleNext = () => {
    if (isSubmitting) return;
    if (isLastQuestion) {
      onComplete();
    } else {
      onNext();
    }
  };

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col overflow-hidden">
      {/* Header with Progress */}
      <div className="shrink-0 bg-[#0a0a0a] border-b border-[#1a1a1a] px-4 py-3">
        <div className="w-full max-w-[90%] lg:max-w-[80%] mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#A0A0A0]">
              Question <span className="text-white font-semibold">{currentQuestion + 1}</span> of{" "}
              <span className="text-white font-semibold">{totalQuestions}</span>
            </span>
            <span className="text-xs text-[#FFB800] font-semibold">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-1.5 bg-[#1a1a1a] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0066FF] to-[#FFB800] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content - Aligned to top */}
      <div className="flex-1 px-4 py-4 overflow-hidden">
        <div className="w-full max-w-[90%] lg:max-w-[80%] mx-auto">
          {/* Question Card */}
          <div
            className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-[#2a2a2a] p-4 md:p-6 shadow-2xl animate-fade-in-up"
            key={question.id}
          >
            {/* Question Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="shrink-0 bg-[#FFB800]/10 border border-[#FFB800]/30 px-2.5 py-1">
                <span className="text-[#FFB800] font-semibold text-xs">Q{question.id}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-base md:text-lg lg:text-xl font-bold text-white leading-snug">
                  {question.question}
                </h2>
                {question.description && (
                  <p className="text-[#A0A0A0] text-xs md:text-sm mt-1.5 italic">{question.description}</p>
                )}
              </div>
            </div>

            {/* Answer Options - Stacked list */}
            <div className={`space-y-2 ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}>
              {question.options.map((option) => {
                const isSelected = selectedAnswer?.value === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleOptionClick(option)}
                    disabled={isSubmitting}
                    className={`w-full text-left p-3 border transition-all duration-200 group disabled:cursor-not-allowed ${
                      isSelected
                        ? "bg-[#0066FF]/10 border-[#0066FF] shadow-lg shadow-[#0066FF]/10"
                        : "bg-[#0a0a0a] border-[#2a2a2a] hover:border-[#3a3a3a] hover:bg-[#111]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? "bg-[#0066FF] border-[#0066FF]" : "border-[#3a3a3a] group-hover:border-[#555]"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span
                        className={`text-sm transition-colors ${
                          isSelected ? "text-white font-medium" : "text-[#ccc] group-hover:text-white"
                        }`}
                      >
                        {option.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="shrink-0 bg-[#0a0a0a] border-t border-[#1a1a1a] px-4 py-3">
        <div className="w-full max-w-[90%] lg:max-w-[80%] mx-auto flex items-center justify-between gap-4">
          {/* Back Button */}
          <button
            onClick={onBack}
            disabled={currentQuestion === 0 || isSubmitting}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-all text-sm ${
              currentQuestion === 0 || isSubmitting
                ? "text-[#444] cursor-not-allowed"
                : "text-[#A0A0A0] hover:text-white hover:bg-[#1a1a1a]"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Free Guide Indicator */}
          <div className="hidden md:flex items-center gap-2 text-xs text-[#A0A0A0]">
            <Gift className="w-4 h-4 text-[#FFB800]" />
            <span>Complete quiz to unlock <span className="text-[#FFB800] font-semibold">FREE Gold Trading Guide</span></span>
          </div>

          {/* Next/Complete Button */}
          <button
            onClick={handleNext}
            disabled={!hasAnswer || isSubmitting}
            className={`flex items-center gap-2 px-6 py-2 font-bold transition-all text-sm ${
              hasAnswer && !isSubmitting
                ? "bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-lg shadow-[#0066FF]/25 hover:shadow-[#0066FF]/40"
                : "bg-[#1a1a1a] text-[#444] cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{isLastQuestion ? "See My Results" : "Next"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Mobile Free Guide Indicator */}
        <div className="md:hidden flex items-center justify-center gap-2 mt-2 text-xs text-[#A0A0A0]">
          <Gift className="w-3.5 h-3.5 text-[#FFB800]" />
          <span>Complete for <span className="text-[#FFB800] font-semibold">FREE Guide</span></span>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setIsOpen((prev) => !prev)}
      className="w-full text-left py-5 border-b border-[#1a1a1a]"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-white font-semibold text-sm md:text-base">{question}</p>
        <ChevronDown className={`w-5 h-5 text-[#666] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>
      {isOpen && (
        <p className="text-[#888] text-sm leading-relaxed mt-3">
          {answer}
        </p>
      )}
    </button>
  );
}

// Results Page
function ResultsPage({
  userData,
  answers,
  leadScore,
}: {
  userData: UserData;
  answers: QuizAnswers;
  leadScore: number;
}) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const checkoutRef = useRef<HTMLDivElement>(null);

  // ===================== INLINE CHECKOUT (copied/adapted from /checkout) =====================
  const packages = {
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

  const cryptoOptions = [
    { id: "btc", name: "Bitcoin", symbol: "BTC", icon: "₿", color: "#F7931A" },
    { id: "eth", name: "Ethereum", symbol: "ETH", icon: "Ξ", color: "#627EEA" },
    { id: "usdt", name: "Tether", symbol: "USDT", icon: "₮", color: "#26A17B" },
    { id: "sol", name: "Solana", symbol: "SOL", icon: "◎", color: "#9945FF" },
    { id: "ltc", name: "Litecoin", symbol: "LTC", icon: "Ł", color: "#BFBBBB" },
  ];

  const [selectedPackageId, setSelectedPackageId] = useState<"starter" | "elite">("starter");
  const selectedPackage = packages[selectedPackageId];
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");
  const [selectedCrypto, setSelectedCrypto] = useState("btc");
  const [copied, setCopied] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({});
  const [pricesLoading, setPricesLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: userData.email,
    phone: "",
    firstName: userData.name.split(" ")[0] || "",
    lastName: userData.name.split(" ").slice(1).join(" ") || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cryptoAddresses: Record<string, string> = {
    btc: process.env.NEXT_PUBLIC_BTC_ADDRESS || "1F5zkR25VXA9eRSqjWKH7rM7w15qmGgr5F",
    eth: process.env.NEXT_PUBLIC_ETH_ADDRESS || "0x146530c7e40cffd4c2d1579073d40227d1ad5759",
    usdt: process.env.NEXT_PUBLIC_USDT_ADDRESS || "TPDckwaqQ8oShd28htUpvmUFWTkk3Mgsfm",
    sol: process.env.NEXT_PUBLIC_SOL_ADDRESS || "2BG35UaSoyySmnthoQdSCo7LH1w4apfQ3cszCVVVocgp",
    ltc: process.env.NEXT_PUBLIC_LTC_ADDRESS || "LPsxTKzztyszVhqw6jPzaRWRZ9KHyfj7Nn",
  };

  const getTotalPrice = () => {
    return paymentMethod === "crypto" ? selectedPackage.cryptoPrice : selectedPackage.price;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const getCryptoAmount = (cryptoId: string) => {
    const price = cryptoPrices[cryptoId];
    if (!price) return null;
    const amount = selectedPackage.cryptoPrice / price;
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
    setErrors({});

    try {
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
        const errorMsg = data.message || data.error;
        setErrors({ submit: errorMsg });
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      setErrors({ submit: "No checkout URL returned" });
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
    setErrors({});

    try {
      router.push(
        `/checkout/crypto-pending?package=${selectedPackageId}&crypto=${selectedCrypto}&email=${encodeURIComponent(formData.email)}`
      );
    } catch (error) {
      console.error("Crypto payment error:", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsProcessing(false);
    }
  };

  const currentCrypto = cryptoOptions.find((c) => c.id === selectedCrypto) || cryptoOptions[0];

  const lossAmount = answers.total_losses?.amount || 0;
  const educationSpent = answers.education_spent?.amount || 0;
  const perceivedValue = answers.perceived_value?.amount || 0;
  const missedOpportunities = answers.missed_opportunities?.value;
  const urgency = answers.urgency_level?.urgency || "medium";
  const experienceLevel = answers.experience_level?.label || "Trader";
  const mainBlocker = answers.main_blocker?.label || "Trading challenges";
  const goalMotivation = answers.goal_motivation?.label || "Financial goals";

  const getUrgencyText = () => {
    switch (urgency) {
      case "hot": return "immediately";
      case "warm": return "this week";
      case "medium": return "this month";
      default: return "soon";
    }
  };

  const getMissedText = () => {
    if (missedOpportunities === "daily") return "daily";
    if (missedOpportunities === "weekly") return "weekly";
    return "occasionally";
  };

  const handleCTAClick = () => {
    setIsRedirecting(true);
    const params = new URLSearchParams({
      source: "quiz",
      score: leadScore.toString(),
      losses: lossAmount.toString(),
      spent: educationSpent.toString(),
      urgency: urgency,
      email: userData.email,
      name: userData.name,
    });
    setTimeout(() => {
      window.location.href = `/?${params.toString()}`;
    }, 500);
  };

  const scrollToCheckout = () => {
    checkoutRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectPackageAndScroll = (pkg: "starter" | "elite") => {
    setSelectedPackageId(pkg);
    setTimeout(() => scrollToCheckout(), 50);
  };

  const faqItems = [
    {
      question: "This sounds too good to be true.",
      answer:
        "Yeah, so did the internet in 1995. So did Bitcoin in 2010. So did Tesla stock in 2019. But let's be real: You're not skeptical because this seems fake. You're skeptical because you've been burned before. That's fair. That's why we have a 30-day money-back guarantee. Run it. Demo it. Test it. Try to prove it wrong. If it doesn't work, get your money back.",
    },
    {
      question: "I don't have enough money to start.",
      answer:
        "You have enough money to keep losing manually? You had $500 for that last course collecting dust? You had $1,200 for the account you just blew? The bot works with accounts as small as $500. Won't make you rich overnight, but it'll GROW. Start small. Compound. That's how everyone in the Discord started.",
    },
    {
      question: "What if it stops working?",
      answer:
        "Valid question. The market evolves. Conditions change. That's why APEX updates MONTHLY. We have a team of quants and developers constantly optimizing the algorithm. You get these updates FREE. Forever.",
    },
    {
      question: "I'm not tech-savvy.",
      answer:
        "Neither is Marcus (pharmacy tech), Sarah (dental assistant), or Tyler (pours concrete). If you can install an app on your phone, you can set up APEX. We have a 23-minute video that walks you through EVERYTHING.",
    },
    {
      question: "What if I lose money?",
      answer:
        "You're ALREADY losing money trading manually. That's why we include a 30-day money-back guarantee. Run it, test it, and if it isn't for you, request a refund.",
    },
    {
      question: "I need to learn to trade properly first.",
      answer:
        "No you don't. You don't need to be a mechanic to drive a car. You don't need to be a pilot to fly in a plane. You don't need to be a trader to profit from trading.",
    },
    {
      question: "What about the people who don't succeed?",
      answer:
        "Real talk: some people don't see results because they don't let the system run, they override it manually, or they use bad brokers. Follow the setup guide and let it run.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      <div className="py-3 md:py-12 lg:py-16 px-1 sm:px-4 relative overflow-x-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] sm:w-[1000px] sm:h-[600px] bg-[#1a1a1a]/50 rounded-full blur-[200px]" />
        </div>

        <div className="w-full max-w-none md:max-w-3xl mx-auto relative z-10 px-4 md:px-0">

           {/* Assesment heading */}
          <div className="text-center mb-6 md:mb-12">
            <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-5 bg-[#111] border border-[#2a2a2a] flex items-center justify-center">
              <Image src="/logo.png" alt="APEX Protocol" width={36} height={36} className="object-contain" />
            </div>
            <p className="text-[#666] text-xs uppercase tracking-widest mb-2">Assessment Complete</p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
              Your Results, {userData.name.split(' ')[0]}
            </h1>
            <p className="text-[#888] text-sm md:text-base max-w-lg mx-auto">
              We&apos;ve analyzed your responses and prepared a personalized assessment of your trading profile.
            </p>
          </div>

          {/* Profile Summary Card */}
          <div className="bg-[#111] border border-[#1a1a1a] p-3 md:p-8 mb-4 md:mb-6">
            <h2 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#0066FF]"></div>
              Your Trading Profile
            </h2>

            <div className="space-y-4">
              {/* Experience */}
              <div className="flex items-start justify-between py-3 border-b border-[#1a1a1a]">
                <span className="text-[#666] text-sm">Experience Level</span>
                <span className="text-white text-sm font-medium">{experienceLevel}</span>
              </div>

              {/* Main Challenge */}
              <div className="flex items-start justify-between py-3 border-b border-[#1a1a1a]">
                <span className="text-[#666] text-sm">Primary Challenge</span>
                <span className="text-white text-sm font-medium text-right max-w-[200px]">{mainBlocker}</span>
              </div>

              {/* Losses */}
              {lossAmount > 0 && (
                <div className="flex items-start justify-between py-3 border-b border-[#1a1a1a]">
                  <span className="text-[#666] text-sm">Estimated Losses (12 mo)</span>
                  <span className="text-white text-sm font-medium">${lossAmount.toLocaleString()}</span>
                </div>
              )}

              {/* Education Spent */}
              {educationSpent > 0 && (
                <div className="flex items-start justify-between py-3 border-b border-[#1a1a1a]">
                  <span className="text-[#666] text-sm">Spent on Education</span>
                  <span className="text-white text-sm font-medium">${educationSpent.toLocaleString()}</span>
                </div>
              )}

              {/* Missed Opportunities */}
              {(missedOpportunities === "daily" || missedOpportunities === "weekly") && (
                <div className="flex items-start justify-between py-3 border-b border-[#1a1a1a]">
                  <span className="text-[#666] text-sm">Missed Opportunities</span>
                  <span className="text-white text-sm font-medium capitalize">{getMissedText()}</span>
                </div>
              )}

              {/* Goal */}
              <div className="flex items-start justify-between py-3 border-b border-[#1a1a1a]">
                <span className="text-[#666] text-sm">Primary Goal</span>
                <span className="text-white text-sm font-medium">{goalMotivation}</span>
              </div>

              {/* Urgency */}
              <div className="flex items-start justify-between py-3">
                <span className="text-[#666] text-sm">Timeline</span>
                <span className="text-white text-sm font-medium capitalize">Wants to start {getUrgencyText()}</span>
              </div>
            </div>
          </div>

          {/* Key Insight */}
          <div className="bg-[#111] border border-[#1a1a1a] p-3 md:p-8 mb-4 md:mb-6">
            <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#0066FF]"></div>
              Key Insight
            </h2>
            <p className="text-[#888] text-sm leading-relaxed mb-4">
              Based on your responses, you indicated that an emotionless, 24/7 AI trading system would be worth{" "}
              <span className="text-white font-medium">${perceivedValue.toLocaleString()}</span> to you.
            </p>
            <p className="text-[#888] text-sm leading-relaxed">
              {lossAmount > 0 && educationSpent > 0 ? (
                <>
                  Combined with your estimated losses of <span className="text-white font-medium">${lossAmount.toLocaleString()}</span> and{" "}
                  <span className="text-white font-medium">${educationSpent.toLocaleString()}</span> spent on education,
                  you&apos;ve invested significantly in trying to solve your trading challenges.
                </>
              ) : lossAmount > 0 ? (
                <>
                  With estimated losses of <span className="text-white font-medium">${lossAmount.toLocaleString()}</span>,
                  you understand the real cost of emotional trading decisions.
                </>
              ) : (
                <>
                  You&apos;re looking for a solution that eliminates emotional decision-making from your trading.
                </>
              )}
            </p>
          </div>

          {/* Download Freebie (Quick Win) */}
          <div className="bg-[#111] border border-[#1a1a1a] p-3 md:p-8 mb-4 md:mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#0a0a0a] border border-[#1a1a1a] flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5 text-[#FFB800]" />
              </div>
              <div className="flex-1">
                <p className="text-[#666] text-xs uppercase tracking-widest mb-1">Download Freebie (Quick Win)</p>
                <h3 className="text-white font-semibold text-lg mb-2">Free Gold Trading Strategies Guide</h3>
                <p className="text-[#888] text-sm leading-relaxed mb-4">
                  As promised, here&apos;s your free PDF with our top 3 gold trading strategies.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <a
                    href="/TOP-3-GOLD-TRADING-STRATEGIES.pdf"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0066FF] hover:bg-[#0052CC] text-white text-sm font-bold transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Free PDF</span>
                  </a>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#0066FF]" />
                    <span className="text-[#888]">Sent to: <span className="text-white">{userData.email}</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bridge to Offer (Transition) */}
          <div className="bg-[#111] border border-[#1a1a1a] p-3 md:p-8 mb-4 md:mb-6">
            <p className="text-[#666] text-xs uppercase tracking-widest mb-2">Bridge to Offer (Transition)</p>
            <h2 className="text-white font-bold text-xl md:text-2xl mb-4">🎯 INTRODUCING: APEX PROTOCOL</h2>

            <p className="text-[#888] text-sm leading-relaxed mb-4">
              The AI system that fixes every problem you just told us about:
            </p>

            <div className="space-y-2 text-sm mb-5">
              <div className="flex items-start gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5" />
                <span><span className="font-semibold">Trades 24/7</span> (catches setups while you sleep)</span>
              </div>
              <div className="flex items-start gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5" />
                <span><span className="font-semibold">Zero emotions</span> (no revenge trading, no fear)</span>
              </div>
              <div className="flex items-start gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5" />
                <span><span className="font-semibold">Adapts in real-time</span> (won&apos;t blow up on news)</span>
              </div>
              <div className="flex items-start gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5" />
                <span><span className="font-semibold">Works while you live your life</span></span>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-3 md:p-4 mb-5">
              <p className="text-[#888] text-sm leading-relaxed">
                You&apos;ve already lost <span className="text-white font-semibold">${lossAmount.toLocaleString()}</span>.
                You&apos;ve already spent <span className="text-white font-semibold">${educationSpent.toLocaleString()}</span> on things that failed.
              </p>
              <p className="text-[#888] text-sm leading-relaxed mt-3">
                APEX costs less than one losing month.
              </p>
              <p className="text-[#888] text-sm leading-relaxed mt-3">
                And comes with a <span className="text-white font-semibold">30-day money-back guarantee</span>.
              </p>
            </div>

            <button
              onClick={scrollToCheckout}
              className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold py-4 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Show Me Secure Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

           {/* Checkout section  */}
          <div ref={checkoutRef} className="bg-[#111] border border-[#1a1a1a] p-3 md:p-8 mb-4 md:mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <p className="text-[#666] text-xs uppercase tracking-widest mb-2">Direct Checkout</p>
                <h2 className="text-white font-bold text-xl md:text-2xl">Secure Checkout</h2>
              </div>
              <div className="text-xs text-[#888] space-y-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#888]" />
                  <span>Secure Checkout • 30-Day Money-Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#888]" />
                  <span>SSL Encrypted • Instant Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#888]" />
                  <span>{LICENSES_SOLD}/{LICENSES_TOTAL} licenses sold</span>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-[#666] text-xs uppercase tracking-widest">Checkout</p>
                  <h4 className="text-white font-semibold md:text-lg text-[14px]">Get Instant Access</h4>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#666]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Secure Payment</span>
                </div>
              </div>

              {/* Package Selection */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setSelectedPackageId("starter")}
                  className={`w-full p-4 text-left transition-all border ${
                    selectedPackageId === "starter"
                      ? "bg-[#0b1b33] border-[#0066FF]"
                      : "bg-[#0a0a0a] border-[#1a1a1a] hover:border-[#2a2a2a]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPackageId === "starter" ? "border-[#0066FF] bg-[#0066FF]" : "border-[#444]"
                      }`}>
                        {selectedPackageId === "starter" && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{packages.starter.name}</p>
                        <p className="text-[#666] text-xs">Full bot access + community</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">${packages.starter.price}</p>
                      <p className="text-[#10B981] text-[11px]">${packages.starter.cryptoPrice} with crypto</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedPackageId("elite")}
                  className={`w-full p-4 text-left transition-all border relative ${
                    selectedPackageId === "elite"
                      ? "bg-[#2a1a00] border-[#FFB800]"
                      : "bg-[#0a0a0a] border-[#1a1a1a] hover:border-[#2a2a2a]"
                  }`}
                >
                  <div className="absolute -top-3 left-4 px-3 py-1 bg-[#FFB800] text-black text-[10px] font-bold uppercase tracking-wide">
                    Most Popular
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPackageId === "elite" ? "border-[#FFB800] bg-[#FFB800]" : "border-[#444]"
                      }`}>
                        {selectedPackageId === "elite" && <Check className="w-3.5 h-3.5 text-black" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-semibold">{packages.elite.name}</p>
                          <Star className="w-4 h-4 text-[#FFB800] fill-[#FFB800]" />
                        </div>
                        <p className="text-[#666] text-xs">1-on-1 onboarding + VIP support</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">${packages.elite.price}</p>
                      <p className="text-[#10B981] text-[11px]">${packages.elite.cryptoPrice} with crypto</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-[#888] mb-1.5 font-medium">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full bg-[#000] border ${errors.firstName ? "border-[#EF4444]" : "border-[#222]"} px-3 py-2.5 text-white text-sm placeholder:text-[#444] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/40 transition-all`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-[#EF4444] text-xs mt-1.5">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-xs text-[#888] mb-1.5 font-medium">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`w-full bg-[#000] border ${errors.lastName ? "border-[#EF4444]" : "border-[#222]"} px-3 py-2.5 text-white text-sm placeholder:text-[#444] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/40 transition-all`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-[#EF4444] text-xs mt-1.5">{errors.lastName}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <div>
                  <label className="block text-xs text-[#888] mb-1.5 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full bg-[#000] border ${errors.email ? "border-[#EF4444]" : "border-[#222]"} px-3 py-2.5 text-white text-sm placeholder:text-[#444] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/40 transition-all`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-[#EF4444] text-xs mt-1.5">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs text-[#888] mb-1.5 font-medium">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#000] border border-[#222] px-3 py-2.5 text-white text-sm placeholder:text-[#444] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/40 transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`px-4 py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 border ${
                    paymentMethod === "card" ? "bg-[#0066FF] border-[#0066FF] text-white" : "bg-[#000] border-[#222] text-[#888] hover:border-[#333]"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Card
                </button>
                <button
                  onClick={() => setPaymentMethod("crypto")}
                  className={`px-4 py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 border ${
                    paymentMethod === "crypto" ? "bg-[#0066FF] border-[#0066FF] text-white" : "bg-[#000] border-[#222] text-[#888] hover:border-[#333]"
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  Crypto
                </button>
              </div>

              {paymentMethod === "crypto" && (
                <div className="mb-6">
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {cryptoOptions.map((crypto) => (
                      <button
                        key={crypto.id}
                        onClick={() => setSelectedCrypto(crypto.id)}
                        className={`py-3 border transition-all ${
                          selectedCrypto === crypto.id ? "bg-[#111] border-white" : "bg-[#000] border-[#222] hover:border-[#333]"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-lg" style={{ color: crypto.color }}>
                            {crypto.icon}
                          </span>
                          <span className="text-[10px] text-[#888] font-semibold">{crypto.symbol}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="bg-[#000] border border-[#222] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-[#888] font-semibold">Send exactly:</span>
                      {pricesLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#333] border-t-white rounded-full animate-spin" />
                          <span className="text-xs text-[#888]">Loading...</span>
                        </div>
                      ) : getCryptoAmount(selectedCrypto) ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm" style={{ color: currentCrypto.color }}>
                            {getCryptoAmount(selectedCrypto)} {currentCrypto.symbol}
                          </span>
                          <button
                            onClick={() => copyAmountToClipboard(getCryptoAmount(selectedCrypto)!)}
                            className="p-2 hover:bg-[#111] transition-colors"
                          >
                            {copiedAmount ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4 text-[#888]" />}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[#888]">—</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#888] font-semibold">Wallet address</span>
                      <button
                        onClick={() => copyToClipboard(cryptoAddresses[selectedCrypto])}
                        className="text-xs text-[#0066FF] hover:opacity-80 transition-opacity flex items-center gap-1"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <code className="block text-[11px] text-[#777] bg-[#0a0a0a] border border-[#1a1a1a] p-3 break-all font-mono">
                      {cryptoAddresses[selectedCrypto]}
                    </code>
                  </div>
                </div>
              )}

              {errors.submit && (
                <div className="mb-5 bg-[#EF4444]/10 border border-[#EF4444]/30 p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#EF4444]">{errors.submit}</p>
                </div>
              )}

              <button
                onClick={paymentMethod === "card" ? handleCardPayment : handleCryptoPayment}
                disabled={isProcessing}
                className="w-full bg-white text-black font-bold py-3.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{paymentMethod === "card" ? `Pay $${getTotalPrice()}` : `Confirm Payment — $${getTotalPrice()}`}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/*Objection Crusher*/}
          <div className="bg-[#111] border border-[#1a1a1a] p-3 md:p-8 mb-4 md:mb-6">
            <p className="text-[#666] text-xs uppercase tracking-widest mb-2">Objection Crusher</p>
            <h2 className="text-white font-bold text-xl md:text-2xl mb-4">❓ “Is This Really For Me?”</h2>

            <p className="text-[#888] text-sm leading-relaxed mb-4">
              Based on your quiz answers, <span className="text-white font-semibold">yes</span>.
            </p>

            <div className="space-y-2 text-sm mb-5">
              <div className="flex items-start gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5" />
                <span>You&apos;ve lost money to emotional trading ✅</span>
              </div>
              <div className="flex items-start gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5" />
                <span>You miss trades because you&apos;re not available 24/7 ✅</span>
              </div>
              <div className="flex items-start gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5" />
                <span>You want to solve this {getUrgencyText()} ✅</span>
              </div>
              {answers.investment_capacity?.label && (
                <div className="flex items-start gap-2 text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5" />
                  <span>You can invest {answers.investment_capacity.label} ✅</span>
                </div>
              )}
            </div>

            <p className="text-[#888] text-sm leading-relaxed mb-6">
              APEX solves all of this. And costs less than you expected.
              <span className="text-white font-semibold"> Still unsure?</span> 30-day guarantee. Zero risk.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => selectPackageAndScroll("starter")}
                className="bg-[#0a0a0a] border border-[#1a1a1a] p-5 text-left hover:border-[#2a2a2a] transition-all"
              >
                <p className="text-white font-bold text-lg">Get Starter</p>
                <p className="text-[#888] text-sm mt-1">$499 / $399 (crypto)</p>
                <p className="text-[#666] text-xs mt-3">Second chance to buy → scrolls to secure checkout</p>
              </button>
              <button
                onClick={() => selectPackageAndScroll("elite")}
                className="bg-[#0a0a0a] border border-[#FFB800]/40 p-5 text-left hover:border-[#FFB800]/70 transition-all relative"
              >
                <div className="absolute -top-3 left-4 px-3 py-1 bg-[#FFB800] text-black text-[10px] font-bold uppercase tracking-wide">
                  Most Popular
                </div>
                <p className="text-white font-bold text-lg">Get Elite</p>
                <p className="text-[#888] text-sm mt-1">$999 / $799 (crypto)</p>
                <p className="text-[#666] text-xs mt-3">Second chance to buy → scrolls to secure checkout</p>
              </button>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="bg-[#111] border border-[#1a1a1a] p-3 md:p-8 mb-4 md:mb-6">
            <div className="text-center mb-6 w-full">
              <div className="text-white font-bold text-lg w-full h-[2px] border border-white"></div>
              <h2 className="text-white font-bold text-xl md:text-2xl my-3">🛡️ 30-DAY MONEY-BACK GUARANTEE</h2>
              <div className="text-white font-bold text-lg w-full h-[2px] border border-white"></div>
            </div>

            <p className="text-[#888] text-sm leading-relaxed mb-4">
              Run APEX for 30 days.
            </p>

            <div className="space-y-2 text-sm mb-5">
              <div className="flex items-start gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5" />
                <span>Consistent execution without emotions</span>
              </div>
              <div className="flex items-start gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5" />
                <span>Trades you would&apos;ve missed manually</span>
              </div>
              <div className="flex items-start gap-2 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5" />
                <span>A clear edge over your old approach</span>
              </div>
            </div>

            <p className="text-[#888] text-sm leading-relaxed">
              Request a full refund. Keep the training materials.
            </p>
            <p className="text-[#888] text-sm leading-relaxed mt-2">
              No questions. No hassle.
            </p>
            <p className="text-[#888] text-sm leading-relaxed mt-2">
              Why? Because we know it works.
            </p>
          </div>

          {/* FAQ */}
          <div className="bg-[#111] border border-[#1a1a1a] p-3 md:p-8 mb-4 md:mb-6">
            <div className="text-center mb-6">
              <p className="text-[#666] text-xs uppercase tracking-widest mb-2">FAQ</p>
              <h2 className="text-white font-bold text-xl md:text-2xl">Final Objections</h2>
              <p className="text-[#888] text-sm mt-2">Let me address every objection.</p>
            </div>

            <div className="border-t border-[#1a1a1a]">
              {faqItems.map((item, idx) => (
                <FAQItem key={idx} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-[#111] border border-[#1a1a1a] p-3 md:p-8 mb-4 md:mb-6">
            <p className="text-[#666] text-xs uppercase tracking-widest mb-2">Social Proof</p>
            <h2 className="text-white font-bold text-xl md:text-2xl mb-6">Real Results</h2>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3].map((index) => (
                <div key={index} className="bg-[#0a0a0a] border border-[#1a1a1a] p-3">
                  <video
                    controls
                    preload="none"
                    poster={`/testimonial-${index}-thumb.png`}
                    className="w-full"
                  >
                    <source src={`/testimonial-${index}.mp4`} type="video/mp4" />
                  </video>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {testimonials.map((t, idx) => (
                <div key={idx} className="bg-[#0a0a0a] border border-[#1a1a1a] p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Image src={t.avatar} alt={t.name} width={40} height={40} className="object-cover" />
                    <div>
                      <p className="text-white text-sm font-semibold">{t.name}</p>
                      <p className="text-[#666] text-xs">{t.handle}</p>
                    </div>
                  </div>
                  <p className="text-[#ccc] text-sm leading-relaxed">“{t.quote}”</p>
                </div>
              ))}
            </div>

            <div className="text-center mb-6">
              <h3 className="text-white font-bold text-lg">From Our Community</h3>
              <p className="text-[#888] text-sm">Real posts from real traders in our private Discord</p>
            </div>

            <div className="columns-1 md:columns-2 gap-4 space-y-4">
              {Array.from({ length: 14 }, (_, i) => i + 1).map((num) => (
                <div key={num} className="break-inside-avoid mb-4">
                  <div className="relative overflow-hidden border border-[#1a1a1a] bg-[#0a0a0a]">
                    <Image src={`/community/${num}.png`} alt={`Community testimonial ${num}`} width={900} height={900} className="w-full h-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Reminder */}
          <div className="bg-[#111] border border-[#1a1a1a] p-3 md:p-8 mb-4 md:mb-6">
            <div className="text-center mb-6">
              <h2 className="text-white font-bold text-xl md:text-2xl">⏰ FINAL REMINDER</h2>
            </div>
            <p className="text-[#888] text-sm leading-relaxed mb-3">We&apos;re capping licenses at 500 users.</p>
            <p className="text-white font-semibold mb-6">Current: {LICENSES_SOLD}/{LICENSES_TOTAL} SOLD</p>

            <p className="text-[#888] text-sm leading-relaxed mb-2">
              Once we hit 500, we close for 60–90 days minimum.
            </p>
            <p className="text-[#888] text-sm leading-relaxed mb-6">
              Last batch sold out in 11 hours. Don&apos;t be the person refreshing the page in 2 months hoping we reopened.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <button onClick={() => selectPackageAndScroll("starter")} className="w-full text-white font-bold py-4 transition-all bg-[#0066FF] border-[#0066FF]">
                GET STARTER ($499 / $399)
              </button>
              <button onClick={() => selectPackageAndScroll("elite")} className="w-full text-white font-bold py-4 transition-all bg-[#FFB800] border-[#FFB800]">
                GET ELITE ($999 / $799)
              </button>
            </div>

            <button onClick={handleCTAClick} disabled={isRedirecting} className="mt-6 text-[#888] text-sm hover:text-white transition-colors">
              View Full Sales Page →
            </button>
          </div>

          {/* Remaining Spots */}
          <div className="text-center">
            <p className="text-[#666] text-xs">
              Only <span className="text-[#888]">{LICENSES_REMAINING} spots</span> remaining · Limited availability
            </p>
          </div>

          {/* Footer */}
          <footer className="mt-10 md:mt-16 py-6 md:py-12 px-3 sm:px-6 pb-16 md:pb-32 bg-black border-t border-[#1a1a1a]">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img src="/logo.png" alt="APEX Protocol™" width={40} height={40} />
                  </div>
                  <span className="text-lg font-bold text-white font-[family-name:var(--font-heading)]">APEX Protocol™</span>
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-sm">
                  {[
                    { icon: Lock, text: "Encrypted Payment" },
                    { icon: Shield, text: "30-Day Guarantee" },
                    { icon: Headphones, text: "24/7 Support" },
                    { icon: Globe, text: "Works Worldwide" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[#666] font-[family-name:var(--font-body)]">
                      <item.icon className="w-4 h-4" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8 p-2 md:p-6 border border-[#1a1a1a] bg-[#0a0a0a] space-y-4 text-xs text-[#666] font-[family-name:var(--font-body)] leading-relaxed">
                <h4 className="text-[#888] font-semibold text-sm mb-3 font-[family-name:var(--font-heading)]">Important Risk Disclosure</h4>

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

              <div className="text-center text-xs text-[#444] font-[family-name:var(--font-body)] space-y-2">
                <p>© {new Date().getFullYear()} APEX Protocol™. All rights reserved.</p>
                <p className="text-[#333]">
                  This product is not affiliated with, endorsed by, or sponsored by any broker or financial institution.
                  <br />
                  Forex trading carries substantial risk and is not suitable for every investor.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-4 text-[#555]">
                  <Link href="/privacy" className="hover:text-[#888] transition-colors">Privacy Policy</Link>
                  <span>•</span>
                  <Link href="/terms" className="hover:text-[#888] transition-colors">Terms of Service</Link>
                  <span>•</span>
                  <Link href="/refund" className="hover:text-[#888] transition-colors">Refund Policy</Link>
                  <span>•</span>
                  <Link href="/support" className="hover:text-[#888] transition-colors">Contact</Link>
                </div>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}

// ============ MAIN PAGE COMPONENT ============

export default function QuizPage() {
  const [stage, setStage] = useState<"email" | "quiz" | "results">("email");
  const [userData, setUserData] = useState<UserData>({ name: "", email: "", whatsapp: "" });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [leadScore, setLeadScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateLeadScore = (answers: QuizAnswers) => {
    let score = 0;
    Object.values(answers).forEach((answer) => {
      score += answer.points;
    });
    return Math.min(100, Math.round((score / 400) * 100));
  };

  const handleEmailSubmit = async (data: UserData) => {
    setIsLoading(true);
    setUserData(data);

    try {
      // Only store locally - don't save to leads sheet yet
      // Lead will be saved when user selects a package on landing page
      await storageSet(
        `lead_${data.email}`,
        JSON.stringify({
          timestamp: new Date().toISOString(),
          name: data.name,
          email: data.email,
          whatsapp: data.whatsapp,
          status: "started_quiz",
        }),
        true
      );
    } catch (error) {
      console.error("Error saving lead locally:", error);
    }

    setIsLoading(false);
    setStage("quiz");
  };

  const handleAnswer = (questionKey: string, option: QuizOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: option,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    const finalScore = calculateLeadScore(answers);
    setLeadScore(finalScore);

    try {
      await storageSet(
        `quiz_responses_${userData.email}`,
        JSON.stringify({
          ...answers,
          completedAt: new Date().toISOString(),
        })
      );

      await storageSet(
        `lead_${userData.email}`,
        JSON.stringify({
          timestamp: new Date().toISOString(),
          name: userData.name,
          email: userData.email,
          whatsapp: userData.whatsapp,
          leadScore: finalScore,
          urgency: answers.urgency_level?.urgency,
          buyingPower: answers.investment_capacity?.buyingPower,
          responses: answers,
          status: "completed_quiz",
        }),
        true
      );

      try {
        const existingLeads = await storageGet("all_quiz_leads", true);
        const leads = existingLeads ? JSON.parse(existingLeads) : [];
        leads.push({
          email: userData.email,
          name: userData.name,
          score: finalScore,
          timestamp: new Date().toISOString(),
        });
        await storageSet("all_quiz_leads", JSON.stringify(leads), true);
      } catch (error) {
        console.error("Error updating leads list:", error);
      }

      // Save to quiz-specific Google Sheet
      await fetch("/api/save-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.whatsapp,
          leadScore: finalScore,
          urgency: answers.urgency_level?.urgency,
          buyingPower: answers.investment_capacity?.buyingPower,
          losses: answers.total_losses?.amount,
          educationSpent: answers.education_spent?.amount,
          experienceLevel: answers.experience_level?.label,
          mainBlocker: answers.main_blocker?.label,
          goalMotivation: answers.goal_motivation?.label,
          timestamp: new Date().toISOString(),
          source: "quiz_complete",
        }),
      }).catch(() => console.log("Quiz complete API save failed (non-blocking)"));

      // Send quiz completion email (non-blocking)
      await fetch("/api/send-quiz-completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userData.email,
          firstName: userData.name.split(" ")[0],
          leadScore: finalScore,
          losses: answers.total_losses?.amount,
          educationSpent: answers.education_spent?.amount,
          experienceLevel: answers.experience_level?.label,
          mainBlocker: answers.main_blocker?.label,
          goalMotivation: answers.goal_motivation?.label,
          urgency: answers.urgency_level?.urgency,
        }),
      }).catch(() => console.log("Quiz completion email failed (non-blocking)"));
    } catch (error) {
      console.error("Error saving quiz data:", error);
    }

    setIsSubmitting(false);
    setStage("results");
  };

  if (stage === "email") {
    return <EmailCaptureScreen onSubmit={handleEmailSubmit} isLoading={isLoading} />;
  }

  if (stage === "quiz") {
    return (
      <QuizInterface
        currentQuestion={currentQuestion}
        answers={answers}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onBack={handleBack}
        onComplete={handleComplete}
        isSubmitting={isSubmitting}
      />
    );
  }

  return <ResultsPage userData={userData} answers={answers} leadScore={leadScore} />;
}
