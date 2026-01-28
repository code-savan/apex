"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  CheckCircle2,
  ChevronDown,
  Download,
  TrendingUp,
  Clock,
  Zap,
  Shield,
  Gift,
  X,
} from "lucide-react";
import { LICENSES_REMAINING } from "../constants";

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
  const [isRedirecting, setIsRedirecting] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="py-8 md:py-12 lg:py-16 px-4 relative">
        {/* Subtle background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#1a1a1a]/50 rounded-full blur-[200px]" />
        </div>

        <div className="w-full max-w-3xl mx-auto relative z-10">

          {/* Header with Logo */}
          <div className="text-center mb-10 md:mb-12">
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
          <div className="bg-[#111] border border-[#1a1a1a] p-6 md:p-8 mb-6">
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
          <div className="bg-[#111] border border-[#1a1a1a] p-6 md:p-8 mb-6">
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

          {/* The Solution */}
          <div className="bg-[#111] border border-[#1a1a1a] p-6 md:p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#0a0a0a] border border-[#2a2a2a] flex items-center justify-center shrink-0">
                <Image src="/logo.png" alt="APEX" width={28} height={28} className="object-contain" />
              </div>
              <div>
                <p className="text-[#666] text-xs uppercase tracking-wider">Recommended Solution</p>
                <h3 className="text-white font-bold text-xl">APEX Protocol</h3>
              </div>
            </div>

            <p className="text-[#888] text-sm leading-relaxed mb-6">
              APEX Protocol is an AI-powered trading system designed specifically for traders like you.
              It operates 24/7, removes emotional decision-making, and adapts to market conditions in real-time.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4">
                <Clock className="w-5 h-5 text-[#666] mb-2" />
                <p className="text-white text-sm font-medium">24/7 Trading</p>
                <p className="text-[#666] text-xs mt-1">Never miss a setup</p>
              </div>
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4">
                <Shield className="w-5 h-5 text-[#666] mb-2" />
                <p className="text-white text-sm font-medium">Zero Emotions</p>
                <p className="text-[#666] text-xs mt-1">No fear, greed, or revenge</p>
              </div>
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4">
                <Zap className="w-5 h-5 text-[#666] mb-2" />
                <p className="text-white text-sm font-medium">Adaptive AI</p>
                <p className="text-[#666] text-xs mt-1">Real-time adjustments</p>
              </div>
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4">
                <TrendingUp className="w-5 h-5 text-[#666] mb-2" />
                <p className="text-white text-sm font-medium">Passive Income</p>
                <p className="text-[#666] text-xs mt-1">Works while you sleep</p>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-[#666]" />
                <span className="text-white text-sm font-medium">30-Day Money-Back Guarantee</span>
              </div>
              <p className="text-[#666] text-xs">
                Try APEX Protocol risk-free. If you&apos;re not satisfied, get a full refund within 30 days.
              </p>
            </div>

            {/* Main CTA */}
            <button
              onClick={handleCTAClick}
              disabled={isRedirecting}
              className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold py-4 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 group"
            >
              {isRedirecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>View APEX Protocol Pricing</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Free Resource */}
          <div className="bg-[#111] border border-[#1a1a1a] p-6 md:p-8 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#0a0a0a] border border-[#1a1a1a] flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5 text-[#666]" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Free Gold Trading Strategies Guide</h3>
                <p className="text-[#666] text-sm mb-3">
                  As a thank you for completing the assessment, we&apos;re sending you our top 3 gold trading strategies PDF.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#0066FF]" />
                    <span className="text-[#888]">Sending to: <span className="text-white">{userData.email}</span></span>
                  </div>
                  <a
                    href="/api/download-guide"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm font-medium hover:bg-[#222] transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Now</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Email Notice */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#111] border border-[#1a1a1a] flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-[#666]" />
              </div>
              <div>
                <p className="text-[#888] text-sm">
                  A copy of your assessment results has been sent to <span className="text-white">{userData.email}</span>.
                  You may also receive occasional updates about APEX Protocol. You can unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>

          {/* Availability Notice */}
          <div className="text-center">
            <p className="text-[#666] text-xs">
              Only <span className="text-[#888]">{LICENSES_REMAINING} spots</span> remaining · Limited availability
            </p>
          </div>

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

      // Send quiz completion email with PDF and video links
      await fetch("/api/send-quiz-completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userData.email,
          firstName: userData.name.split(' ')[0],
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
