"use client";

import { useState } from "react";
import { Lock, User, Key, Mail, Phone, ArrowLeft, AlertCircle, Shield, Hash } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const ADMIN_EMAILS = [
  "support@apexprotocolsystem.com",
  "admin@apexprotocolsystem.com",
];

export default function ClientPortalPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    accountNumber: "",
    password: "",
  });

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    licenseKey: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsProcessing(true);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Always return incorrect details
    setError("Incorrect account number or password");
    setIsProcessing(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsProcessing(true);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Always return invalid license key
    setError("Invalid license key. Please check your purchase confirmation email.");
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
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
            <span className="text-sm text-[#888]">Secure Portal</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-12 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
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
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-white to-[#10B981] bg-clip-text text-transparent">Client Portal</h1>
          <p className="text-[#888]">Access your APEX dashboard</p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-1 shadow-lg">
          <button
            onClick={() => {
              setIsSignIn(true);
              setError("");
            }}
            className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
              isSignIn ? "bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-lg shadow-[#10B981]/50" : "text-[#666] hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsSignIn(false);
              setError("");
            }}
            className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
              !isSignIn ? "bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-lg shadow-[#10B981]/50" : "text-[#666] hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Forms Container */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6">
          {isSignIn ? (
            // Sign In Form
            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label className="block text-sm text-[#888] mb-2 font-medium">Account Number</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#444]" />
                  <input
                    type="text"
                    value={signInData.accountNumber}
                    onChange={(e) => setSignInData({ ...signInData, accountNumber: e.target.value })}
                    className="w-full bg-black border border-[#222] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-[#444] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all"
                    placeholder="Enter your account number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#888] mb-2 font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#444]" />
                  <input
                    type="password"
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    className="w-full bg-black border border-[#222] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-[#444] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#EF4444]">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-[#10B981]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>
          ) : (
            // Sign Up Form
            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#888] mb-2 font-medium">First Name</label>
                  <input
                    type="text"
                    value={signUpData.firstName}
                    onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                    className="w-full bg-black border border-[#222] rounded-xl px-4 py-3.5 text-white placeholder:text-[#444] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#888] mb-2 font-medium">Last Name</label>
                  <input
                    type="text"
                    value={signUpData.lastName}
                    onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                    className="w-full bg-black border border-[#222] rounded-xl px-4 py-3.5 text-white placeholder:text-[#444] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#888] mb-2 font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#444]" />
                  <input
                    type="email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    className="w-full bg-black border border-[#222] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-[#444] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#888] mb-2 font-medium">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#444]" />
                  <input
                    type="tel"
                    value={signUpData.phone}
                    onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                    className="w-full bg-black border border-[#222] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-[#444] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#888] mb-2 font-medium">License Key</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#444]" />
                  <input
                    type="text"
                    value={signUpData.licenseKey}
                    onChange={(e) => setSignUpData({ ...signUpData, licenseKey: e.target.value })}
                    className="w-full bg-black border border-[#222] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-[#444] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all font-mono"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    required
                  />
                </div>
                <p className="text-xs text-[#666] mt-2">Found in your purchase confirmation email</p>
              </div>

              <div>
                <label className="block text-sm text-[#888] mb-2 font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#444]" />
                  <input
                    type="password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    className="w-full bg-black border border-[#222] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-[#444] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all"
                    placeholder="Create a password"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#888] mb-2 font-medium">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#444]" />
                  <input
                    type="password"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                    className="w-full bg-black border border-[#222] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-[#444] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#EF4444]">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-[#10B981]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#666]">
            Need help? <Link href="/support" className="text-[#10B981] hover:underline cursor-pointer">Contact Support</Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-8 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Contact Info */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-white mb-3">Support Contacts</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {ADMIN_EMAILS.map((email, index) => (
                <a
                  key={index}
                  href={`mailto:${email}`}
                  className="text-[#10B981] hover:text-[#059669] transition-colors text-sm font-medium cursor-pointer"
                >
                  {email}
                </a>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="border-t border-[#1a1a1a] pt-6">
            <p className="text-xs text-[#666] text-center max-w-2xl mx-auto leading-relaxed">
              <span className="font-semibold text-[#888]">Risk Disclaimer:</span> Trading forex and other financial instruments involves substantial risk of loss and is not suitable for all investors. Past performance is not indicative of future results. APEX Protocol™ is an automated trading system. No trading system is guaranteed to be profitable. Only trade with money you can afford to lose.
            </p>
          </div>

          {/* Copyright */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#444]">
              © {new Date().getFullYear()} APEX Protocol™. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
