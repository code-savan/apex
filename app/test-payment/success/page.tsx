"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Clock, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface TransactionData {
  sessionId: string;
  status: "completed" | "pending" | "failed";
  paymentStatus: string;
  amount: number;
  currency: string;
  customerEmail?: string;
  customerName?: string;
  completedAt?: string;
  createdAt?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactionStatus = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/transaction-status?session_id=${sessionId}`);
        const data = await response.json();

        if (data.success && data.transaction) {
          setTransaction(data.transaction);
        } else {
          setError(data.message || "Transaction not found");
        }
      } catch (err) {
        console.error("Error fetching transaction:", err);
        setError("Failed to load transaction status");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionStatus();

    // Poll for status updates every 3 seconds if pending
    const interval = setInterval(() => {
      if (sessionId && (!transaction || transaction.status === "pending")) {
        fetchTransactionStatus();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [sessionId, transaction]);

  const getStatusIcon = () => {
    if (loading) {
      return <Loader2 className="w-10 h-10 text-[#3B82F6] animate-spin" />;
    }

    switch (transaction?.status) {
      case "completed":
        return <CheckCircle2 className="w-10 h-10 text-[#10B981]" />;
      case "pending":
        return <Clock className="w-10 h-10 text-[#F59E0B]" />;
      case "failed":
        return <XCircle className="w-10 h-10 text-[#EF4444]" />;
      default:
        return <CheckCircle2 className="w-10 h-10 text-[#10B981]" />;
    }
  };

  const getStatusColor = () => {
    switch (transaction?.status) {
      case "completed":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "failed":
        return "#EF4444";
      default:
        return "#10B981";
    }
  };

  const getStatusText = () => {
    if (loading) return "Loading...";

    switch (transaction?.status) {
      case "completed":
        return "Payment Successful!";
      case "pending":
        return "Payment Pending";
      case "failed":
        return "Payment Failed";
      default:
        return "Payment Received";
    }
  };

  const getStatusDescription = () => {
    if (loading) return "Checking transaction status...";

    switch (transaction?.status) {
      case "completed":
        return "Your $1 test payment was processed successfully";
      case "pending":
        return "Your payment is being processed. This usually takes a few moments.";
      case "failed":
        return "Your payment could not be processed. Please try again.";
      default:
        return sessionId ? "Transaction details will appear once processed" : "Your payment has been received";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success Card */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden text-center">
          {/* Icon */}
          <div className="p-8 border-b border-[#1a1a1a]">
            <div className="flex justify-center mb-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: `${getStatusColor()}20` }}
              >
                {getStatusIcon()}
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">{getStatusText()}</h1>
            <p className="text-[#666]">{getStatusDescription()}</p>
          </div>

          {/* Details */}
          {!loading && transaction && (
            <div className="p-6 border-b border-[#1a1a1a]">
              <div className="bg-[#111] rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#666]">Amount</span>
                  <span className="font-bold">
                    {transaction.currency === "USD" ? "$" : ""}{(transaction.amount / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#666]">Payment Method</span>
                  <span className="font-bold">Card</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#666]">Status</span>
                  <span
                    className="font-bold capitalize"
                    style={{ color: getStatusColor() }}
                  >
                    {transaction.status}
                  </span>
                </div>
                {transaction.sessionId && (
                  <div className="flex justify-between text-sm pt-2 border-t border-[#222]">
                    <span className="text-[#666]">Transaction ID</span>
                    <span className="font-mono text-xs text-[#888]">
                      {transaction.sessionId.slice(0, 16)}...
                    </span>
                  </div>
                )}
                {transaction.completedAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666]">Completed At</span>
                    <span className="text-xs text-[#888]">
                      {new Date(transaction.completedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && !transaction && (
            <div className="p-6 border-b border-[#1a1a1a]">
              <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl p-4">
                <p className="text-sm text-[#EF4444]">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="p-6 border-b border-[#1a1a1a]">
              <div className="bg-[#111] rounded-xl p-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-[#3B82F6] animate-spin" />
                <span className="ml-3 text-sm text-[#666]">Loading transaction details...</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-6 space-y-3">
            <Link
              href="/test-payment"
              className="block w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-[#f0f0f0] transition-all text-center"
            >
              Test Another Payment
            </Link>
            <Link
              href="/"
              className="w-full bg-[#111] text-white font-semibold py-3 rounded-xl hover:bg-[#161616] transition-all flex items-center justify-center gap-2"
            >
              Back to Home
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Info Note */}
        {!loading && transaction?.status === "completed" && (
          <div className="mt-6 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl p-4">
            <p className="text-xs text-[#10B981] text-center">
              This was a real payment transaction. The $1 has been processed through DodoPayments.
            </p>
          </div>
        )}

        {!loading && transaction?.status === "pending" && (
          <div className="mt-6 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl p-4">
            <p className="text-xs text-[#F59E0B] text-center">
              Checking payment status... This page will update automatically.
            </p>
          </div>
        )}

        {!loading && !sessionId && (
          <div className="mt-6 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-xl p-4">
            <p className="text-xs text-[#3B82F6] text-center">
              No session ID provided. Return to payment page to start a new transaction.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TestPaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
