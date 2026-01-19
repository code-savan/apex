import { NextRequest, NextResponse } from "next/server";
import { getTransaction } from "../webhook/dodo/route";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id parameter" },
        { status: 400 }
      );
    }

    // Try to get transaction from our local storage first
    const transaction = await getTransaction(sessionId);

    if (transaction) {
      return NextResponse.json({
        success: true,
        transaction: {
          sessionId: transaction.sessionId,
          status: transaction.status,
          paymentStatus: transaction.paymentStatus,
          amount: transaction.amount,
          currency: transaction.currency,
          customerEmail: transaction.customerEmail,
          customerName: transaction.customerName,
          completedAt: transaction.completedAt,
          createdAt: transaction.createdAt,
        },
      });
    }

    // If not found locally, try to fetch from DodoPayments API
    if (process.env.DODO_PAYMENTS_API_KEY) {
      try {
        const dodoApiUrl = process.env.DODO_TEST_MODE === "true"
          ? `https://test.dodopayments.com/checkouts/${sessionId}`
          : `https://live.dodopayments.com/checkouts/${sessionId}`;

        const response = await fetch(dodoApiUrl, {
          headers: {
            Authorization: `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            success: true,
            transaction: {
              sessionId: data.id,
              status: data.payment_status === "paid" ? "completed" : "pending",
              paymentStatus: data.payment_status,
              amount: data.total_amount,
              currency: data.currency,
              customerEmail: data.customer?.email,
              customerName: data.customer?.name,
              completedAt: data.payment_status === "paid" ? data.updated_at : null,
              createdAt: data.created_at,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching from Dodo API:", error);
      }
    }

    // Transaction not found
    return NextResponse.json(
      {
        success: false,
        error: "Transaction not found",
        message: "The transaction may not have been processed yet, or the session ID is invalid.",
      },
      { status: 404 }
    );
  } catch (error) {
    console.error("Transaction status check error:", error);
    return NextResponse.json(
      { error: "Failed to check transaction status" },
      { status: 500 }
    );
  }
}
