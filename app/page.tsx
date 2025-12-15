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
} from "lucide-react";


// ============ CONSTANTS ============
const LICENSES_TOTAL = 500;
const LICENSES_SOLD = 481;
const LICENSES_REMAINING = LICENSES_TOTAL - LICENSES_SOLD;

// ============ COMPONENTS ============

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

// Testimonial Card Component
function TestimonialCard({
  name,
  handle,
  avatar,
  quote,
  startAmount,
  currentAmount,
  duration
}: {
  name: string;
  handle: string;
  avatar: string;
  quote: string;
  startAmount: string;
  currentAmount: string;
  duration: string;
}) {
  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 card-hover">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6]/20 to-[#EF4444]/20 border border-[#1a1a1a] flex items-center justify-center text-white font-bold font-[family-name:var(--font-heading)]">
          {avatar}
        </div>
        <div>
          <div className="font-semibold text-white font-[family-name:var(--font-heading)]">{name}</div>
          <div className="text-sm text-[#3B82F6] font-[family-name:var(--font-body)]">{handle}</div>
        </div>
        <div className="ml-auto flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#3B82F6] text-[#3B82F6]" />
          ))}
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
}: {
  tier: string;
  price: string;
  cryptoPrice: string;
  cryptoSavings: string;
  features: string[];
  bonuses?: { title: string; value: string }[];
  isPopular?: boolean;
  ctaText: string;
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
          <div className="mt-2 text-sm text-[#888] font-[family-name:var(--font-body)]">
            or <span className="text-[#3B82F6] font-medium">{cryptoPrice}</span> with crypto <span className="text-[#666]">(save {cryptoSavings})</span>
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

        <button className="w-full py-4 font-semibold text-sm transition-all btn-primary font-[family-name:var(--font-heading)]">
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

// Sticky CTA Bar
function StickyCTABar({ isVisible }: { isVisible: boolean }) {
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${isVisible ? "translate-y-0" : "translate-y-full"}`}>
      <div className="bg-black border-t border-[#1a1a1a] px-4 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="text-sm font-[family-name:var(--font-body)]">
              <span className="text-[#666]">Only </span>
              <span className="text-[#EF4444] font-semibold">{LICENSES_REMAINING} spots</span>
              <span className="text-[#666]"> remaining</span>
            </div>
          </div>
          <button className="btn-primary px-8 py-3 font-semibold text-sm font-[family-name:var(--font-heading)]">
            Get Instant Access
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN PAGE COMPONENT ============
export default function Home() {
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Handle scroll for sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setShowStickyCTA(heroBottom < 0);
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
                  onClick={() => setShowExitPopup(false)}
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
        <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center gradient-hero">
          {/* Animated gradient orbs */}
          <div className="orb-blue" style={{ top: "-10%", left: "-10%" }} />
          <div className="orb-red" style={{ bottom: "10%", right: "-5%" }} />
          <div className="orb-purple" style={{ top: "40%", right: "20%" }} />

          {/* Header */}
          <header className="absolute top-0 left-0 right-0 z-20">
            <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src="/logo.png" alt="APEX Protocol™" width={30} height={30} />
                </div>
                <span className="text-xl font-bold text-white font-[family-name:var(--font-heading)] opacity-80">APEX Protocol™</span>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm font-[family-name:var(--font-body)]">
                  <div className="w-2 h-2 bg-[#EF4444] rounded-full animate-pulse-soft" />
                  <span className="text-[#888]"><span className="text-[#EF4444]">{LICENSES_REMAINING}</span> spots left</span>
                </div>
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-[1.1] font-[family-name:var(--font-heading)]">
              You&apos;re Being <span className="text-[#3B82F6]">Lied To.</span>
              <br />
              <span className="text-[#666]">And You Know It.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-[#888] max-w-2xl mx-auto mb-10 leading-relaxed font-[family-name:var(--font-body)]">
              Every guru. Every course. Every &quot;follow my signals&quot; Telegram channel.
              They&apos;re selling you the <span className="text-[#EF4444] font-medium">same broken dream.</span>
            </p>

            {/* CTA Button */}
            <button className="btn-primary px-10 py-4 font-semibold text-base mb-8 font-[family-name:var(--font-heading)]">
              Get Instant Access
            </button>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm font-[family-name:var(--font-body)]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-[#888]"><span className="text-white font-medium">400+</span> Profitable Traders</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-[#888]"><span className="text-white font-medium">14</span> Currency Pairs</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-[#888]"><span className="text-white font-medium">24/7</span> Automated</span>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <ChevronDown className="w-6 h-6 text-[#444] animate-bounce" />
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
                I&apos;m not being dramatic. I&apos;m being honest.
              </p>
              <p>
                I was sitting in my 2004 Honda Civic in a Walmart parking lot at 11 PM, engine running, heat blasting because I couldn&apos;t afford to heat my apartment.
              </p>
              <p>
                My phone was blowing up. Texts I couldn&apos;t answer:
              </p>

              {/* Text Messages */}
              <div className="space-y-2 pl-4 border-l-2 border-[#333] my-8">
                <p className="text-[#888] italic">&quot;Hey man, can you get me back that $500?&quot;</p>
                <p className="text-[#888] italic">&quot;Dude where&apos;s my money&quot;</p>
                <p className="text-[#888] italic">&quot;You said 2 weeks ago...&quot;</p>
              </div>

              <p>
                I&apos;d borrowed from six different friends. Told them all the same lie: <span className="text-[#888] italic">&quot;I&apos;m onto something. Just need a bit more capital. I&apos;ll pay you back triple.&quot;</span>
              </p>
              <p>
                <span className="text-white font-semibold">I believed it too. That&apos;s the fucked up part.</span>
              </p>

              {/* Account Balance */}
              <div className="border border-[#EF4444]/30 bg-[#EF4444]/5 p-6 my-8 text-center">
                <p className="text-[#888] mb-2 font-[family-name:var(--font-body)]">My account balance that night?</p>
                <p className="text-4xl font-bold text-[#EF4444] font-[family-name:var(--font-heading)]">$47</p>
                <p className="text-[#666] mt-2 text-sm">Started the year with $23,000. My entire savings.</p>
              </div>

              <p>
                Every dollar from my college fund that my grandma left me when she died. <span className="text-[#EF4444] font-semibold">Gone.</span>
              </p>
              <p>
                But that&apos;s not even the worst part.
              </p>

              {/* The Pregnancy Test */}
              <div className="border-t border-b border-[#1a1a1a] py-8 my-8">
                <p className="mb-4">
                  Two weeks earlier, my girlfriend—my fiancée actually—sat me down at our kitchen table. She&apos;d been crying. I could tell because her mascara was smudged.
                </p>
                <p className="mb-4">
                  She slid a piece of paper across the table.
                </p>
                <p className="text-white font-semibold text-lg mb-4">
                  It was a pregnancy test. Positive.
                </p>
                <p className="mb-4">
                  I should&apos;ve been happy. Terrified but happy.
                </p>
                <p>
                  Instead, I felt nothing but <span className="text-[#EF4444]">shame</span>.
                </p>
              </div>

              <p>
                Because I knew—I KNEW—I&apos;d just lost the <span className="text-white font-semibold">$4,200</span> in our &quot;baby fund&quot; that morning on a revenge trade.
              </p>
              <p>
                GBP/USD. I was &quot;sure&quot; it would bounce. Put in 5 lots. My hands were shaking when I clicked. It dropped 140 pips in 30 minutes.
              </p>

              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 my-8 text-center">
                <p className="text-[#EF4444] font-bold text-xl font-[family-name:var(--font-heading)]">$4,200 gone.</p>
                <p className="text-[#666] mt-2 text-sm">The money we&apos;d been saving for two years for when we started a family.</p>
                <p className="text-white mt-2 font-medium">Evaporated in 30 minutes because I &quot;had a feeling.&quot;</p>
              </div>

              <p>
                She didn&apos;t know yet. I couldn&apos;t tell her.
              </p>
              <p>
                So I smiled. Hugged her. Told her <span className="text-[#888] italic">&quot;Everything&apos;s going to be okay.&quot;</span>
              </p>
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
                I pulled up my trading journal.
              </p>

              {/* Trading Stats */}
              <div className="grid grid-cols-2 gap-4 my-8">
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 text-center">
                  <p className="text-3xl font-bold text-white font-[family-name:var(--font-heading)]">387</p>
                  <p className="text-[#666] text-sm">trades over 11 months</p>
                </div>
                <div className="bg-[#0a0a0a] border border-[#EF4444]/30 p-4 text-center">
                  <p className="text-3xl font-bold text-[#EF4444] font-[family-name:var(--font-heading)]">43%</p>
                  <p className="text-[#666] text-sm">win rate</p>
                </div>
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 text-center">
                  <p className="text-xl font-bold text-[#3B82F6] font-[family-name:var(--font-heading)]">$340</p>
                  <p className="text-[#666] text-sm">average winner</p>
                </div>
                <div className="bg-[#0a0a0a] border border-[#EF4444]/30 p-4 text-center">
                  <p className="text-xl font-bold text-[#EF4444] font-[family-name:var(--font-heading)]">$890</p>
                  <p className="text-[#666] text-sm">average loser</p>
                </div>
              </div>

              <p>
                I wasn&apos;t just bad at trading. <span className="text-white font-semibold">I was systematically destroying my life.</span>
              </p>

              <div className="space-y-2 my-8">
                <p className="text-[#888]">Every rule I set, I broke.</p>
                <p className="text-[#888]">Every stop loss I placed, I moved.</p>
                <p className="text-[#888]">Every time I said &quot;just one trade,&quot; I took seven more.</p>
              </div>

              <p>
                I pulled up my browser history. It was pathetic:
              </p>

              {/* Browser History */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 my-8 font-mono text-sm space-y-1">
                <p className="text-[#666]">&quot;How to recover from trading losses&quot;</p>
                <p className="text-[#666]">&quot;Forex comeback strategy&quot;</p>
                <p className="text-[#666]">&quot;Best indicators for reversals&quot;</p>
                <p className="text-[#666]">&quot;Is forex gambling&quot;</p>
                <p className="text-[#EF4444]">&quot;How to tell your partner you lost money&quot;</p>
              </div>

              <p className="text-white font-semibold">
                The last search made me put my head on the steering wheel and just... break.
              </p>
              <p>
                I wasn&apos;t a trader. I was a gambling addict who&apos;d convinced himself he was &quot;building a skill.&quot;
              </p>
              <p>
                I sat there for 3 hours. Thought about just... driving. Somewhere. Anywhere. Disappearing.
              </p>
              <p>
                My phone buzzed.
              </p>

              {/* Sarah's Text */}
              <div className="border border-[#3B82F6]/30 bg-[#3B82F6]/5 p-6 my-8 text-center">
                <p className="text-[#666] text-sm mb-2">Text from Sarah (my fiancée):</p>
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
                Not because it was profound. Because it was <span className="text-white font-semibold">simple.</span>
              </p>
              <p>
                She still loved me. Even though I was a failure. Even though I&apos;d destroyed everything.
              </p>
              <p className="text-white font-semibold text-lg">
                I decided right there: One more shot. But different.
              </p>

              <div className="space-y-2 my-8 text-[#888]">
                <p>Not another course.</p>
                <p>Not another &quot;system.&quot;</p>
                <p>Not another YouTube guru promising 90% win rates.</p>
              </div>

              <p className="text-xl text-white font-semibold text-center py-8 border-t border-b border-[#1a1a1a]">
                I needed to remove <span className="text-[#EF4444]">MYSELF</span> from the equation.
              </p>

              <h3 className="text-xl font-bold text-white mt-12 mb-6 font-[family-name:var(--font-heading)]">
                THREE WEEKS OF OBSESSIVE RESEARCH.
              </h3>

              <p>
                I stopped trading completely. Just researched.
              </p>
              <p>
                I found a paper from MIT about algorithmic trading psychology. The researcher found that <span className="text-white font-semibold">human traders underperform their own rule-based systems by 34% on average.</span>
              </p>
              <p>
                Not because the systems were smarter. Because humans can&apos;t follow their own rules.
              </p>
              <p className="text-white font-medium">
                Our emotions override logic <span className="text-[#EF4444]">every single time</span> when money is involved.
              </p>
              <p>
                I read about hedge funds. How they don&apos;t have &quot;traders&quot; anymore—they have <span className="text-[#3B82F6]">systems</span>.
              </p>
              <p>
                I learned about Renaissance Technologies. $130 BILLION managed entirely by algorithms. <span className="text-white font-semibold">The most profitable hedge fund in history.</span>
              </p>
              <p>
                Not because they had better &quot;strategies.&quot; <span className="text-white font-semibold">Because they removed human emotion from trading.</span>
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
                Borrowed more money (I know, stupid).
              </p>
              <p>
                Hired three freelance developers from Eastern Europe. Worked with a quant analyst from Singapore I found on Reddit.
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
                JANUARY 2020. DEMO ACCOUNT TEST.
              </h3>

              <p>
                $10,000 virtual dollars. Let it run for 60 days. I didn&apos;t touch it. Didn&apos;t override. Just watched.
              </p>

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
                SAME. EXACT. RULES.
              </p>

              <p>
                The difference? The bot didn&apos;t:
              </p>

              <div className="space-y-2 my-6">
                {[
                  "Exit winners early out of fear",
                  "Hold losers hoping they'd \"come back\"",
                  "Revenge trade after losses",
                  "Overtrade when confident",
                  "Freeze on perfect setups",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-[#888]">
                    <XCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <p className="text-white font-semibold">
                It just... traded.
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
                That&apos;s all I had left after paying back some debt.
              </p>
              <p>
                Sarah didn&apos;t know. She thought I&apos;d quit trading.
              </p>
              <p>
                I turned on the bot and <span className="text-white font-semibold">didn&apos;t look at my phone for 3 days.</span>
              </p>
              <p>
                When I finally checked...
              </p>

              <div className="border border-[#3B82F6]/30 bg-[#3B82F6]/5 p-8 my-8 text-center">
                <p className="text-5xl font-bold text-[#3B82F6] font-[family-name:var(--font-heading)]">$1,340</p>
              </div>

              <p>
                I stared at my phone for 10 minutes thinking it was a glitch.
              </p>
              <p>
                Called my broker. <span className="text-[#888] italic">&quot;Is this real?&quot;</span>
              </p>
              <p>
                <span className="text-[#888] italic">&quot;Yes sir, your account balance is $1,340.&quot;</span>
              </p>
              <p className="text-white font-semibold">
                I sat on the floor of my bathroom and cried.
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
              <p className="text-[#888] max-w-2xl mx-auto font-[family-name:var(--font-body)] leading-relaxed">
                A neural adaptive system that thinks faster than you, reacts faster than you,
                and executes <span className="text-white font-medium">without the psychological baggage</span> destroying your account.
              </p>
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
              <TestimonialCard
                name="Tyler M."
                handle="@TylerM_Trades"
                avatar="TM"
                quote="I'm a construction worker. I literally don't understand forex. I just turned it on and checked my phone once a day. This is life-changing."
                startAmount="$2,400"
                currentAmount="$18,900"
                duration="7 months"
              />
              <TestimonialCard
                name="Kim C."
                handle="@CryptoKim"
                avatar="KC"
                quote="I was about to quit. Blown 3 accounts. My husband said 'one more time and we're done.' Two months later I showed him the account. He cried."
                startAmount="$5,000"
                currentAmount="$47,300"
                duration="11 months"
              />
              <TestimonialCard
                name="Jordan B."
                handle="@JordanTheBarber"
                avatar="JB"
                quote="Bro I cut hair. That's it. I don't know candlesticks or nothing. Now I'm buying a HOUSE. Not renting. BUYING."
                startAmount="$800"
                currentAmount="$9,400"
                duration="5 months"
              />
              <TestimonialCard
                name="Alex R."
                handle="@StudentDebtFree"
                avatar="AR"
                quote="I'm 24. $87K in student loans. I was working 3 jobs. Now I work ONE because APEX is basically my second income. Paid off $34K in debt."
                startAmount="$3,200"
                currentAmount="$31,100"
                duration="9 months"
              />
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
        <section className="py-20 px-6 bg-[#050505] gradient-section">
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
                  "23-Min Setup Video",
                  "Monthly Algorithm Updates (FREE forever)",
                  "Private Discord (400+ traders)",
                  "Email Support (under 6 hours)",
                  "30-Day Money-Back Guarantee",
                ]}
                ctaText="Get Starter Access"
              />
              <PricingCard
                tier="Elite Mastery Bundle"
                price="$999"
                cryptoPrice="$799"
                cryptoSavings="$200"
                features={[
                  "Everything in Starter, plus:",
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
            <button className="btn-primary px-12 py-4 font-semibold text-base mb-8 font-[family-name:var(--font-heading)]">
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
        <footer className="py-12 px-6 bg-black border-t border-[#1a1a1a]">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white flex items-center justify-center">
                  <Zap className="w-5 h-5 text-black" />
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

            {/* Copyright */}
            <div className="text-center text-xs text-[#444] font-[family-name:var(--font-body)]">
              <p className="mb-2">© {new Date().getFullYear()} APEX Protocol™. All rights reserved.</p>
              <p>
                Trading involves significant risk. Past performance does not guarantee future results.
                Always trade responsibly and only with capital you can afford to lose.
              </p>
            </div>
        </div>
        </footer>
      </main>
    </>
  );
}
