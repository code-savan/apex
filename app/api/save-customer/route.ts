import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      package: packageName,
      paymentMethod,
      amount,
      orderId,
      timestamp
    } = await request.json();

    if (!name || !email || !packageName || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Google Sheets integration for confirmed customers
    const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_CUSTOMERS_WEBHOOK_URL;

    if (GOOGLE_SHEETS_URL) {
      try {
        await fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            package: packageName,
            paymentMethod,
            amount,
            orderId,
            timestamp,
            source: "Checkout - Payment Confirmed",
          }),
        });
      } catch (sheetError) {
        console.error("Google Sheets customer save failed:", sheetError);
        // Don't block the confirmation flow if sheets fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save customer error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
