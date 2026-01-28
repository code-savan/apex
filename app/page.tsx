"use client";

import { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  Brain,
  Zap,
  Shield,
  Clock,
  Target,
  Lock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Star,
  ArrowRight,
  Bot,
  Globe,
  X,
  Users,
  TrendingUp,
  Headphones,
  MessageCircle,
  Play,
  Pause,
  Award,
  BadgeCheck,
  CreditCard,
  Verified,
  RefreshCw,
  Rocket,
} from "lucide-react";
import { testimonials, LICENSES_TOTAL, LICENSES_SOLD, LICENSES_REMAINING, COUNTDOWN_DAYS } from "./constants";
import Image from "next/image";
import Link from "next/link";

// ============ COMPONENTS ============

// Video Testimonial Component with Custom Controls
function VideoTestimonial({ videoSrc, thumbnail, index }: { videoSrc: string; thumbnail: string; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  return (
    <div className="relative bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl group" style={{ aspectRatio: '9/16' }}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={thumbnail}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center transition-opacity cursor-pointer z-10"
        style={{ opacity: isPlaying ? 0 : 1 }}
      >
        <div className="w-16 h-16 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition-all hover:scale-110 group-hover:scale-110">
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white fill-white" />
          ) : (
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          )}
        </div>
      </button>

      {/* Hover overlay for playing state */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none transition-opacity ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}

// Pre-Checkout Email Collection Modal
function EmailCollectionModal({
  isOpen,
  onClose,
  onSubmit,
  selectedPackage,
  leadSource
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, email: string) => void;
  selectedPackage: string;
  leadSource: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to Google Sheet
      await fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          package: selectedPackage,
          timestamp: new Date().toISOString(),
          source: leadSource,
        }),
      }).catch(() => console.log("Lead save failed (non-blocking)"));

      // Store in localStorage for prefill
      localStorage.setItem("apex_lead_name", name);
      localStorage.setItem("apex_lead_email", email);

      onSubmit(name, email);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 animate-fade-in">
      <div className="relative max-w-md w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-8 animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#666] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="text-4xl mb-3 text-center">
          <Rocket className="w-10 h-10 text-white mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Almost There!</h3>
          <p className="text-[#888] text-sm">
            Enter your details to continue to checkout for <span className="text-[#3B82F6] font-semibold">{selectedPackage}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#888] mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-black border border-[#1a1a1a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm text-[#888] mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full bg-black border border-[#1a1a1a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg px-4 py-3 text-[#EF4444] text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Processing..." : "Continue to Checkout →"}
          </button>

          <p className="text-[#666] text-xs text-center">
            🔒 Your information is secure and will never be shared
          </p>
        </form>
      </div>
    </div>
  );
}

// Progress Bar Component
function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <div className="progress-bar" style={{ width: `${progress}%` }} />;
}

// Animated Counter Component
function AnimatedCounter({ target, duration = 2000, prefix = "", suffix = "" }: { target: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// License Counter Component
function LicenseCounter() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1 bg-[#1a1a1a] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#3B82F6] to-[#EF4444] transition-all duration-1000"
          style={{ width: `${(LICENSES_SOLD / LICENSES_TOTAL) * 100}%` }}
        />
      </div>
      <span className="text-sm font-medium font-[family-name:var(--font-body)]">
        <span className="text-[#EF4444]">{LICENSES_REMAINING}</span>
        <span className="text-[#666]">/{LICENSES_TOTAL}</span>
      </span>
    </div>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#1a1a1a] card-hover">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left hover:opacity-80 transition-opacity"
      >
        <span className="font-semibold text-white pr-4 font-[family-name:var(--font-heading)]">{question}</span>
        <ChevronDown className={`w-5 h-5 text-[#3B82F6] transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[500px] pb-6" : "max-h-0"}`}>
        <div className="text-[#888] leading-relaxed font-[family-name:var(--font-body)]">
          {answer}
        </div>
      </div>
    </div>
  );
}

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-[#3B82F6] text-[#3B82F6]" />
      ))}
      {hasHalfStar && (
        <div className="relative w-4 h-4">
          <Star className="w-4 h-4 text-[#3B82F6] absolute" />
          <div className="overflow-hidden w-1/2 absolute">
            <Star className="w-4 h-4 fill-[#3B82F6] text-[#3B82F6]" />
          </div>
        </div>
      )}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-[#333]" />
      ))}
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({
  name,
  handle,
  avatar,
  quote,
  startAmount,
  currentAmount,
  duration,
  stars = 5,
}: {
  name: string;
  handle: string;
  avatar: string;
  quote: string;
  startAmount: string;
  currentAmount: string;
  duration: string;
  stars?: number;
}) {
  const [imgError, setImgError] = useState(false);
  const initials = name.split(' ').map(n => n[0]).join('');

  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 card-hover">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6]/20 to-[#EF4444]/20 border border-[#1a1a1a] flex items-center justify-center text-white font-bold font-[family-name:var(--font-heading)] overflow-hidden">
          {!imgError ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            initials
          )}
        </div>
        <div>
          <div className="font-semibold text-white font-[family-name:var(--font-heading)]">{name}</div>
          <div className="text-sm text-[#3B82F6] font-[family-name:var(--font-body)]">{handle}</div>
        </div>
        <div className="ml-auto">
          <StarRating rating={stars} />
        </div>
      </div>
      <p className="text-[#aaa] mb-6 font-[family-name:var(--font-body)] leading-relaxed">&quot;{quote}&quot;</p>
      <div className="flex items-center justify-between pt-4 border-t border-[#1a1a1a]">
        <div>
          <div className="text-xs text-[#666] uppercase tracking-wide font-[family-name:var(--font-body)]">Started</div>
          <div className="text-[#EF4444] font-semibold font-[family-name:var(--font-heading)]">{startAmount}</div>
        </div>
        <ArrowRight className="w-5 h-5 text-[#333]" />
        <div>
          <div className="text-xs text-[#666] uppercase tracking-wide font-[family-name:var(--font-body)]">Now</div>
          <div className="text-[#3B82F6] font-semibold font-[family-name:var(--font-heading)]">{currentAmount}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[#666] uppercase tracking-wide font-[family-name:var(--font-body)]">Duration</div>
          <div className="text-white font-semibold font-[family-name:var(--font-heading)]">{duration}</div>
        </div>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, description, accentColor = "blue" }: { icon: React.ElementType; title: string; description: string; accentColor?: "blue" | "red" }) {
  const color = accentColor === "blue" ? "#3B82F6" : "#EF4444";
  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 card-hover">
      <div className={`w-12 h-12 bg-[#111] border border-[#1a1a1a] flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-heading)]">{title}</h3>
      <p className="text-[#888] leading-relaxed font-[family-name:var(--font-body)] text-sm">{description}</p>
    </div>
  );
}

// Pricing Card Component
function PricingCard({
  tier,
  price,
  cryptoPrice,
  cryptoSavings,
  features,
  bonuses,
  isPopular,
  ctaText,
  packageId,
  onCTAClick,
}: {
  tier: string;
  price: string;
  cryptoPrice: string;
  cryptoSavings: string;
  features: string[];
  bonuses?: { title: string; value: string }[];
  isPopular?: boolean;
  ctaText: string;
  packageId: "starter" | "elite";
  onCTAClick: (packageName: string, source: string) => void;
}) {
  return (
    <div className={`relative bg-[#0a0a0a] border ${isPopular ? "border-[#3B82F6]" : "border-[#1a1a1a]"}`}>
      {isPopular && (
        <div className="absolute -top-px left-0 right-0 h-1 bg-gradient-to-r from-[#3B82F6] to-[#EF4444]" />
      )}
      <div className="p-8">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-[#666] mb-2 font-[family-name:var(--font-body)]">
            {isPopular && <span className="text-[#3B82F6]">⭐ MOST POPULAR</span>}
          </div>
          <h3 className="text-xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
            {tier}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white font-[family-name:var(--font-heading)]">{price}</span>
            <span className="text-[#666] font-[family-name:var(--font-body)]">USD</span>
          </div>
          <div className="mt-3 flex items-center gap-2 p-2 border border-[#10B981]/30 bg-[#10B981]/5">
            <div className="text-xs font-[family-name:var(--font-body)]">
              <span className="text-[#888]">Crypto Price: </span>
              <span className="text-[#10B981] font-medium">{cryptoPrice}</span>
              <span className="text-[#888]"> </span>
              <span className="text-[#10B981] font-semibold">(save {cryptoSavings})</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-0.5" />
              <span className="text-[#aaa] text-sm font-[family-name:var(--font-body)]">{feature}</span>
            </div>
          ))}
        </div>

        {bonuses && bonuses.length > 0 && (
          <div className="border-t border-[#1a1a1a] pt-6 mb-6">
            <div className="text-xs uppercase tracking-widest text-[#EF4444] mb-3 font-[family-name:var(--font-body)]">
              Bonuses Included:
            </div>
            <div className="space-y-2">
              {bonuses.map((bonus, i) => (
                <div key={i} className="flex items-center justify-between text-sm font-[family-name:var(--font-body)]">
                  <span className="text-[#888]">{bonus.title}</span>
                  <span className="text-[#666] line-through">{bonus.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => onCTAClick(tier, `Pricing Section - ${tier}`)}
          className="block w-full py-4 font-semibold text-sm text-center transition-all btn-primary font-[family-name:var(--font-heading)] cursor-pointer"
        >
          {ctaText}
        </button>

        <div className="text-center mt-4 text-xs text-[#666] font-[family-name:var(--font-body)]">
          30-Day Money-Back Guarantee
        </div>
      </div>
    </div>
  );
}

// Social Proof Ticker
function SocialProofTicker() {
  const purchases = [
    "Marcus from Texas just joined",
    "Sarah got Elite Bundle",
    "Tyler started his account",
    "Anonymous purchased Starter",
    "Kim upgraded to Elite",
    "Jordan from UK joined",
    "New member from Germany",
    "Anonymous grabbed Starter",
  ];

  return (
    <div className="overflow-hidden bg-[#050505] border-y border-[#1a1a1a] py-3">
      <div className="flex animate-ticker whitespace-nowrap">
        {[...purchases, ...purchases].map((purchase, i) => (
          <div key={i} className="flex items-center gap-2 mx-8">
            <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full" />
            <span className="text-[#666] text-sm font-[family-name:var(--font-body)]">{purchase}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Countdown Timer Component (5 days)
function CountdownTimer({ compact = false }: { compact?: boolean }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    // Initialize with COUNTDOWN_DAYS
    return {
      days: COUNTDOWN_DAYS,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  });

  useEffect(() => {
    // Check for saved end time in localStorage
    const savedEndTime = localStorage.getItem('apex_countdown_end');
    let endTime: number;

    if (savedEndTime) {
      endTime = parseInt(savedEndTime);
      // If the saved time has passed, reset it
      if (endTime < Date.now()) {
        endTime = Date.now() + (COUNTDOWN_DAYS * 24 * 60 * 60 * 1000);
        localStorage.setItem('apex_countdown_end', endTime.toString());
      }
    } else {
      endTime = Date.now() + (COUNTDOWN_DAYS * 24 * 60 * 60 * 1000);
      localStorage.setItem('apex_countdown_end', endTime.toString());
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        // Reset the timer
        endTime = Date.now() + (COUNTDOWN_DAYS * 24 * 60 * 60 * 1000);
        localStorage.setItem('apex_countdown_end', endTime.toString());
        setTimeLeft({ days: COUNTDOWN_DAYS, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (compact) {
    return (
      <div className="flex items-center gap-1 text-xs font-mono">
        <div className="bg-[#111] border border-[#222] px-1.5 py-0.5">
          <span className="text-red-600 font-bold">{String(timeLeft.days).padStart(2, "0")}</span>
          <span className="text-white italic"> Days</span>
        </div>
        <span className="text-[#444]">:</span>
        <div className="bg-[#111] border border-[#222] px-1.5 py-0.5">
          <span className="text-red-600 font-bold">{String(timeLeft.hours).padStart(2, "0")}</span>
          <span className="text-white italic"> Hours</span>
        </div>
        <span className="text-[#444]">:</span>
        <div className="bg-[#111] border border-[#222] px-1.5 py-0.5">
          <span className="text-red-600 font-bold">{String(timeLeft.minutes).padStart(2, "0")}</span>
          <span className="text-white italic"> Minutes</span>
        </div>
        <span className="text-[#444]">:</span>
        <div className="bg-[#111] border border-[#222] px-1.5 py-0.5">
          <span className="text-red-600 font-bold">{String(timeLeft.seconds).padStart(2, "0")}</span>
          <span className="text-white italic"> Seconds</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-sm font-mono">
      <div className="bg-[#111] border border-[#222] px-2 py-1">
        <span className="text-white font-bold">{String(timeLeft.days).padStart(2, "0")}</span>
        <span className="text-[#666]">d</span>
      </div>
      <span className="text-[#444]">:</span>
      <div className="bg-[#111] border border-[#222] px-2 py-1">
        <span className="text-white font-bold">{String(timeLeft.hours).padStart(2, "0")}</span>
        <span className="text-[#666]">h</span>
      </div>
      <span className="text-[#444]">:</span>
      <div className="bg-[#111] border border-[#222] px-2 py-1">
        <span className="text-white font-bold">{String(timeLeft.minutes).padStart(2, "0")}</span>
        <span className="text-[#666]">m</span>
      </div>
      <span className="text-[#444]">:</span>
      <div className="bg-[#111] border border-[#222] px-2 py-1">
        <span className="text-white font-bold">{String(timeLeft.seconds).padStart(2, "0")}</span>
        <span className="text-[#666]">s</span>
      </div>
    </div>
  );
}

// Scroll to pricing helper
function scrollToPricing() {
  const pricingSection = document.getElementById('pricing-section');
  if (pricingSection) {
    pricingSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Sticky CTA Bar
function StickyCTABar({ isVisible }: { isVisible: boolean }) {
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${isVisible ? "translate-y-0" : "translate-y-full"}`}>
      <div className="bg-[#0a0a0a]/95 backdrop-blur-sm border-t border-[#1a1a1a] px-4 py-3">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-3">
          {/* Timer and Info Row */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* <div className="flex items-center gap-2 text-xs sm:text-sm"> */}
              {/* <div className="w-2 h-2 bg-[#EF4444] rounded-full animate-pulse" /> */}
              {/* <span className="text-[#888]">
              <span className="text-white font-semibold">
              {LICENSES_REMAINING}</span> spots</span> */}
            {/* </div> */}
            {/* <div className="h-4 w-px bg-[#333]" /> */}
            <div className="">
            <CountdownTimer compact />
            </div>
          </div>
          {/* CTA Button */}
          <button
            onClick={scrollToPricing}
            className="btn-primary px-10 py-2.5 font-semibold text-xs animate-pulse-twice"
          >
            Get Instant Access
          </button>
          <style jsx global>{`
            @keyframes pulse-twice {
              0% {
                transform: scale(1);
              }
              12.5% {
                transform: scale(1.09);
              }
              25% {
                transform: scale(1);
              }
              37.5% {
                transform: scale(1.09);
              }
              50% {
                transform: scale(1);
              }
              100% {
                transform: scale(1);
              }
            }
            .animate-pulse-twice {
              animation: pulse-twice 3s cubic-bezier(0.4,0,0.2,1) infinite;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN PAGE COMPONENT ============
export default function Home() {
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedPackageForModal, setSelectedPackageForModal] = useState("");
  const [leadSource, setLeadSource] = useState("");
  const timerRef = useRef<HTMLDivElement>(null);

  // Quiz data from URL params
  const [quizData, setQuizData] = useState<{
    source?: string;
    score?: string;
    losses?: string;
    spent?: string;
    urgency?: string;
    email?: string;
    name?: string;
  } | null>(null);

  // Read quiz params from URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const source = params.get("source");

      if (source === "quiz") {
        const data = {
          source,
          score: params.get("score") || undefined,
          losses: params.get("losses") || undefined,
          spent: params.get("spent") || undefined,
          urgency: params.get("urgency") || undefined,
          email: params.get("email") || undefined,
          name: params.get("name") || undefined,
        };
        setQuizData(data);

        // Store in localStorage for later use (but don't save to leads sheet yet)
        // Lead will be saved only when user selects a specific package
        if (data.name) localStorage.setItem("apex_lead_name", data.name);
        if (data.email) localStorage.setItem("apex_lead_email", data.email);
      }
    }
  }, []);

  // Function to handle general CTA button clicks (NOT from pricing section)
  // These should ALWAYS scroll to pricing
  const handleCTAClick = () => {
    scrollToPricing();
  };

  // Function to handle pricing section package selection
  const handlePackageSelect = (packageName: string, source: string = "Pricing Section") => {
    const packageId = packageName.toLowerCase().includes("elite") ? "elite" : "starter";

    // If we have quiz data (user came from quiz), save lead and go to checkout
    if (quizData?.name && quizData?.email) {
      // Save lead to Google Sheets with package selection
      fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: quizData.name,
          email: quizData.email,
          package: packageName,
          timestamp: new Date().toISOString(),
          source: `${source} (from quiz - Score: ${quizData.score || "N/A"})`,
        }),
      }).catch(() => console.log("Lead save failed (non-blocking)"));

      window.location.href = `/checkout?package=${packageId}&name=${encodeURIComponent(quizData.name)}&email=${encodeURIComponent(quizData.email)}`;
      return;
    }

    // For non-quiz users, show email modal to collect lead data
    setSelectedPackageForModal(packageName);
    setLeadSource(source);
    setShowEmailModal(true);
  };

  // Function to handle email modal submission
  const handleEmailSubmit = (name: string, email: string) => {
    setShowEmailModal(false);
    // Redirect to checkout with prefilled data
    const packageId = selectedPackageForModal.toLowerCase().includes("elite") ? "elite" : "starter";
    window.location.href = `/checkout?package=${packageId}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
  };

  // Handle scroll for sticky CTA - show after timer section
  useEffect(() => {
    const handleScroll = () => {
      if (timerRef.current) {
        const timerBottom = timerRef.current.getBoundingClientRect().bottom;
        setShowStickyCTA(timerBottom < 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && !showExitPopup) {
        setShowExitPopup(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [showExitPopup]);

  return (
    <>
      <ProgressBar />
      <StickyCTABar isVisible={showStickyCTA} />

      {/* Email Collection Modal */}
      <EmailCollectionModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        selectedPackage={selectedPackageForModal}
        leadSource={leadSource}
      />

      {/* WhatsApp Floating Button - UAE Market Loves This */}
      {/* <a
        href="https://wa.me/1234567890?text=Hi%2C%20I'm%20interested%20in%20APEX%20Protocol"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a> */}

      {/* Exit Intent Popup */}
      {showExitPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 animate-fade-in">
          <div className="relative max-w-lg w-full bg-[#0a0a0a] border border-[#1a1a1a] p-8 animate-fade-in-up">
            <button
              onClick={() => setShowExitPopup(false)}
              className="absolute top-4 right-4 text-[#666] hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">Wait—Don&apos;t Leave Yet</h3>
              <p className="text-[#888] mb-6 font-[family-name:var(--font-body)]">
                You&apos;re about to miss the opportunity that could change everything.
                Only <span className="text-[#EF4444] font-semibold">{LICENSES_REMAINING} spots</span> remaining.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => { setShowExitPopup(false); handleCTAClick(); }}
                  className="w-full btn-primary py-4 font-semibold font-[family-name:var(--font-heading)]"
                >
                  Get Instant Access
                </button>
                <button
                  onClick={() => setShowExitPopup(false)}
                  className="w-full text-[#666] hover:text-[#888] text-sm font-[family-name:var(--font-body)]"
                >
                  No thanks, I&apos;ll keep trading manually
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-black overflow-hidden">
        {/* ============ HERO SECTION ============ */}
        <section className="relative min-h-screen flex flex-col justify-center gradient-hero">
          {/* Animated gradient orbs - subtle */}
          <div className="orb-blue opacity-20" style={{ top: "-10%", left: "-10%" }} />
          <div className="orb-red opacity-15" style={{ bottom: "10%", right: "-5%" }} />
          <div className="orb-purple opacity-10" style={{ top: "40%", right: "20%" }} />

          {/* Header */}
          <header className="absolute top-0 left-0 right-0 z-20">
            <div className="md:max-w-6xl max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src="/logo.png" alt="APEX Protocol™" width={30} height={30} />
                </div>
                <span className="text-xl font-bold text-white font-[family-name:var(--font-heading)] opacity-80">APEX Protocol™</span>
              </div>
              <div className="flex items-center gap-4 md:gap-6">
                <a
                  href="/portal"
                  className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span className="hidden sm:inline">Client Portal</span>
                </a>
              </div>
            </div>
          </header>

          {/* Hero Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20 text-center">
            {/* Warning Badge */}
            <div className="inline-flex items-center gap-2 border border-[#EF4444]/30 bg-[#EF4444]/5 px-4 py-2 mb-8">
              <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
              <span className="text-[#EF4444] text-sm uppercase tracking-widest font-[family-name:var(--font-body)]">
                Stop. Read Every Word.
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-[1.1] font-[family-name:var(--font-heading)]">
              You&apos;re Being <span className="text-[#3B82F6] font-black">Lied To.</span>
              <br />
              <span className="text-[#888] font-bold">And You Know It.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-[#aaa] max-w-2xl mx-auto mb-10 leading-relaxed font-[family-name:var(--font-body)] font-medium">
              Every guru. Every course. Every &quot;follow my signals&quot; Telegram channel.
              They&apos;re selling you the <span className="text-[#EF4444] font-bold">same broken dream.</span>
            </p>

            {/* CTA Button */}
            <button
              onClick={handleCTAClick}
              className="btn-primary px-10 py-4 font-semibold text-base mb-8 font-[family-name:var(--font-heading)]"
            >
              Get Instant Access
            </button>

            {/* Trust Badges Row - ABOVE the fold */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-xs">
              <div className="flex items-center gap-2 px-3 py-2 bg-[#0a0a0a]/50 border border-[#1a1a1a] rounded">
                <Shield className="w-4 h-4 text-[#10B981]" />
                <span className="text-[#aaa]">30-Day Money-Back</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#0a0a0a]/50 border border-[#1a1a1a] rounded">
                <Lock className="w-4 h-4 text-[#10B981]" />
                <span className="text-[#aaa]">Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#0a0a0a]/50 border border-[#1a1a1a] rounded">
                <BadgeCheck className="w-4 h-4 text-[#10B981]" />
                <span className="text-[#aaa]">Verified Results</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm font-[family-name:var(--font-body)]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-[#aaa]"><span className="text-white font-bold">400+</span> Profitable Traders</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-[#aaa]"><span className="text-white font-bold">14</span> Currency Pairs</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-[#aaa]"><span className="text-white font-bold">24/7</span> Automated</span>
              </div>
            </div>

            {/* Scarcity Counter - Prominent */}
            {/* <div className="mt-10 inline-flex flex-col items-center gap-2 px-6 py-4 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg">
              <span className="text-[#EF4444] text-sm uppercase tracking-widest font-semibold">Limited Availability</span>
              <div className="flex items-center gap-2">
                <span className="text-white text-3xl font-bold">{LICENSES_SOLD}</span>
                <span className="text-[#666] text-xl">/</span>
                <span className="text-[#888] text-3xl font-bold">{LICENSES_TOTAL}</span>
              </div>
              <span className="text-[#888] text-sm">licenses sold - Only <span className="text-[#EF4444] font-bold">{LICENSES_REMAINING} spots</span> remain</span>
            </div> */}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <ChevronDown className="w-6 h-6 text-[#444] animate-bounce" />
          </div>
        </section>

        {/* ============ TIMER URGENCY SECTION ============ */}
        <section id="timer-section" ref={timerRef} className="py-10 px-6 bg-[#0a0a0a] border-y border-[#1a1a1a]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-5">
              {/* Urgent Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-full">
                <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                <span className="text-[#EF4444] text-sm font-semibold uppercase tracking-wider">Limited Time Offer</span>
              </div>

              {/* Main Heading */}
              <h3 className="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-heading)]">
                Special Pricing Ends Soon
              </h3>

              {/* Timer - Large and Centered */}
              <div className="flex flex-col items-center gap-3 py-4">
                <span className="text-xs text-[#666] uppercase tracking-widest font-semibold">Offer Expires In</span>
                <div className="scale-110 md:scale-125">
                  <CountdownTimer />
                </div>
              </div>

              {/* Spots Remaining */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#222] rounded-lg">
                <div className="w-2 h-2 bg-[#EF4444] rounded-full animate-pulse" />
                <span className="text-[#888] text-sm">Only <span className="text-white font-bold">{LICENSES_REMAINING}</span> spots remaining</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============ VIDEO TESTIMONIAL SECTION ============ */}
        <section className="py-16 px-6 bg-[#050505]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-full mb-4">
                <Play className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-[#3B82F6] text-sm font-semibold uppercase tracking-wide">Real User Reviews</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
                Real Results From <span className="text-[#3B82F6]">Real Traders</span>
              </h2>
              <p className="text-[#888] max-w-2xl mx-auto">
                No scripts. No actors. No fake screenshots. Just honest feedback from traders using APEX every day.
              </p>
            </div>

            {/* Three Video Testimonials */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[2, 1, 3].map((index) => (
                <VideoTestimonial
                  key={index}
                  videoSrc={`/testimonial-${index}.mp4`}
                  thumbnail={`/testimonial-${index}-thumb.png`}
                  index={index}
                />
              ))}
            </div>

            {/* Trust Stats Under Videos */}
            <div className="grid grid-cols-3 gap-4 mt-12 text-center max-w-3xl mx-auto">
              <div className="py-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
                <div className="text-2xl font-bold text-white mb-1">94.2%</div>
                <div className="text-xs text-[#888] uppercase tracking-wide">Win Rate</div>
              </div>
              <div className="py-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-xs text-[#888] uppercase tracking-wide">Auto Trading</div>
              </div>
              <div className="py-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
                <div className="text-2xl font-bold text-white mb-1">400+</div>
                <div className="text-xs text-[#888] uppercase tracking-wide">Active Users</div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Ticker - EARLY in the page */}
        <SocialProofTicker />

        {/* ============ EARLY TESTIMONIALS (Top 3) ============ */}
        <section className="py-16 px-6 bg-black">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#10B981]/10 border border-[#10B981]/30 rounded-full mb-4">
                <Users className="w-4 h-4 text-[#10B981]" />
                <span className="text-[#10B981] text-sm font-semibold uppercase tracking-wide">Real Results</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 font-[family-name:var(--font-heading)]">
                What <span className="text-[#3B82F6]">Real Traders</span> Are Saying
              </h2>
              <p className="text-[#888]">Not paid actors. Not fake screenshots. Real people.</p>
            </div>

            {/* Top 3 Testimonials Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((testimonial, i) => (
                <TestimonialCard key={i} {...testimonial} />
              ))}
            </div>

            {/* Trust Badge Under Testimonials */}
            <div className="mt-10 flex flex-wrap justify-center gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-white mb-1">400+</div>
                <div className="text-xs text-[#888] uppercase">Active Traders</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-white mb-1">$2.4M+</div>
                <div className="text-xs text-[#888] uppercase">Profits Generated</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
                <div className="text-xs text-[#888] uppercase">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PROBLEM AGITATION SECTION ============ */}
        <section className="py-20 px-6 bg-[#050505] gradient-section">
          <div className="relative max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
                Let Me Guess <span className="text-[#3B82F6]">Your Story...</span>
              </h2>
            </div>

            {/* Pain Points */}
            <div className="space-y-4 mb-20">
              {[
                'You\'ve watched 47 YouTube videos on "support and resistance"',
                "You've bought 3 courses (that you didn't finish)",
                "You've blown 2-4 accounts",
                "You're down $3K-$12K overall",
                "Your girlfriend/boyfriend/spouse is giving you that look",
                "You lie awake at 2 AM wondering if you're just... not smart enough",
              ].map((pain, i) => (
                <div key={i} className="flex items-start gap-4 py-4 border-b border-[#1a1a1a]">
                  <span className="text-xl">😶</span>
                  <span className="text-[#aaa] font-[family-name:var(--font-body)]">{pain}</span>
                </div>
              ))}
            </div>

            {/* CTA Button #2 - After Pain Points */}
            <div className="text-center mt-12">
              <button
                onClick={handleCTAClick}
                className="btn-primary px-10 py-4 font-semibold text-base mb-4 font-[family-name:var(--font-heading)]"
              >
                Show Me The Solution
              </button>
              <p className="text-[#666] text-sm">30-day money-back guarantee • No risk</p>
            </div>
          </div>
        </section>

        {/* ============ MY STORY SECTION ============ */}
        <section className="py-20 px-6 bg-black">
          <div className="relative max-w-2xl mx-auto">
            {/* The Date */}
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
                LET ME TELL YOU ABOUT <span className="text-[#EF4444]">DECEMBER 19TH, 2019.</span>
              </h2>
              <p className="text-xl text-[#888] font-[family-name:var(--font-body)]">
                The day I almost ended it all.
              </p>
            </div>

            {/* Story Content */}
            <div className="space-y-6 text-[#aaa] font-[family-name:var(--font-body)] leading-relaxed">
              <p>
                Not my trading career. <span className="text-white font-semibold">My life.</span>
              </p>
              <p>
                I was sitting in my 2004 Honda Civic in a Walmart parking lot at 11 PM, engine running, because I couldn&apos;t afford to heat my apartment. My phone was blowing up with texts I couldn&apos;t answer.
              </p>

              {/* Account Balance */}
              <div className="border border-[#EF4444]/30 bg-[#EF4444]/5 p-6 my-8 text-center">
                <p className="text-[#888] mb-2 font-[family-name:var(--font-body)]">My account balance that night?</p>
                <p className="text-4xl font-bold text-[#EF4444] font-[family-name:var(--font-heading)]">$47</p>
                <p className="text-[#666] mt-2 text-sm">Started the year with $23,000. My entire savings.</p>
              </div>

              <p>
                Every dollar from my college fund gone. But that wasn&apos;t the worst part.
              </p>

              {/* The Pregnancy Test */}
              <div className="border-t border-b border-[#1a1a1a] py-8 my-8">
                <p className="mb-4">
                  Two weeks earlier, my fiancée showed me a positive pregnancy test. I should&apos;ve been happy.
                </p>
                <p>
                  Instead, I felt nothing but <span className="text-[#EF4444]">shame</span>—because I&apos;d just lost our <span className="text-white font-semibold">$4,200</span> baby fund that morning on a revenge trade.
                </p>
              </div>

              <p className="text-white font-semibold">
                I lied to the woman I loved while she cried happy tears into my shoulder.
              </p>
            </div>
          </div>
        </section>

        {/* ============ WALMART PARKING LOT SECTION ============ */}
        <section className="py-20 px-6 bg-[#050505] gradient-section-alt">
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 font-[family-name:var(--font-heading)] text-center">
              THAT NIGHT IN THE <span className="text-[#3B82F6]">WALMART PARKING LOT...</span>
            </h2>

            <div className="space-y-6 text-[#aaa] font-[family-name:var(--font-body)] leading-relaxed">
              <p>
                I pulled up my trading journal: 387 trades over 11 months. <span className="text-[#EF4444]">43% win rate</span>. Average winners $340, average losers $890.
              </p>

              <p>
                I wasn&apos;t just bad at trading. <span className="text-white font-semibold">I was systematically destroying my life.</span>
              </p>

              <div className="space-y-2 my-8">
                <p className="text-[#888]">Every rule I set, I broke.</p>
                <p className="text-[#888]">Every stop loss I placed, I moved.</p>
              </div>

              <p className="text-white font-semibold">
                I wasn&apos;t a trader. I was a gambling addict who&apos;d convinced himself he was &quot;building a skill.&quot;
              </p>
              <p>
                I sat there for 3 hours, thinking about disappearing. Then my phone buzzed.
              </p>

              {/* Sarah's Text */}
              <div className="border border-[#3B82F6]/30 bg-[#3B82F6]/5 p-6 my-8 text-center">
                <p className="text-[#666] text-sm mb-2">Text from Sarah:</p>
                <p className="text-white text-lg italic">&quot;Are you okay? You&apos;ve been quiet. I love you.&quot;</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ THE TURNING POINT ============ */}
        <section className="py-20 px-6 bg-black gradient-section">
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 font-[family-name:var(--font-heading)] text-center">
              THAT TEXT <span className="text-[#3B82F6]">SAVED MY LIFE.</span>
            </h2>

            <div className="space-y-6 text-[#aaa] font-[family-name:var(--font-body)] leading-relaxed">
              <p>
                She still loved me. Even after everything. <span className="text-white font-semibold text-lg">I decided right there: One more shot. But different.</span>
              </p>

              <p className="text-xl text-white font-semibold text-center py-8 border-t border-b border-[#1a1a1a]">
                I needed to remove <span className="text-[#EF4444]">MYSELF</span> from the equation.
              </p>

              <p>
                I spent three weeks researching instead of trading. Found an MIT paper showing <span className="text-white font-semibold">human traders underperform their own rule-based systems by 34% on average</span>—not because the systems were smarter, but because humans can&apos;t follow their own rules.
              </p>
              <p className="text-white font-medium">
                Our emotions override logic <span className="text-[#EF4444]">every single time</span> when money is involved.
              </p>
              <p>
                Renaissance Technologies manages $130 BILLION entirely with algorithms. <span className="text-white font-semibold">The most profitable hedge fund in history—because they removed human emotion from trading.</span>
              </p>
            </div>
          </div>
        </section>

        {/* ============ BUILDING APEX ============ */}
        <section className="py-20 px-6 bg-[#050505] gradient-section-alt">
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 font-[family-name:var(--font-heading)] text-center">
              I SPENT <span className="text-[#EF4444]">$7,000</span> I DIDN&apos;T HAVE.
            </h2>

            <div className="space-y-6 text-[#aaa] font-[family-name:var(--font-body)] leading-relaxed">
              <p>
                Borrowed more money. Hired developers from Eastern Europe and worked with a quant analyst from Singapore I found on Reddit.
              </p>
              <p>
                I told them: <span className="text-[#888] italic">&quot;I need a system that trades like the rules say. No emotions. No overrides. Just execution.&quot;</span>
              </p>
              <p>
                They thought I was crazy.
              </p>
              <p className="text-[#888] italic">
                &quot;Why not just follow your own rules?&quot;
              </p>
              <p className="text-white font-semibold">
                &quot;Because I CAN&apos;T. Nobody can. That&apos;s the problem.&quot;
              </p>
              <p>
                We built the first version of what would become APEX.
              </p>
              <p>
                It was clunky. Buggy. Crashed twice a day.
              </p>
              <p className="text-white font-semibold text-lg">
                But it <span className="text-[#3B82F6]">worked.</span>
              </p>

              {/* Demo Test Results */}
              <h3 className="text-xl font-bold text-white mt-12 mb-6 font-[family-name:var(--font-heading)]">
                JANUARY 2020. 60-DAY DEMO TEST.
              </h3>

              <div className="grid grid-cols-2 gap-4 my-8">
                <div className="bg-[#0a0a0a] border border-[#3B82F6]/30 p-6 text-center">
                  <p className="text-xs uppercase tracking-widest text-[#666] mb-2">APEX Bot</p>
                  <p className="text-3xl font-bold text-[#3B82F6] font-[family-name:var(--font-heading)]">$14,890</p>
                  <p className="text-[#3B82F6] text-sm mt-1">+48.9% return</p>
                </div>
                <div className="bg-[#0a0a0a] border border-[#EF4444]/30 p-6 text-center">
                  <p className="text-xs uppercase tracking-widest text-[#666] mb-2">Manual (Same Rules)</p>
                  <p className="text-3xl font-bold text-[#EF4444] font-[family-name:var(--font-heading)]">$9,240</p>
                  <p className="text-[#EF4444] text-sm mt-1">-7.6% return</p>
                </div>
              </div>

              <p className="text-white font-semibold text-center">
                SAME. EXACT. RULES. The bot just... traded without fear.
              </p>
            </div>
          </div>
        </section>

        {/* ============ THE SCALPER DISCOVERY ============ */}
        <section className="py-20 px-6 bg-black gradient-section">
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 font-[family-name:var(--font-heading)] text-center">
              THEN I DISCOVERED <span className="text-[#F59E0B]">SOMETHING ELSE.</span>
            </h2>

            <div className="space-y-6 text-[#aaa] font-[family-name:var(--font-body)] leading-relaxed">
              <p>
                APEX was crushing it on swing trades. But I kept noticing something...
              </p>
              <p className="text-white font-semibold">
                Between the big moves, there were <span className="text-[#F59E0B]">hundreds of smaller opportunities</span> happening every single day.
              </p>
              <p>
                5-20 pip moves. Lasting seconds to minutes. Too fast for humans. Too small for the main bot&apos;s strategy.
              </p>
              <p>
                So I built something new: <span className="text-[#F59E0B] font-bold">APEX Scalper.</span>
              </p>

              <div className="border border-[#F59E0B]/30 bg-[#F59E0B]/5 p-6 my-8">
                <p className="text-white font-semibold mb-4">Here&apos;s how they work together:</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0a0a0a] p-4 border border-[#3B82F6]/30">
                    <p className="text-xs font-bold text-[#3B82F6] mb-2">APEX BOT:</p>
                    <p className="text-sm text-[#888]">Swing trades. Bigger moves. Fewer trades. Patient.</p>
                  </div>
                  <div className="bg-[#0a0a0a] p-4 border border-[#F59E0B]/30">
                    <p className="text-xs font-bold text-[#F59E0B] mb-2">APEX SCALPER:</p>
                    <p className="text-sm text-[#888]">Speed trades. Smaller moves. Constant action. Lightning-fast.</p>
                  </div>
                </div>
              </div>

              <p>
                They run <span className="text-white font-semibold">simultaneously</span>. Zero conflict. Different timeframes. Different strategies.
              </p>
              <p className="text-white font-semibold">
                Together = Maximum market coverage. All opportunities. 24/7.
              </p>

              <div className="bg-gradient-to-r from-[#10B981]/20 to-[#10B981]/5 p-6 my-8 border border-[#10B981]/30">
                <p className="text-center text-lg text-white font-semibold mb-2">
                  Users running BOTH average
                </p>
                <p className="text-center text-4xl font-bold text-[#10B981] font-[family-name:var(--font-heading)]">
                  34% Higher Monthly Returns
                </p>
              </div>

              <p className="text-center text-[#888]">
                But there&apos;s a catch. The Scalper needs serious processing power. That&apos;s why we limit scalping capacity based on your plan.
              </p>
            </div>
          </div>
        </section>

        {/* ============ GOING LIVE ============ */}
        <section className="py-20 px-6 bg-black gradient-section">
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 font-[family-name:var(--font-heading)] text-center">
              MARCH 2020. I WENT LIVE WITH <span className="text-[#3B82F6]">$800.</span>
            </h2>

            <div className="space-y-6 text-[#aaa] font-[family-name:var(--font-body)] leading-relaxed">
              <p>
                Started with $800—all I had left after paying back debt. Turned on the bot and <span className="text-white font-semibold">didn&apos;t look for 3 days.</span>
              </p>

              <div className="border border-[#3B82F6]/30 bg-[#3B82F6]/5 p-8 my-8 text-center">
                <p className="text-5xl font-bold text-[#3B82F6] font-[family-name:var(--font-heading)]">$1,340</p>
              </div>

              <p className="text-white font-semibold">
                I called my broker thinking it was a glitch. It wasn&apos;t. I sat on the floor and cried.
              </p>

              {/* Eight Months Later */}
              <h3 className="text-xl font-bold text-white mt-12 mb-6 font-[family-name:var(--font-heading)]">
                EIGHT MONTHS LATER...
              </h3>

              <div className="border border-[#3B82F6]/30 bg-black p-8 my-8 text-center">
                <p className="text-[#666] mb-2">That $800 became</p>
                <p className="text-5xl font-bold text-[#3B82F6] font-[family-name:var(--font-heading)]">$47,000</p>
              </div>

              <p>
                Not because I learned to &quot;control my emotions.&quot;
              </p>
              <p>
                Not because I &quot;mastered price action.&quot;
              </p>
              <p>
                Not because I became some guru.
              </p>
              <p className="text-xl text-white font-semibold">
                Because I removed myself from the process.
              </p>
            </div>
          </div>
        </section>

        {/* ============ SARAH'S BIRTHDAY ============ */}
        <section className="py-20 px-6 bg-[#050505] gradient-section-alt">
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 font-[family-name:var(--font-heading)] text-center">
              DECEMBER 2020. <span className="text-[#3B82F6]">SARAH&apos;S BIRTHDAY.</span>
            </h2>

            <div className="space-y-6 text-[#aaa] font-[family-name:var(--font-body)] leading-relaxed">
              <p>
                I took her to the same restaurant where I proposed.
              </p>
              <p>
                After dinner, I slid an envelope across the table.
              </p>
              <p>
                <span className="text-[#888] italic">&quot;What&apos;s this?&quot;</span>
              </p>
              <p>
                <span className="text-[#888] italic">&quot;Open it.&quot;</span>
              </p>

              <div className="border border-[#3B82F6]/30 bg-[#3B82F6]/5 p-8 my-8 text-center">
                <p className="text-[#666] mb-2">Inside: A check for</p>
                <p className="text-5xl font-bold text-[#3B82F6] font-[family-name:var(--font-heading)]">$30,000</p>
                <p className="text-[#666] mt-2">made out to her</p>
              </div>

              <p>
                <span className="text-[#888] italic">&quot;What... what is this?&quot;</span>
              </p>
              <p>
                <span className="text-[#888] italic">&quot;The baby fund. Plus 6 months of expenses. Plus the hospital bills. Plus... us never having to worry again.&quot;</span>
              </p>
              <p>
                She just stared at me.
              </p>
              <p>
                <span className="text-[#888] italic">&quot;How did you...&quot;</span>
              </p>
              <p>
                <span className="text-[#888] italic">&quot;I built something. Something that trades without emotions. Without fear. Without me fucking it up.&quot;</span>
              </p>
              <p className="text-white font-semibold">
                She cried. But this time, they were different tears.
              </p>

              {/* Son's Birth */}
              <h3 className="text-xl font-bold text-white mt-12 mb-6 font-[family-name:var(--font-heading)]">
                MY SON WAS BORN MARCH 2021.
              </h3>

              <p>
                I was there. Fully present. Not checking charts on my phone.
              </p>
              <p>
                Not stressed about a position I left open.
              </p>
              <p>
                Not worried about margin calls.
              </p>
              <p>
                Not distracted by &quot;that perfect setup forming.&quot;
              </p>
              <p className="text-white font-semibold">
                Because the bot was running at home. Working while I was becoming a father.
              </p>
              <p className="text-lg text-white mt-8">
                That&apos;s when I realized: This wasn&apos;t just about money.
              </p>
              <p className="text-xl text-[#3B82F6] font-semibold">
                This was about getting my LIFE back.
              </p>
            </div>
          </div>
        </section>

        {/* ============ SHARING THE BOT ============ */}
        <section className="py-20 px-6 bg-black gradient-section">
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 font-[family-name:var(--font-heading)] text-center">
              I SHARED THE BOT WITH <span className="text-[#3B82F6]">3 FRIENDS.</span>
            </h2>

            <div className="space-y-6 text-[#aaa] font-[family-name:var(--font-body)] leading-relaxed">
              <p>
                Marcus (pharmacy tech). Chen (college student). Jordan (barber).
              </p>
              <p>
                I didn&apos;t charge them. Just said <span className="text-[#888] italic">&quot;Try it. See if it works for you.&quot;</span>
              </p>
              <p className="text-white font-semibold">
                6 months later:
              </p>

              <div className="space-y-4 my-8">
                <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
                  <span className="text-white font-medium">Marcus</span>
                  <span><span className="text-[#EF4444]">$3,500</span> → <span className="text-[#3B82F6] font-semibold">$19,200</span></span>
                </div>
                <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
                  <span className="text-white font-medium">Chen</span>
                  <span><span className="text-[#EF4444]">$900</span> → <span className="text-[#3B82F6] font-semibold">$6,800</span></span>
                </div>
                <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-3">
                  <span className="text-white font-medium">Jordan</span>
                  <span><span className="text-[#EF4444]">$1,200</span> → <span className="text-[#3B82F6] font-semibold">$11,400</span></span>
                </div>
              </div>

              <p>
                They told their friends. Those friends told their friends. Suddenly I had 40 people asking for access.
              </p>
              <p className="text-white font-semibold">
                That&apos;s when I realized: I&apos;m not the only one who needed this.
              </p>
              <p>
                Millions of people are drowning in the same exact trap I was.
              </p>
              <p>
                Losing money. Losing sleep. Losing relationships.
              </p>
              <p>
                Not because they&apos;re dumb.
              </p>
              <p className="text-xl text-white font-semibold">
                Because they&apos;re <span className="text-[#EF4444]">HUMAN.</span>
              </p>
            </div>

            {/* CTA Button #3 - After Story */}
            <div className="text-center mt-16">
              <button
                onClick={handleCTAClick}
                className="btn-primary px-10 py-4 font-semibold text-base mb-4 font-[family-name:var(--font-heading)]"
              >
                I Want This Too
              </button>
              <p className="text-[#666] text-sm">Join 400+ profitable traders • <span className="text-[#EF4444] font-semibold">{LICENSES_REMAINING} spots left</span></p>
            </div>
          </div>
        </section>

        {/* ============ WHY APEX EXISTS ============ */}
        <section className="py-20 px-6 bg-[#050505] gradient-section-alt">
          <div className="relative max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-8 font-[family-name:var(--font-heading)]">
              THAT&apos;S WHY <span className="text-[#3B82F6]">APEX EXISTS.</span>
            </h2>

            <div className="space-y-6 text-[#aaa] font-[family-name:var(--font-body)] leading-relaxed text-left">
              <p>
                Not to make me rich (I already am from my own trading).
              </p>
              <p className="text-white font-semibold">
                To give you what I had to build for myself:
              </p>

              <div className="space-y-2 my-8 text-center">
                <p className="text-lg text-[#888]">A way out of the emotional nightmare.</p>
                <p className="text-lg text-[#888]">A way to trade without the trauma.</p>
                <p className="text-lg text-[#888]">A way to profit without the panic.</p>
              </div>

              <p>
                I&apos;m not a guru.
              </p>
              <p>
                I&apos;m not selling courses.
              </p>
              <p>
                I&apos;m not promising you&apos;ll get rich overnight.
              </p>
              <p className="text-xl text-white font-semibold py-8 border-t border-b border-[#1a1a1a] my-8 text-center">
                I&apos;m offering you the same thing that saved my life:
                <br />
                <span className="text-[#3B82F6]">A system that trades while you live.</span>
              </p>
            </div>
          </div>
        </section>

        {/* ============ SOLUTION SECTION (MEET APEX) ============ */}
        <section className="py-20 px-6 bg-black gradient-section-alt">
          <div className="relative max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 border border-[#3B82F6]/30 bg-[#3B82F6]/5 px-4 py-2 mb-6">
                <Bot className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-[#3B82F6] text-xs uppercase tracking-widest font-[family-name:var(--font-body)]">The Solution</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
                MEET <span className="text-[#3B82F6]">APEX PROTOCOL™</span>
              </h2>
              <p className="text-lg text-[#EF4444] mb-4 font-[family-name:var(--font-heading)] font-semibold">THE EMOTIONAL EXORCISM</p>
              <p className="text-[#888] max-w-2xl mx-auto font-[family-name:var(--font-body)] leading-relaxed mb-8">
                A neural adaptive system that thinks faster than you, reacts faster than you,
                and executes <span className="text-white font-medium">without the psychological baggage</span> destroying your account.
              </p>

              <Image src="/apex.png" alt="APEX Protocol" width={1000} height={1000} />
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-2 gap-px bg-[#1a1a1a] mb-16">
              <FeatureCard
                icon={Target}
                title="Quantum Pattern Recognition"
                description="Processes 1,247 data points per second across 14 pairs. By the time you THINK about a trade, APEX has already executed and managed it."
                accentColor="blue"
              />
              <FeatureCard
                icon={Brain}
                title='The "Broke Brain" Override'
                description="Lose 3 in a row? No tilt. No revenge. Win 5 in a row? Doesn't get cocky. It's literally impossible for APEX to experience FOMO, fear, or greed."
                accentColor="red"
              />
              <FeatureCard
                icon={Clock}
                title="Sleep-Mode Wealth Extraction"
                description="Tokyo session, London open, New York overlap—all covered while you sleep, work, and live. APEX hunts 24/7 without breaks."
                accentColor="red"
              />
              <FeatureCard
                icon={Shield}
                title="Life Raft Protection Protocol"
                description="News scanner, auto-hedge, dynamic stops, and account preservation mode. Your account can't blow up. The system won't allow it."
                accentColor="blue"
              />
            </div>

            {/* How It Works */}
            <div className="border border-[#1a1a1a] p-8 md:p-12 bg-[#0a0a0a]">
              <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-10 font-[family-name:var(--font-heading)]">
                How It <span className="text-[#3B82F6]">Actually</span> Works
              </h3>

              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#EF4444] mb-3 font-[family-name:var(--font-body)]">What You See:</div>
                  <div className="bg-black border border-[#1a1a1a] p-4 text-[#888] font-[family-name:var(--font-body)]">
                    &quot;Hmm, EUR/USD looks like it might go up.&quot;
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#3B82F6] mb-3 font-[family-name:var(--font-body)]">What APEX Sees:</div>
                  <div className="bg-black border border-[#3B82F6]/30 p-4 text-sm font-mono text-[#3B82F6]">
                    GBP correlation +0.87, DXY divergence -12%, institutional flow shifting,
                    liquidity pool at 1.0847, probability matrix 73.4% long, execute 0.8 lots,
                    SL 1.0821, TP1 1.0869, TP2 1.0891
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <p className="text-[#888] font-[family-name:var(--font-body)]">
                  All processed in <span className="text-[#3B82F6] font-medium">0.3 seconds</span>.
                </p>
              </div>
            </div>

            {/* AI Revolution Section */}
            <div className="mt-16 space-y-16">
              {/* 2026 Dividing Line */}
              <div className="border border-[#1a1a1a] p-8 md:p-12 bg-black">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-8 font-[family-name:var(--font-heading)] text-center">
                  WHY 2026 IS THE <span className="text-[#EF4444]">&quot;BEFORE AI&quot;</span> VS <span className="text-[#3B82F6]">&quot;AFTER AI&quot;</span> DIVIDING LINE
                </h3>

                <div className="space-y-6 text-[#aaa] font-[family-name:var(--font-body)] leading-relaxed">
                  <p>Let me show you something that&apos;ll blow your mind.</p>

                  <p>
                    <span className="text-white font-semibold">Remember 2022?</span> Everyone laughed at AI. &quot;It&apos;s just a gimmick.&quot; &quot;It&apos;ll never replace humans.&quot;
                  </p>

                  <p>
                    <span className="text-white font-semibold">Then ChatGPT dropped.</span>
                  </p>

                  <p>
                    In 18 months, AI went from &quot;interesting experiment&quot; to <span className="text-white font-semibold">running Fortune 500 companies.</span>
                  </p>

                  <p className="text-white font-semibold">Now look at trading:</p>
                </div>

                {/* Comparison Grid */}
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-[#0a0a0a] border border-[#EF4444]/30 p-6">
                    <div className="text-xs uppercase tracking-widest text-[#EF4444] mb-4 font-[family-name:var(--font-body)]">Traditional Bots (Pre-2024)</div>
                    <ul className="space-y-2 text-[#888] font-[family-name:var(--font-body)] text-sm">
                      <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" /> Follow IF/THEN rules like a calculator</li>
                      <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" /> Can&apos;t adapt when market conditions change</li>
                      <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" /> Break during high volatility</li>
                      <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" /> Require constant manual updates</li>
                      <li className="flex items-start gap-2"><span className="text-[#EF4444] font-semibold">Win rate: 52-58%</span></li>
                    </ul>
                  </div>
                  <div className="bg-[#0a0a0a] border border-[#3B82F6]/30 p-6">
                    <div className="text-xs uppercase tracking-widest text-[#3B82F6] mb-4 font-[family-name:var(--font-body)]">AI-Powered Systems (2025+)</div>
                    <ul className="space-y-2 text-[#888] font-[family-name:var(--font-body)] text-sm">
                      <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-0.5" /> <span className="text-white font-medium">Learn</span> from millions of price patterns in real-time</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-0.5" /> <span className="text-white font-medium">Adapt</span> to changing volatility, correlations, sentiment</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-0.5" /> <span className="text-white font-medium">Predict</span> institutional moves before they happen</li>
                      <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-0.5" /> <span className="text-white font-medium">Self-optimize</span> without human intervention</li>
                      <li className="flex items-start gap-2"><span className="text-[#3B82F6] font-semibold">Win rate: 64-71%</span></li>
                    </ul>
                  </div>
                </div>

                <p className="text-center text-white font-semibold mt-8 text-lg font-[family-name:var(--font-heading)]">
                  The gap isn&apos;t small. It&apos;s <span className="text-[#3B82F6]">EXPONENTIAL.</span>
                </p>
              </div>

              {/* What Just Happened */}
              <div className="border border-[#1a1a1a] p-8 md:p-12 bg-[#0a0a0a]">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-8 font-[family-name:var(--font-heading)] text-center">
                  HERE&apos;S WHAT JUST HAPPENED IN FOREX <span className="text-[#888]">(And Nobody&apos;s Talking About It)</span>
                </h3>

                <div className="space-y-4 mb-8">
                  {[
                    { date: "January 2024", text: "Major hedge funds started deploying GPT-4 integrated trading systems." },
                    { date: "June 2024", text: "Goldman Sachs published a report: \"AI-driven trading systems outperformed human traders by 340% in volatile market conditions.\"" },
                    { date: "October 2024", text: "The top 15 most profitable forex funds all use AI-powered execution." },
                    { date: "December 2024", text: "Retail bots without AI integration saw a 67% failure rate. AI-integrated systems? 12% failure rate." },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 border-b border-[#1a1a1a] pb-4">
                      <span className="text-[#3B82F6] font-semibold text-sm whitespace-nowrap font-[family-name:var(--font-body)]">{item.date}:</span>
                      <span className="text-[#aaa] font-[family-name:var(--font-body)]">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-white font-semibold mb-4 font-[family-name:var(--font-body)]">The writing is on the wall:</p>
                  <p className="text-[#EF4444] font-semibold text-lg font-[family-name:var(--font-heading)]">
                    If your bot doesn&apos;t have neural learning, you&apos;re driving a horse and buggy on a highway.
                  </p>
                </div>

                {/* Projection Image */}
                <div className="mt-8">
                  <Image src="/projection.png" alt="AI Trading Projection" width={1000} height={600} className="w-full h-auto" />
                </div>
              </div>

              {/* Why APEX is Different */}
              <div className="border border-[#1a1a1a] p-8 md:p-12 bg-black">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-8 font-[family-name:var(--font-heading)] text-center">
                  WHY APEX ISN&apos;T LIKE THOSE <span className="text-[#EF4444]">$49 &quot;EAs&quot;</span> YOU SEE ON FORUMS
                </h3>

                <div className="space-y-6 text-[#aaa] font-[family-name:var(--font-body)] leading-relaxed mb-8">
                  <p>Most retail bots are built by:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-[#EF4444]" /> Freelance coders copying 2018 strategies</div>
                    <div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-[#EF4444]" /> Marketers who&apos;ve never traded in their life</div>
                    <div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-[#EF4444]" /> &quot;Gurus&quot; recycling MT4 scripts from forums</div>
                  </div>

                  <p><span className="text-white font-semibold">They have ZERO AI integration.</span> They&apos;re just fancy IF/THEN statements.</p>

                  <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 text-center">
                    <p className="text-[#888] italic">&quot;IF RSI crosses 30, THEN buy.&quot;</p>
                    <p className="text-[#666] text-sm mt-2">Cool. A 12-year-old could code that.</p>
                  </div>

                  <p className="text-white font-semibold text-lg">Here&apos;s what APEX actually does:</p>
                </div>
              </div>

              {/* Machine Learning */}
              <div className="border border-[#1a1a1a] p-8 md:p-12 bg-[#0a0a0a]">
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="w-8 h-8 text-[#3B82F6]" />
                  <h3 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">1. MACHINE LEARNING PATTERN RECOGNITION</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-[#EF4444] mb-3 font-[family-name:var(--font-body)]">Traditional Bot Sees:</div>
                    <div className="bg-black border border-[#1a1a1a] p-4 text-[#888] font-[family-name:var(--font-body)]">
                      &quot;Price bounced off support.&quot;
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-[#3B82F6] mb-3 font-[family-name:var(--font-body)]">APEX Sees:</div>
                    <div className="bg-black border border-[#3B82F6]/30 p-4 text-sm font-mono text-[#3B82F6]">
                      &quot;Price bounced off support 0.0847, but DXY correlation is -0.91, institutional flow indicators show net selling, order book depth at this level is 43% below average, similar patterns in the last 180 days resulted in false breakouts 71% of the time within 4 hours, probability of sustained bounce: 31%, action: DO NOT ENTER.&quot;
                    </div>
                  </div>
                </div>

                <p className="text-center text-[#888] font-[family-name:var(--font-body)]">
                  <span className="text-white font-semibold">All in 0.4 seconds.</span> It&apos;s not following rules. <span className="text-[#3B82F6] font-semibold">It&apos;s thinking.</span>
                </p>
              </div>

              {/* Real-Time Adaptive Learning */}
              <div className="border border-[#1a1a1a] p-8 md:p-12 bg-black">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-8 h-8 text-[#EF4444]" />
                  <h3 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">2. REAL-TIME ADAPTIVE LEARNING</h3>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-4 border-l-2 border-[#3B82F6] pl-4">
                    <div>
                      <span className="text-[#3B82F6] font-semibold font-[family-name:var(--font-body)]">January 2025:</span>
                      <span className="text-[#888] font-[family-name:var(--font-body)]"> Market is trending.</span>
                      <p className="text-white font-[family-name:var(--font-body)]">APEX optimizes for: Momentum strategies, trailing stops, breakout entries.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 border-l-2 border-[#EF4444] pl-4">
                    <div>
                      <span className="text-[#EF4444] font-semibold font-[family-name:var(--font-body)]">February 2025:</span>
                      <span className="text-[#888] font-[family-name:var(--font-body)]"> Market shifts to range-bound.</span>
                      <p className="text-white font-[family-name:var(--font-body)]">APEX automatically pivots to: Mean reversion, tighter stops, fade-the-extremes entries.</p>
                    </div>
                  </div>
                </div>

                <p className="text-center text-[#aaa] font-[family-name:var(--font-body)]">
                  <span className="text-white font-semibold">You didn&apos;t change settings. APEX adapted on its own.</span>
                  <br />
                  <span className="text-[#EF4444]">Traditional bots? They keep running the same strategy until they blow your account.</span>
                </p>
              </div>

              {/* Multi-Dimensional Analysis */}
              <div className="border border-[#1a1a1a] p-8 md:p-12 bg-[#0a0a0a]">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-8 h-8 text-[#3B82F6]" />
                  <h3 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">3. MULTI-DIMENSIONAL MARKET ANALYSIS</h3>
                </div>

                <p className="text-[#888] mb-6 font-[family-name:var(--font-body)]">Most bots look at 1-3 indicators on 1 timeframe. <span className="text-white font-semibold">APEX simultaneously processes:</span></p>

                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  {[
                    "14 currency pairs (correlation analysis)",
                    "6 timeframes per pair (multi-timeframe confluence)",
                    "Order flow data (where institutions are positioned)",
                    "Volatility regimes (VIX, ATR, historical ranges)",
                    "News sentiment scanning (pre-positioning before events)",
                    "Liquidity mapping (where stop-hunts will occur)",
                    "Seasonal patterns (monthly/quarterly tendencies)",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-[#aaa] font-[family-name:var(--font-body)] text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>

                <div className="text-center bg-black border border-[#3B82F6]/30 p-6">
                  <p className="text-4xl font-bold text-[#3B82F6] font-[family-name:var(--font-heading)]">1,247</p>
                  <p className="text-[#888] font-[family-name:var(--font-body)]">data points per second</p>
                  <p className="text-[#666] text-sm mt-2 font-[family-name:var(--font-body)]">Your brain can process maybe 3-5 variables before it gets overwhelmed.</p>
                  <p className="text-white font-semibold mt-2 font-[family-name:var(--font-body)]">APEX processes 1,247 and makes decisions in milliseconds.</p>
                </div>
              </div>

              {/* Predictive Risk Management */}
              <div className="border border-[#1a1a1a] p-8 md:p-12 bg-black">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-8 h-8 text-[#EF4444]" />
                  <h3 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">4. PREDICTIVE RISK MANAGEMENT</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-[#EF4444] mb-3 font-[family-name:var(--font-body)]">Traditional Bots:</div>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 text-[#888] font-[family-name:var(--font-body)]">
                      &quot;Set 2% risk per trade.&quot;
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-[#3B82F6] mb-3 font-[family-name:var(--font-body)]">APEX:</div>
                    <div className="bg-[#0a0a0a] border border-[#3B82F6]/30 p-4 text-sm font-mono text-[#3B82F6]">
                      &quot;Current volatility 2.3x normal, correlation breakdown detected across USD pairs, news event in 90 minutes, reduce position sizing to 0.8%, tighten stops by 15%, activate hedge protocol if drawdown exceeds 4% in next 6 hours.&quot;
                    </div>
                  </div>
                </div>

                <p className="text-center text-[#aaa] font-[family-name:var(--font-body)]">
                  <span className="text-white font-semibold">It doesn&apos;t just react to risk. It PREDICTS it.</span>
                  <br />
                  <span className="text-[#888]">That&apos;s why APEX users sleep at night while traditional bot users wake up to margin calls.</span>
                </p>
              </div>

              {/* Continuous Evolution */}
              <div className="border border-[#1a1a1a] p-8 md:p-12 bg-[#0a0a0a]">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-8 h-8 text-[#3B82F6]" />
                  <h3 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">5. CONTINUOUS EVOLUTION</h3>
                </div>

                <div className="space-y-4 text-[#aaa] font-[family-name:var(--font-body)] leading-relaxed">
                  <p>Here&apos;s the insane part:</p>
                  <p className="text-white font-semibold">Every month, APEX gets smarter.</p>
                  <p>Not because we update some settings. Because it&apos;s <span className="text-[#3B82F6] font-semibold">learning from 500+ live accounts simultaneously.</span></p>
                  <p>Every winning trade. Every losing trade. Every edge case. Every volatility spike.</p>
                  <p className="text-white font-semibold">The collective intelligence of 500 traders flows back into the algorithm.</p>
                  <p>It&apos;s like having 500 experienced traders constantly teaching the system what works and what doesn&apos;t.</p>
                </div>

                <div className="mt-6 p-4 border border-[#3B82F6]/30 bg-[#3B82F6]/5 text-center">
                  <p className="text-white font-semibold font-[family-name:var(--font-body)]">
                    Traditional bots are static. <span className="text-[#3B82F6]">APEX is EVOLVING.</span>
                  </p>
                </div>
              </div>

              {/* The Uncomfortable Truth */}
              <div className="border border-[#1a1a1a] p-8 md:p-12 bg-black">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-8 font-[family-name:var(--font-heading)] text-center">
                  THE <span className="text-[#EF4444]">UNCOMFORTABLE TRUTH</span> ABOUT THE NEXT 24 MONTHS
                </h3>

                <div className="space-y-6 text-[#aaa] font-[family-name:var(--font-body)] leading-relaxed text-center max-w-2xl mx-auto">
                  <p>AI isn&apos;t coming to trading. <span className="text-white font-semibold">It&apos;s already here.</span></p>
                  <p>And the gap between AI-powered systems and manual/traditional-bot traders is growing <span className="text-[#EF4444] font-semibold">exponentially</span> every single month.</p>
                  <p className="text-white font-semibold text-lg">Right now, you have a choice:</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-[#0a0a0a] border border-[#EF4444]/30 p-6">
                    <div className="text-[#EF4444] font-bold mb-3 font-[family-name:var(--font-heading)]">Option A:</div>
                    <p className="text-[#888] font-[family-name:var(--font-body)] text-sm">Keep trading manually or with outdated bots. Watch the gap widen. Watch your win rate drop as the market gets more efficient. Wonder why nothing works anymore.</p>
                  </div>
                  <div className="bg-[#0a0a0a] border border-[#3B82F6]/30 p-6">
                    <div className="text-[#3B82F6] font-bold mb-3 font-[family-name:var(--font-heading)]">Option B:</div>
                    <p className="text-[#888] font-[family-name:var(--font-body)] text-sm">Adopt AI-powered execution NOW while it&apos;s still accessible to retail traders. Before the big institutions buy up all the tech. Before regulations limit retail access. Before the edge disappears.</p>
                  </div>
                </div>
              </div>

              {/* Internet 1995 Moment */}
              <div className="border border-[#1a1a1a] p-8 md:p-12 bg-[#0a0a0a]">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-8 font-[family-name:var(--font-heading)] text-center">
                  THIS IS YOUR <span className="text-[#3B82F6]">&quot;INTERNET IN 1995&quot;</span> MOMENT
                </h3>

                <div className="space-y-6 text-[#aaa] font-[family-name:var(--font-body)] leading-relaxed">
                  <p>In 1995, most people thought the internet was a fad.</p>

                  <div className="space-y-2 pl-4 border-l-2 border-[#333]">
                    <p className="text-[#888] italic">&quot;Why would I buy things online?&quot;</p>
                    <p className="text-[#888] italic">&quot;I can just go to the store.&quot;</p>
                    <p className="text-[#888] italic">&quot;This seems complicated.&quot;</p>
                  </div>

                  <p>The people who adopted it early? <span className="text-white font-semibold">They built Amazon, Google, Facebook.</span></p>
                  <p>The people who waited? <span className="text-[#EF4444]">They became customers instead of owners.</span></p>
                  <p className="text-white font-semibold">AI-powered trading is at that exact inflection point RIGHT NOW.</p>
                  <p>Early adopters are quietly stacking wins.</p>
                  <p>Skeptics are still Googling <span className="text-[#888] italic">&quot;best RSI settings&quot;</span> and wondering why they can&apos;t get consistent.</p>
                </div>
              </div>

              {/* APEX is Different Category */}
              <div className="border border-[#1a1a1a] p-8 md:p-12 bg-black text-center">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-8 font-[family-name:var(--font-heading)]">
                  APEX ISN&apos;T JUST <span className="text-[#3B82F6]">BETTER</span> THAN OTHER BOTS.
                </h3>

                <p className="text-white font-semibold text-lg mb-8 font-[family-name:var(--font-body)]">
                  It&apos;s a fundamentally different category of technology.
                </p>

                <p className="text-[#888] mb-6 font-[family-name:var(--font-body)]">Comparing APEX to a traditional EA is like comparing:</p>

                <div className="space-y-2 text-[#aaa] font-[family-name:var(--font-body)]">
                  <p>A Tesla to a horse and buggy</p>
                  <p>ChatGPT to a calculator</p>
                  <p>An iPhone to a rotary phone</p>
                </div>

                <p className="text-white font-semibold text-lg mt-8 font-[family-name:var(--font-heading)]">
                  It&apos;s not an upgrade. It&apos;s a <span className="text-[#3B82F6]">paradigm shift.</span>
                </p>
              </div>

              {/* The Math */}
              <div className="border border-[#1a1a1a] p-8 md:p-12 bg-[#0a0a0a]">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-8 font-[family-name:var(--font-heading)] text-center">
                  THE MATH <span className="text-[#3B82F6]">DOESN&apos;T LIE:</span>
                </h3>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-black border border-[#EF4444]/30 p-6">
                    <div className="text-xs uppercase tracking-widest text-[#EF4444] mb-4 font-[family-name:var(--font-body)]">Traditional Bot Performance (2024 avg)</div>
                    <div className="space-y-2 text-sm font-[family-name:var(--font-body)]">
                      <div className="flex justify-between"><span className="text-[#888]">Win Rate:</span><span className="text-white">54%</span></div>
                      <div className="flex justify-between"><span className="text-[#888]">Avg Monthly Return:</span><span className="text-white">3-7%</span></div>
                      <div className="flex justify-between"><span className="text-[#888]">Max Drawdown:</span><span className="text-[#EF4444]">18-24%</span></div>
                      <div className="flex justify-between"><span className="text-[#888]">Adaptation:</span><span className="text-white">Manual updates</span></div>
                    </div>
                  </div>
                  <div className="bg-black border border-[#3B82F6]/30 p-6">
                    <div className="text-xs uppercase tracking-widest text-[#3B82F6] mb-4 font-[family-name:var(--font-body)]">APEX Performance (Verified 2024-2025)</div>
                    <div className="space-y-2 text-sm font-[family-name:var(--font-body)]">
                      <div className="flex justify-between"><span className="text-[#888]">Win Rate:</span><span className="text-[#3B82F6] font-semibold">64%</span></div>
                      <div className="flex justify-between"><span className="text-[#888]">Avg Monthly Return:</span><span className="text-[#3B82F6] font-semibold">12-23%</span></div>
                      <div className="flex justify-between"><span className="text-[#888]">Max Drawdown:</span><span className="text-[#3B82F6] font-semibold">11.4%</span></div>
                      <div className="flex justify-between"><span className="text-[#888]">Adaptation:</span><span className="text-[#3B82F6] font-semibold">Real-time autonomous</span></div>
                    </div>
                  </div>
                </div>

                <p className="text-center text-white font-semibold font-[family-name:var(--font-body)]">
                  That&apos;s not 10% better. That&apos;s <span className="text-[#3B82F6]">2-3X better.</span>
                </p>
                <p className="text-center text-[#888] mt-2 font-[family-name:var(--font-body)]">
                  And the gap is <span className="text-[#EF4444]">widening every month</span> as the AI learns.
                </p>
              </div>

              {/* What Really Matters */}
              <div className="border border-[#1a1a1a] p-8 md:p-12 bg-black">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-8 font-[family-name:var(--font-heading)] text-center">
                  BUT HERE&apos;S WHAT <span className="text-[#EF4444]">REALLY MATTERS...</span>
                </h3>

                <div className="space-y-6 text-[#aaa] font-[family-name:var(--font-body)] leading-relaxed text-center max-w-2xl mx-auto">
                  <p>This isn&apos;t about some tech flex.</p>
                  <p className="text-white font-semibold text-lg">It&apos;s about whether you WIN or LOSE.</p>
                  <p>Whether you grow your account or blow it.</p>
                  <p>Whether you&apos;re still struggling 6 months from now... or finally profitable.</p>

                  <div className="space-y-2 text-[#888]">
                    <p>The market doesn&apos;t care about your effort.</p>
                    <p>It doesn&apos;t care about your &quot;discipline.&quot;</p>
                    <p>It doesn&apos;t care about your YouTube education.</p>
                  </div>

                  <p className="text-white font-semibold">It only cares about execution.</p>
                  <p>And AI executes better than humans. <span className="text-[#3B82F6] font-semibold">It&apos;s not even close.</span></p>
                </div>

                <div className="mt-8 p-6 border border-[#3B82F6]/30 bg-[#3B82F6]/5 text-center">
                  <p className="text-white font-semibold font-[family-name:var(--font-body)] text-lg">So the question is:</p>
                  <p className="text-[#888] mt-2 font-[family-name:var(--font-body)]">Are you going to keep fighting AI with human emotion?</p>
                  <p className="text-[#3B82F6] font-semibold mt-2 font-[family-name:var(--font-body)]">Or are you going to USE AI to finally win?</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Ticker */}
        <SocialProofTicker />

        {/* ============ TESTIMONIALS SECTION ============ */}
        <section className="py-20 px-6 bg-[#050505] gradient-section">
          <div className="relative max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
                Real User <span className="text-[#3B82F6]">Results</span>
              </h2>
              <p className="text-[#888] font-[family-name:var(--font-body)]">Verified accounts. <span className="text-[#EF4444]">Real numbers.</span></p>
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-[#1a1a1a]">
              {testimonials.map((testimonial, i) => (
                <TestimonialCard
                  key={i}
                  name={testimonial.name}
                  handle={testimonial.handle}
                  avatar={testimonial.avatar}
                  quote={testimonial.quote}
                  startAmount={testimonial.startAmount}
                  currentAmount={testimonial.currentAmount}
                  duration={testimonial.duration}
                  stars={testimonial.stars}
                />
              ))}
            </div>

            {/* Community Screenshots */}
            <div className="mt-20">
              <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 font-[family-name:var(--font-heading)]">
                  From Our <span className="text-[#3B82F6]">Community</span>
                </h3>
                <p className="text-[#888] font-[family-name:var(--font-body)]">Real posts from real traders in our private Discord</p>
              </div>

              {/* Masonry-style stacked grid */}
              <div className="columns-1 md:columns-2 gap-4 space-y-4">
                {Array.from({ length: 14 }, (_, i) => i + 1).map((num) => (
                  <div
                    key={num}
                    className="break-inside-avoid mb-4"
                  >
                    <div className="relative group overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#3B82F6]/50 transition-all duration-300">
                      <img
                        src={`/community/${num}.png`}
                        alt={`Community testimonial ${num}`}
                        className="w-full h-auto"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ FAQ SECTION ============ */}
        <section className="py-20 px-6 bg-black gradient-section-alt">
          <div className="relative max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
                I Know What You&apos;re <span className="text-[#EF4444]">Thinking...</span>
              </h2>
              <p className="text-[#888] font-[family-name:var(--font-body)]">Let me address every objection.</p>
            </div>

            <div className="border-t border-[#1a1a1a]">
              <FAQItem
                question="This sounds too good to be true."
                answer="Yeah, so did the internet in 1995. So did Bitcoin in 2010. So did Tesla stock in 2019. But let's be real: You're not skeptical because this seems fake. You're skeptical because you've been burned before. That's fair. That's why we have a 30-day money-back guarantee. Run it. Demo it. Test it. Try to prove it wrong. If it doesn't work, get your money back."
              />
              <FAQItem
                question="I don't have enough money to start."
                answer="You have enough money to keep losing manually? You had $500 for that last course collecting dust? You had $1,200 for the account you just blew? The bot works with accounts as small as $500. Won't make you rich overnight, but it'll GROW. Start small. Compound. That's how everyone in the Discord started."
              />
              <FAQItem
                question="What if it stops working?"
                answer="Valid question. The market evolves. Conditions change. That's why APEX updates MONTHLY. We have a team of quants and developers constantly optimizing the algorithm. You get these updates FREE. Forever. We take 0.3% of YOUR profits—when you win, we win. We're literally handcuffed to your success."
              />
              <FAQItem
                question="I'm not tech-savvy."
                answer="Neither is Marcus (pharmacy tech), Sarah (dental assistant), or Tyler (pours concrete). If you can install an app on your phone, you can set up APEX. We have a 23-minute video that walks you through EVERYTHING. Click button. Download file. Drag to folder. Click 'Auto-Trade.' Done. Plus 400+ Discord members will help if you get stuck."
              />
              <FAQItem
                question="What if I lose money?"
                answer="You're ALREADY losing money trading manually. Past 6 months: blown accounts (-$4,200), courses (-$800) = -$5,000. Worst case with APEX: bot cost (-$499) + protected losses (-$350) = -$849. You're risking $849 to potentially make $10K-$50K vs. continuing to bleed $5K+ per year manually. Which risk makes sense?"
              />
              <FAQItem
                question="I need to learn to trade properly first."
                answer="NO. YOU. DON'T. That's the LIE they sold you. Meanwhile, people who can't even SPELL 'Fibonacci' are making $3K/month with APEX. You don't need to be a mechanic to drive a car. You don't need to be a pilot to fly in a plane. You don't need to be a trader to profit from trading."
              />
              <FAQItem
                question="What about the people who don't succeed?"
                answer="Real talk? 8-12% don't see results. Why? They don't turn it on. Seriously—they buy it, install it, get scared, and never press 'Start.' Or they use accounts under $500, override the bot manually, turn it off after 2 losing trades, or use bad brokers. Follow the setup guide and let it run—you WILL see results."
              />
            </div>
          </div>
        </section>

        {/* ============ PRICING SECTION ============ */}
        <section id="pricing-section" className="py-20 px-6 bg-[#050505] gradient-section">
          <div className="relative max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
                Choose Your <span className="text-[#3B82F6]">Path</span>
              </h2>
              <p className="text-[#888] font-[family-name:var(--font-body)]">Start trading <span className="text-[#EF4444]">without emotions</span> today.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-[#1a1a1a]">
              <PricingCard
                tier="Starter Protocol"
                price="$499"
                cryptoPrice="$399"
                cryptoSavings="$100"
                features={[
                  "Full APEX Bot (Unlimited MT4/MT5 use)",
                  "APEX Scalper — $5K-$10K scalping power",
                  "23-Min Setup Video",
                  "Monthly Algorithm Updates (FREE forever)",
                  "Private Discord (400+ traders)",
                  "Email Support (under 6 hours)",
                  "30-Day Money-Back Guarantee",
                ]}
                ctaText="Get Starter Access"
                packageId="starter"
                onCTAClick={handlePackageSelect}
              />
              <PricingCard
                tier="Elite Mastery Bundle"
                price="$999"
                cryptoPrice="$799"
                cryptoSavings="$200"
                features={[
                  "Everything in Starter, plus:",
                  "APEX Scalper — $100K+ scalping power ⚡",
                  "Personal Onboarding Call (30-min)",
                  "Advanced Settings Pack (3 configs)",
                  '"Account Resurrection" Protocol',
                  "Priority Support (90-min response)",
                  "Monthly Live Strategy Sessions",
                  "VIP Discord Channel",
                  "Profit Multiplier Pack",
                  '"Shadow Trader" Module',
                  "Quarterly Account Review",
                ]}
                bonuses={[
                  { title: "Onboarding Call", value: "$500" },
                  { title: "Settings Pack", value: "$300" },
                  { title: "Resurrection Protocol", value: "$400" },
                ]}
                isPopular
                ctaText="Get Elite Access"
                packageId="elite"
                onCTAClick={handlePackageSelect}
              />
            </div>

            {/* Bonus Section */}
            <div className="mt-16 border border-[#1a1a1a] p-8 text-center bg-black glow-red">
              <div className="text-xs uppercase tracking-widest text-[#EF4444] mb-4 font-[family-name:var(--font-body)]">
                For the Next 22 People Only
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
                The &quot;<span className="text-[#EF4444]">Fuck-It Fund</span>&quot; Challenge
              </h3>
              <p className="text-[#888] max-w-xl mx-auto mb-6 font-[family-name:var(--font-body)]">
                Buy Elite today, run APEX for 90 days. If you&apos;re not up at least <span className="text-[#3B82F6] font-medium">$2,000</span> (with a $5K+ starting account), we&apos;ll personally audit your setup and give you a $500 trading credit.
              </p>
            </div>

            {/* Trust Section */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm">
              {[
                { icon: Lock, text: "256-Bit Encrypted" },
                { icon: Zap, text: "Instant Delivery" },
                { icon: Shield, text: "30-Day Guarantee" },
                { icon: Globe, text: "Works Worldwide" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[#666] font-[family-name:var(--font-body)]">
                  <item.icon className="w-4 h-4" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ URGENCY SECTION ============ */}
        <section className="py-20 px-6 bg-black gradient-section-alt">
          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 font-[family-name:var(--font-heading)]">
              The Psychology of <span className="text-[#EF4444]">Regret</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-px bg-[#1a1a1a] mb-12">
              {/* Option A */}
              <div className="bg-[#0a0a0a] p-8 text-left">
                <div className="text-xs uppercase tracking-widest text-[#EF4444] mb-4 font-[family-name:var(--font-body)]">6 Months From Now (Option A)</div>
                <p className="text-[#888] mb-4 font-[family-name:var(--font-body)] leading-relaxed">
                  You&apos;re scrolling Instagram. You see someone post: &quot;Just hit $40K with APEX&quot;
                </p>
                <p className="text-[#888] mb-4 font-[family-name:var(--font-body)]">Your stomach drops. &quot;That could&apos;ve been me.&quot;</p>
                <p className="text-[#666] font-[family-name:var(--font-body)] text-sm">
                  Same broke account. Same stress. Same losses.
                </p>
              </div>

              {/* Option B */}
              <div className="bg-[#0a0a0a] p-8 text-left border-l border-[#1a1a1a]">
                <div className="text-xs uppercase tracking-widest text-[#3B82F6] mb-4 font-[family-name:var(--font-body)]">6 Months From Now (Option B)</div>
                <p className="text-[#888] mb-4 font-[family-name:var(--font-body)] leading-relaxed">
                  You wake up. Check your phone. Account balance: <span className="text-[#3B82F6] font-medium">$34,890</span>
                </p>
                <p className="text-[#888] mb-4 font-[family-name:var(--font-body)]">You started with $5,000. <span className="text-[#3B82F6]">+$29,890 profit.</span></p>
                <p className="text-[#666] font-[family-name:var(--font-body)] text-sm">
                  You didn&apos;t trade. You just... lived.
                </p>
              </div>
            </div>

            {/* License Counter */}
            <div className="border border-[#1a1a1a] p-8 mb-12 bg-[#0a0a0a] glow-blue">
              <div className="text-xs uppercase tracking-widest text-[#666] mb-4 font-[family-name:var(--font-body)]">Server capacity capped at 500</div>
              <div className="text-5xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
                <span className="text-[#EF4444]"><AnimatedCounter target={LICENSES_REMAINING} /></span>
                <span className="text-[#333] text-3xl">/{LICENSES_TOTAL}</span>
              </div>
              <div className="text-[#888] font-medium mb-6 font-[family-name:var(--font-body)]">Licenses Remaining</div>
              <div className="max-w-xs mx-auto">
                <LicenseCounter />
              </div>
              <div className="text-xs text-[#666] mt-4 font-[family-name:var(--font-body)]">
                Last batch sold out in 9 hours • No reopening for 60-90 days
              </div>
            </div>
          </div>
        </section>

        {/* ============ FINAL CTA SECTION ============ */}
        <section className="py-20 px-6 bg-[#050505] gradient-section">
          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-[family-name:var(--font-heading)]">
              The Final <span className="text-[#3B82F6]">Truth</span>
            </h2>
            <p className="text-[#888] mb-10 font-[family-name:var(--font-body)] leading-relaxed">
              The successful version of you is screaming: <br />
              <span className="text-[#EF4444] font-medium">&quot;CLICK THE BUTTON. DO IT NOW. STOP OVERTHINKING.&quot;</span>
            </p>

            {/* What Happens */}
            <div className="border border-[#1a1a1a] p-8 mb-10 bg-black">
              <h3 className="text-lg font-bold text-white mb-6 font-[family-name:var(--font-heading)]">What Happens When You Click:</h3>
              <div className="grid sm:grid-cols-4 gap-6 text-left">
                {[
                  { step: "1", text: "Choose your package" },
                  { step: "2", text: "Instant license key" },
                  { step: "3", text: "Download + setup video" },
                  { step: "4", text: "Bot running in 30 min" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#3B82F6] to-[#EF4444] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 font-[family-name:var(--font-heading)]">
                      {item.step}
                    </div>
                    <span className="text-[#888] text-sm font-[family-name:var(--font-body)]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Final CTA */}
            <button
              onClick={scrollToPricing}
              className="btn-primary px-12 py-4 font-semibold text-base mb-8 font-[family-name:var(--font-heading)]"
            >
              Get Instant Access
            </button>

            {/* Still Reading */}
            <div className="border-t border-[#1a1a1a] pt-10 mt-10">
              <h3 className="text-lg font-bold text-white mb-4 font-[family-name:var(--font-heading)]">Still <span className="text-[#3B82F6]">Reading?</span></h3>
              <p className="text-[#888] mb-6 font-[family-name:var(--font-body)]">
                Then you already know you want this. Your brain is just in &quot;protection mode.&quot;
              </p>
              <div className="grid sm:grid-cols-3 gap-4 text-sm mb-8">
                <div className="bg-black border border-[#1a1a1a] p-4">
                  <div className="text-[#666] mb-1 font-[family-name:var(--font-body)]">&quot;What if it doesn&apos;t work?&quot;</div>
                  <div className="text-white font-medium font-[family-name:var(--font-body)]">30-day guarantee. <span className="text-[#3B82F6]">Zero risk.</span></div>
        </div>
                <div className="bg-black border border-[#1a1a1a] p-4">
                  <div className="text-[#666] mb-1 font-[family-name:var(--font-body)]">&quot;What if I waste money?&quot;</div>
                  <div className="text-white font-medium font-[family-name:var(--font-body)]">You&apos;ve wasted <span className="text-[#EF4444]">MORE</span> on courses.</div>
    </div>
                <div className="bg-black border border-[#1a1a1a] p-4">
                  <div className="text-[#666] mb-1 font-[family-name:var(--font-body)]">&quot;Am I ready?&quot;</div>
                  <div className="text-white font-medium font-[family-name:var(--font-body)]">You&apos;ll <span className="text-[#EF4444]">never</span> feel ready.</div>
                </div>
              </div>
            </div>

            {/* P.S. Section */}
            <div className="text-left space-y-4 text-sm text-[#666] font-[family-name:var(--font-body)]">
              <p>
                <span className="text-[#888] font-medium">P.S.</span> — Marcus was reading this exact page 7 months ago.
                He clicked. <span className="text-[#3B82F6]">Changed his life.</span> What did you do?
              </p>
              <p>
                <span className="text-[#888] font-medium">P.P.S.</span> — Your bank account will look the same tomorrow
                unless you <span className="text-[#EF4444]">DO SOMETHING TODAY</span>. This is that something.
              </p>
              <p>
                <span className="text-[#888] font-medium">P.P.P.S.</span> — <span className="text-[#EF4444]">{LICENSES_REMAINING} spots left.</span>
                {" "}By the time you &quot;think about it,&quot; they&apos;ll be gone.
              </p>
            </div>
          </div>
        </section>

        {/* ============ FOOTER ============ */}
        <footer className="py-12 px-6 pb-32 bg-black border-t border-[#1a1a1a]">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img src="/logo.png" alt="APEX Protocol™" width={40} height={40} />
                </div>
                <span className="text-lg font-bold text-white font-[family-name:var(--font-heading)]">APEX Protocol™</span>
              </div>

              {/* Trust Badges */}
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

            {/* Risk Disclaimers */}
            <div className="mb-8 p-6 border border-[#1a1a1a] bg-[#0a0a0a] space-y-4 text-xs text-[#666] font-[family-name:var(--font-body)] leading-relaxed">
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

            {/* Copyright */}
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
      </main>
    </>
  );
}
