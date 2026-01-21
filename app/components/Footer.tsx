"use client";

import Link from "next/link";

interface FooterProps {
  showDisclaimers?: boolean;
}

export default function Footer({ showDisclaimers = true }: FooterProps) {
  return (
    <footer className="border-t border-[#1a1a1a] bg-black">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {showDisclaimers && (
          <div className="mb-8 p-6 border border-[#1a1a1a] bg-[#0a0a0a] space-y-4 text-xs text-[#666] leading-relaxed">
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

            <p className="text-[#EF4444] font-semibold">
              By purchasing APEX Protocol™, you acknowledge that you have read, understood, and accepted all risks associated with forex trading and automated trading systems. You agree to use the software at your own risk.
            </p>
          </div>
        )}

        {/* Copyright & Links */}
        <div className="text-center text-xs text-[#444] space-y-2">
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
  );
}
