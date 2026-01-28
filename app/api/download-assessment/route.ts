import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const firstName = searchParams.get("firstName") || "Trader";
  const report = searchParams.get("report") || "";

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 400 });
  }

  const body = `APEX Protocol - Trading Assessment\n\nHi ${firstName},\n\n${report}\n\nVisit ApexProtocolSystem.com for next steps.`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename=APEX-Trading-Assessment-${firstName.replace(/\s+/g, "-")}.txt`,
    },
  });
}
