import { NextRequest, NextResponse } from "next/server";

const packages: Record<string, { name: string; price: number; productId: string }> = {
  test: {
    name: "Test Product",
    price: 1,
    productId: process.env.DODO_TEST_PRODUCT_ID || "prod_test",
  },
  starter: {
    name: "Starter Protocol",
    price: 499,
    productId: process.env.DODO_STARTER_PRODUCT_ID || "prod_starter",
  },
  elite: {
    name: "Elite Mastery Bundle",
    price: 999,
    productId: process.env.DODO_ELITE_PRODUCT_ID || "prod_elite",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packageId, email, firstName, lastName, phone } = body;

    const selectedPackage = packages[packageId] || packages.starter;

    // Check if DodoPayments is configured
    if (!process.env.DODO_PAYMENTS_API_KEY) {
      console.error("DodoPayments not configured - DODO_PAYMENTS_API_KEY missing");
      return NextResponse.json(
        {
          error: "Payment service not configured",
          details: "DodoPayments API key is missing. Add DODO_PAYMENTS_API_KEY to your environment variables."
        },
        { status: 503 }
      );
    }

    // DodoPayments API endpoint
    const DODO_API_URL = process.env.DODO_TEST_MODE === "true"
      ? "https://test.dodopayments.com/checkouts"
      : "https://live.dodopayments.com/checkouts";

    console.log("Creating DodoPayments checkout:", {
      url: DODO_API_URL,
      package: selectedPackage.name,
      email,
      testMode: process.env.DODO_TEST_MODE === "true",
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
            product_id: selectedPackage.productId,
            quantity: 1,
          },
        ],
        customer: {
          email: email,
          name: `${firstName} ${lastName}`,
          phone_number: phone || undefined,
        },
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout/success?package=${packageId}`,
        metadata: {
          package_id: packageId,
          package_name: selectedPackage.name,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("DodoPayments API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        requestData: {
          productId: selectedPackage.productId,
          email,
          testMode: process.env.DODO_TEST_MODE === "true",
        }
      });

      // Provide more specific error messages
      let userMessage = "Payment service error";
      if (response.status === 401) {
        userMessage = "Authentication failed - Please check your API key matches the test/live mode";
      } else if (response.status === 404) {
        userMessage = "Product not found - Please verify the product ID exists in your Dodo account";
      } else if (response.status === 400) {
        userMessage = errorData?.message || "Invalid request - Please check product configuration";
      }

      // Return detailed error for debugging
      return NextResponse.json(
        {
          error: "DodoPayments Error",
          message: userMessage,
          details: errorData,
          debugInfo: {
            productId: selectedPackage.productId,
            testMode: process.env.DODO_TEST_MODE === "true",
            statusCode: response.status,
            apiUrl: DODO_API_URL,
          }
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("DodoPayments checkout created:", data.id);

    return NextResponse.json({
      checkoutUrl: data.checkout_url,
      sessionId: data.id,
    });
  } catch (error) {
    console.error("Checkout creation error:", error);

    // Check if it's a network error
    if (error instanceof Error && error.message.includes("fetch failed")) {
      return NextResponse.json(
        {
          error: "Network error",
          details: "Unable to connect to payment service. Please check your internet connection or try again later."
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
