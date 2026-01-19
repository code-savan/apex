import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Check if DodoPayments is configured
    if (!process.env.DODO_PAYMENTS_API_KEY) {
      console.error("DodoPayments not configured - DODO_PAYMENTS_API_KEY missing");
      return NextResponse.json(
        {
          error: "Payment service not configured",
          message: "DodoPayments API key is missing. Add DODO_PAYMENTS_API_KEY to your environment variables."
        },
        { status: 503 }
      );
    }

    if (!process.env.DODO_TEST_PRODUCT_ID) {
      console.error("Test product ID not configured");
      return NextResponse.json(
        {
          error: "Product not configured",
          message: "DODO_TEST_PRODUCT_ID is missing. Add it to your environment variables."
        },
        { status: 503 }
      );
    }

    // ALWAYS use LIVE endpoint (no test mode)
    const DODO_API_URL = "https://live.dodopayments.com/checkouts";

    console.log("Creating $1 test payment checkout:", {
      url: DODO_API_URL,
      productId: process.env.DODO_TEST_PRODUCT_ID,
      mode: "LIVE",
    });

    const response = await fetch(DODO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
      },
      body: JSON.stringify({
        product_cart: [
          {
            product_id: process.env.DODO_TEST_PRODUCT_ID,
            quantity: 1,
          },
        ],
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.apexprotocolsystem.com"}/test-payment/success?session_id={CHECKOUT_SESSION_ID}`,
        webhook_url: "https://www.apexprotocolsystem.com/api/webhook/dodo",
        metadata: {
          type: "test_payment",
          amount: "1",
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("DodoPayments API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        productId: process.env.DODO_TEST_PRODUCT_ID,
      });

      // Provide specific error messages
      let userMessage = "Payment service error";
      if (response.status === 401) {
        userMessage = "Authentication failed - Please check your API key";
      } else if (response.status === 404) {
        userMessage = "Product not found - Please verify the product ID exists in your Dodo account";
      } else if (response.status === 400) {
        userMessage = errorData?.message || "Invalid request - Please check product configuration";
      }

      return NextResponse.json(
        {
          error: "DodoPayments Error",
          message: userMessage,
          details: errorData,
          debugInfo: {
            productId: process.env.DODO_TEST_PRODUCT_ID,
            statusCode: response.status,
            apiUrl: DODO_API_URL,
          }
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("DodoPayments checkout created successfully:", data.id);

    return NextResponse.json({
      checkoutUrl: data.checkout_url,
      sessionId: data.id,
    });
  } catch (error) {
    console.error("Test checkout creation error:", error);

    // Check if it's a network error
    if (error instanceof Error && error.message.includes("fetch failed")) {
      return NextResponse.json(
        {
          error: "Network error",
          message: "Unable to connect to payment service. Please check your internet connection or try again later."
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
