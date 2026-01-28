import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      name,
      email,
      phone,
      leadScore,
      urgency,
      buyingPower,
      losses,
      educationSpent,
      experienceLevel,
      mainBlocker,
      goalMotivation,
      timestamp,
      source,
    } = data;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Google Sheets integration for Quiz Data
    const GOOGLE_SHEETS_QUIZ_URL = process.env.GOOGLE_SHEETS_QUIZ_WEBHOOK_URL;

    if (GOOGLE_SHEETS_QUIZ_URL) {
      try {
        await fetch(GOOGLE_SHEETS_QUIZ_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name || "",
            email,
            phone: phone || "",
            leadScore: leadScore || 0,
            urgency: urgency || "",
            buyingPower: buyingPower || "",
            losses: losses || 0,
            educationSpent: educationSpent || 0,
            experienceLevel: experienceLevel || "",
            mainBlocker: mainBlocker || "",
            goalMotivation: goalMotivation || "",
            timestamp: timestamp || new Date().toISOString(),
            source: source || "quiz",
          }),
        });
      } catch (sheetError) {
        console.error("Google Sheets quiz save failed:", sheetError);
        // Don't block the user flow if sheets fails
      }
    } else {
      console.log("GOOGLE_SHEETS_QUIZ_WEBHOOK_URL not configured - quiz data not saved to sheets");
    }

    // NOTE: We don't save to leads sheet here
    // Lead will be saved only when user selects a package on the landing page
    // This prevents duplicate entries in the leads sheet

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save quiz error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
