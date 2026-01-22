import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, package: packageName, timestamp, source } = await request.json();

    if (!name || !email || !packageName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Google Sheets integration
    const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_LEADS_WEBHOOK_URL;

    if (GOOGLE_SHEETS_URL) {
      try {
        await fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            package: packageName,
            timestamp,
            source: source || "Landing Page - Unknown Button",
          }),
        });
      } catch (sheetError) {
        console.error("Google Sheets save failed:", sheetError);
        // Don't block the user flow if sheets fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save lead error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
