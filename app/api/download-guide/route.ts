import { NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";

export const runtime = "nodejs";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "TOP-3-GOLD-TRADING-STRATEGIES.pdf");
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=TOP-3-GOLD-TRADING-STRATEGIES.pdf",
      },
    });
  } catch (error) {
    console.error("Guide download error:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
