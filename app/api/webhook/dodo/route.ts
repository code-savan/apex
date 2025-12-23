import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";

// Initialize webhook verifier only if key is available
const getWebhook = () => {
  const key = process.env.DODO_WEBHOOK_KEY;
  if (!key) return null;
  return new Webhook(key);
};

interface WebhookPayload {
  type: string;
  data: {
    payment_id: string;
    status: string;
    customer: {
      email: string;
      name: string;
    };
    metadata?: {
      package_id?: string;
      package_name?: string;
    };
    amount: {
      value: number;
      currency: string;
    };
  };
}

const packages: Record<string, { name: string; price: number }> = {
  starter: { name: "Starter Protocol", price: 499 },
  elite: { name: "Elite Mastery Bundle", price: 999 },
};

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    const webhookHeaders = {
      "webhook-id": request.headers.get("webhook-id") || "",
      "webhook-signature": request.headers.get("webhook-signature") || "",
      "webhook-timestamp": request.headers.get("webhook-timestamp") || "",
    };

    // Verify webhook signature
    const webhook = getWebhook();
    if (webhook) {
      try {
        await webhook.verify(rawBody, webhookHeaders);
      } catch (err) {
        console.error("Webhook verification failed:", err);
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 401 }
        );
      }
    } else {
      console.warn("Webhook verification skipped - DODO_WEBHOOK_KEY not configured");
    }

    const payload = JSON.parse(rawBody) as WebhookPayload;

    // Handle different webhook events
    switch (payload.type) {
      case "payment.succeeded":
        await handlePaymentSucceeded(payload);
        break;

      case "payment.failed":
        console.log("Payment failed:", payload.data.payment_id);
        break;

      default:
        console.log("Unhandled webhook type:", payload.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentSucceeded(payload: WebhookPayload) {
  const { customer, metadata, amount } = payload.data;

  const packageId = metadata?.package_id || "starter";
  const selectedPackage = packages[packageId] || packages.starter;

  // Extract first name from full name
  const firstName = customer.name.split(" ")[0] || "Trader";

  // Send confirmation email via Resend
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-confirmation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: customer.email,
        firstName,
        packageName: selectedPackage.name,
        amount: amount.value / 100, // Convert from cents
        paymentMethod: "card",
        isTest: false,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send confirmation email");
    }
  } catch (error) {
    console.error("Email sending error:", error);
  }

  // Here you could also:
  // - Create a license key and store it
  // - Add user to your database
  // - Grant access to Discord
  // - etc.

  console.log(`Payment succeeded for ${customer.email} - ${selectedPackage.name}`);
}
