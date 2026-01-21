"use client";

import { useState } from "react";
import { Mail, Clock, ArrowLeft, Shield, HelpCircle, ChevronDown, ChevronUp, Zap, DollarSign, Settings, Users, AlertTriangle, Laptop } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Footer from "../components/Footer";

const ADMIN_EMAILS = [
  { email: "support@apexprotocolsystem.com", type: "General Support" },
  { email: "admin@apexprotocolsystem.com", type: "Admin & Technical" },
];

// FAQ data organized by category
const faqCategories = [
  {
    name: "Getting Started",
    icon: Zap,
    color: "#3B82F6",
    faqs: [
      {
        question: "How do I set up APEX Protocol™?",
        answer: "After purchase, you'll receive an email with your license key and a link to our 23-minute setup video. The video walks you through everything: downloading the bot, installing it on MT4/MT5, configuring the settings, and activating your license. Most users are up and running within 30 minutes."
      },
      {
        question: "Which brokers does APEX work with?",
        answer: "APEX Protocol™ works with any broker that supports MT4 or MT5. We recommend brokers with low spreads, fast execution, and reliable uptime. Popular choices include IC Markets, Pepperstone, and OANDA. We're not affiliated with any broker, so you're free to choose the one that works best for you."
      },
      {
        question: "Do I need a VPS?",
        answer: "For best results, yes. A VPS (Virtual Private Server) keeps your trading platform running 24/7 with stable internet, which is crucial for automated trading. You can use services like ForexVPS or Amazon Lightsail for around $10-30/month. However, you can also run APEX on your home computer if you keep it on during market hours."
      },
      {
        question: "What's the minimum account size?",
        answer: "We recommend starting with at least $500-1,000 for the Starter Protocol and $1,000-5,000 for Elite. While the bot can technically work with smaller amounts, having adequate capital allows for proper position sizing and better risk management. Remember: only trade with money you can afford to lose."
      },
      {
        question: "How long does the setup take?",
        answer: "The average setup time is about 23 minutes following our video guide. This includes downloading MT4/MT5, installing the APEX bot, entering your license key, and configuring your settings. Elite members can also book a 30-minute personal onboarding call for hands-on assistance."
      }
    ]
  },
  {
    name: "Performance & Results",
    icon: DollarSign,
    color: "#10B981",
    faqs: [
      {
        question: "What returns can I expect?",
        answer: "We cannot guarantee specific returns — that would be irresponsible. Forex trading involves substantial risk. What we can say is that our Neural Adaptive Engine is designed to identify high-probability setups and manage risk dynamically. Results vary based on account size, market conditions, broker quality, and leverage used. Always use proper risk management."
      },
      {
        question: "This sounds too good to be true.",
        answer: "We get it — you've probably been burned by 'get rich quick' schemes before. That's exactly why we offer a 30-day money-back guarantee. Run it on a demo account first. Test it. Try to prove it wrong. If it doesn't meet your expectations, get a full refund. We're confident because we've spent years developing and testing APEX."
      },
      {
        question: "What about the people who don't succeed?",
        answer: "Real talk: about 8-12% of users don't see the results they expected. Why? Most common reasons: they never actually turn it on (fear), they use accounts under $500, they override the bot manually, they turn it off after 2 losing trades, or they use brokers with terrible execution. Follow the setup guide, use adequate capital, and let it run — that's the formula."
      },
      {
        question: "How does APEX handle losing trades?",
        answer: "No trading system wins 100% of the time. APEX uses predictive risk management to minimize losses when market conditions turn unfavorable. It dynamically adjusts position sizes, tightens stop losses during volatility, and can pause trading during major news events. The goal isn't to never lose — it's to ensure winners outweigh losers over time."
      },
      {
        question: "Is past performance shown on the website real?",
        answer: "All testimonials and results shown are from real users who agreed to share their experiences. However, past performance is NOT indicative of future results. Individual results vary significantly based on account size, broker, market conditions, and risk settings. We include this disclaimer because it's both legally required and genuinely true."
      }
    ]
  },
  {
    name: "Technical Questions",
    icon: Settings,
    color: "#F59E0B",
    faqs: [
      {
        question: "What is the Neural Adaptive Engine?",
        answer: "The Neural Adaptive Engine is the core of APEX Protocol™. Unlike simple indicator-based bots, it uses pattern recognition to analyze market microstructure, adapts its strategy based on current volatility regimes, and adjusts risk parameters in real-time. Think of it as the difference between a thermostat and a climate control AI."
      },
      {
        question: "Can I run APEX on multiple accounts?",
        answer: "Yes! Your license allows unlimited use on your own MT4/MT5 accounts. You can run it on multiple broker accounts simultaneously. However, you cannot share or resell your license key to others."
      },
      {
        question: "What timeframes does APEX trade?",
        answer: "APEX primarily operates on M15 and H1 timeframes, but it analyzes multiple timeframes for confluence. The bot handles timeframe analysis automatically — you don't need to configure this. It's optimized for forex majors (EUR/USD, GBP/USD, USD/JPY, etc.) but can be used on other pairs."
      },
      {
        question: "Do I get updates?",
        answer: "Yes, all purchases include FREE lifetime algorithm updates. We continuously improve APEX based on market evolution, user feedback, and new machine learning techniques. Updates are delivered automatically or via email notification. You'll never pay extra for improvements."
      },
      {
        question: "What if the bot stops working or has errors?",
        answer: "First, check our setup guide for common solutions. Most issues are connection-related (VPS/internet) or broker-specific. If problems persist, contact support with your license key and error details. We typically resolve technical issues within 2-6 hours. Elite members get priority support with 90-minute response times."
      }
    ]
  },
  {
    name: "Pricing & Payments",
    icon: DollarSign,
    color: "#8B5CF6",
    faqs: [
      {
        question: "What's the difference between Starter and Elite?",
        answer: "Starter ($499) includes the full APEX bot, APEX Scalper for smaller accounts, setup video, Discord access, and email support. Elite ($999) adds the high-capital APEX Scalper ($100K+), a personal 30-minute onboarding call, advanced configuration presets, priority support (90-min response), monthly strategy sessions, and VIP Discord access."
      },
      {
        question: "Is this a one-time payment or subscription?",
        answer: "One-time payment. No monthly fees, no recurring charges, no hidden costs. You pay once and own APEX Protocol™ forever, including all future updates. We believe if our product is good, you shouldn't have to keep paying for it."
      },
      {
        question: "Why is crypto cheaper?",
        answer: "Crypto payments save us payment processing fees (typically 3-5% for cards). We pass those savings directly to you. Plus, crypto transactions are faster and more secure. It's a win-win."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit/debit cards (Visa, Mastercard, Amex) and cryptocurrencies (Bitcoin, Ethereum, USDT, Solana, Litecoin). For cards, payments are processed securely through our payment provider."
      },
      {
        question: "What's your refund policy?",
        answer: "We offer a 30-day money-back guarantee, no questions asked. If you're not satisfied for any reason, email support@apexprotocolsystem.com with your order details and we'll process your refund within 5-7 business days. See our full Refund Policy for details."
      }
    ]
  },
  {
    name: "Risk & Safety",
    icon: AlertTriangle,
    color: "#EF4444",
    faqs: [
      {
        question: "Can I lose money using APEX?",
        answer: "Yes. All trading involves risk, and forex trading is particularly volatile. You can lose some or all of your invested capital. APEX is designed to minimize risk through smart position sizing and dynamic stop losses, but no system can eliminate risk entirely. Only trade with money you can afford to lose."
      },
      {
        question: "Is APEX a scam?",
        answer: "No. We're a legitimate software company with real customers, real support, and a real product. We don't promise guaranteed returns (that would be a red flag). We offer a 30-day money-back guarantee so you can test APEX risk-free. Check our testimonials, join our Discord, and verify for yourself."
      },
      {
        question: "Is my money safe with the bot?",
        answer: "APEX never has direct access to your funds. It only sends trading signals to your MT4/MT5 platform, which executes trades through your broker. Your money stays with your broker at all times. We recommend using regulated brokers for additional protection."
      },
      {
        question: "What if there's a flash crash or major news event?",
        answer: "APEX includes volatility detection that can pause trading during extreme conditions. It also uses maximum drawdown limits to prevent catastrophic losses. However, in truly extreme events (like the 2015 Swiss Franc flash crash), no system is completely protected. This is why we emphasize proper risk management and not over-leveraging."
      }
    ]
  },
  {
    name: "Account & Support",
    icon: Users,
    color: "#EC4899",
    faqs: [
      {
        question: "I lost my license key. How do I recover it?",
        answer: "Email support@apexprotocolsystem.com with your purchase email and order confirmation (or PayPal/card receipt). We'll verify your purchase and resend your license key within a few hours."
      },
      {
        question: "How do I join the Discord community?",
        answer: "Your purchase confirmation email includes a private Discord invite link. Click it to join our community of 400+ traders. If you can't find the link, email support and we'll send a new one."
      },
      {
        question: "How fast is your support?",
        answer: "Starter members: We respond to emails within 6 hours during business days. Elite members: Priority support with responses under 90 minutes. For urgent technical issues, we often respond much faster."
      },
      {
        question: "Can I upgrade from Starter to Elite?",
        answer: "Yes! Email support@apexprotocolsystem.com and we'll provide you with an upgrade link. You'll only pay the difference between packages."
      },
      {
        question: "Do you offer training or education?",
        answer: "All packages include the 23-minute setup video. Elite members get access to monthly live strategy sessions where we discuss market conditions, optimal settings, and advanced techniques. Our Discord also has an active community sharing tips and experiences."
      }
    ]
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#1a1a1a] last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left hover:bg-[#0a0a0a]/50 transition-colors px-2 -mx-2 rounded"
      >
        <span className="font-medium text-white pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-[#888] shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#888] shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-[#888] text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function SupportPage() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#3B82F6] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#10B981] rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-[#1a1a1a] relative z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#888] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#10B981]" />
            <span className="text-sm text-[#888]">Support Center</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#3B82F6]/20 to-[#10B981]/20 rounded-2xl flex items-center justify-center border border-[#10B981]/50 shadow-lg shadow-[#10B981]/20">
              <Image
                src="/logo.png"
                alt="APEX"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white to-[#10B981] bg-clip-text text-transparent">
            How Can We Help?
          </h1>
          <p className="text-[#888] text-lg">
            Find answers to common questions or contact our support team
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {ADMIN_EMAILS.map((contact, index) => (
            <div key={index} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#10B981]/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#10B981]/20 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-[#10B981]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{contact.type}</h3>
                  <p className="text-sm text-[#666] mb-3">Get help via email</p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-[#10B981] hover:text-[#059669] font-medium text-sm cursor-pointer inline-flex items-center gap-2"
                  >
                    {contact.email}
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Response Time */}
        <div className="bg-gradient-to-r from-[#3B82F6]/10 to-[#10B981]/10 border border-[#10B981]/30 rounded-2xl p-6 mb-12">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-[#10B981]" />
            <h3 className="text-lg font-bold text-white">Response Time</h3>
          </div>
          <p className="text-[#aaa]">
            We typically respond within <span className="text-[#10B981] font-semibold">6 hours</span> for general inquiries and <span className="text-[#10B981] font-semibold">2 hours</span> for technical issues. Elite members receive priority support with responses under 90 minutes.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-8 h-8 text-[#3B82F6]" />
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {faqCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <button
                  key={index}
                  onClick={() => setActiveCategory(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activeCategory === index
                      ? "bg-white text-black"
                      : "bg-[#111] text-[#888] hover:bg-[#1a1a1a] hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" style={{ color: activeCategory === index ? "black" : category.color }} />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* FAQ Content */}
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              {(() => {
                const Icon = faqCategories[activeCategory].icon;
                return <Icon className="w-6 h-6" style={{ color: faqCategories[activeCategory].color }} />;
              })()}
              <h3 className="text-xl font-bold text-white">{faqCategories[activeCategory].name}</h3>
            </div>

            <div className="divide-y divide-[#1a1a1a]">
              {faqCategories[activeCategory].faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>

        {/* Still Need Help */}
        <div className="text-center bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-3">Still have questions?</h3>
          <p className="text-[#888] mb-6">Can&apos;t find what you&apos;re looking for? Our support team is here to help.</p>
          <a
            href="mailto:support@apexprotocolsystem.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#10B981]/50 transition-all"
          >
            <Mail className="w-5 h-5" />
            Contact Support
          </a>
        </div>
      </main>

      <Footer showDisclaimers={false} />
    </div>
  );
}
