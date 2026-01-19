import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Simple file-based storage for transaction statuses
const TRANSACTIONS_DIR = path.join(process.cwd(), ".transactions");

async function ensureTransactionsDir() {
  if (!existsSync(TRANSACTIONS_DIR)) {
    await mkdir(TRANSACTIONS_DIR, { recursive: true });
  }
}

async function saveTransaction(sessionId: string, data: any) {
  await ensureTransactionsDir();
  const filePath = path.join(TRANSACTIONS_DIR, `${sessionId}.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function getTransaction(sessionId: string) {
  try {
    const filePath = path.join(TRANSACTIONS_DIR, `${sessionId}.json`);
    if (!existsSync(filePath)) {
      return null;
    }
    const data = await readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading transaction:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Webhook received:", {
      event: body.event_type,
      sessionId: body.data?.id,
      status: body.data?.payment_status,
    });

    // Verify webhook signature if you have a webhook secret
    // const signature = request.headers.get("x-dodo-signature");
    // if (!verifySignature(body, signature)) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }

    const eventType = body.event_type;
    const checkoutData = body.data;

    if (!checkoutData?.id) {
      console.error("No checkout ID in webhook data");
      return NextResponse.json({ error: "Invalid webhook data" }, { status: 400 });
    }

    // Handle different event types
    switch (eventType) {
      case "checkout.completed":
      case "payment.succeeded":
        await saveTransaction(checkoutData.id, {
          sessionId: checkoutData.id,
          status: "completed",
          paymentStatus: checkoutData.payment_status || "paid",
          amount: checkoutData.total_amount || checkoutData.amount,
          currency: checkoutData.currency || "USD",
          customerEmail: checkoutData.customer?.email,
          customerName: checkoutData.customer?.name,
          metadata: checkoutData.metadata,
          completedAt: new Date().toISOString(),
          eventType,
        });
        console.log("Payment completed:", checkoutData.id);
        break;

      case "checkout.created":
        await saveTransaction(checkoutData.id, {
          sessionId: checkoutData.id,
          status: "pending",
          paymentStatus: checkoutData.payment_status || "pending",
          amount: checkoutData.total_amount || checkoutData.amount,
          currency: checkoutData.currency || "USD",
          customerEmail: checkoutData.customer?.email,
          customerName: checkoutData.customer?.name,
          metadata: checkoutData.metadata,
          createdAt: new Date().toISOString(),
          eventType,
        });
        console.log("Checkout created:", checkoutData.id);
        break;

      case "payment.failed":
        await saveTransaction(checkoutData.id, {
          sessionId: checkoutData.id,
          status: "failed",
          paymentStatus: "failed",
          amount: checkoutData.total_amount || checkoutData.amount,
          currency: checkoutData.currency || "USD",
          customerEmail: checkoutData.customer?.email,
          customerName: checkoutData.customer?.name,
          metadata: checkoutData.metadata,
          failedAt: new Date().toISOString(),
          eventType,
        });
        console.log("Payment failed:", checkoutData.id);
        break;

      default:
        console.log("Unhandled webhook event:", eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
