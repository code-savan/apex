import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      firstName,
      leadScore,
      losses,
      educationSpent,
      experienceLevel,
      mainBlocker,
      goalMotivation,
      urgency
    } = body;

    // Generate personalized report based on quiz answers
    const generateReport = () => {
      const totalInvestment = (losses || 0) + (educationSpent || 0);
      const urgencyText = urgency === 'hot' ? 'immediately' : urgency === 'warm' ? 'this week' : 'this month';

      return `
• Experience Level: ${experienceLevel || 'Not specified'}
• Primary Challenge: ${mainBlocker || 'Not specified'}
• Total Investment in Trading: $${totalInvestment.toLocaleString()}
• Goal: ${goalMotivation || 'Not specified'}
• Readiness to Start: ${urgencyText}
• Lead Score: ${leadScore}/100

Your personalized assessment indicates you're ready for a systematic approach to trading. Based on your responses, an AI-powered solution could help you overcome emotional trading and missed opportunities.
      `.trim();
    };

    // Email HTML content
    const reportText = generateReport();

    const normalizeBaseUrl = (raw: string) => {
      const trimmed = raw.trim().replace(/\/+$/, "");
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
      return `https://${trimmed}`;
    };

    const baseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_BASE_URL || "https://apexprotocolsystem.com");
    const guideUrl = `${baseUrl}/TOP-3-GOLD-TRADING-STRATEGIES.pdf`;
    const logoUrl = `${baseUrl}/logo.png`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Trading Assessment & Free Guide - APEX Protocol</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" style="width: 100%; max-width: 520px; border-collapse: collapse; background-color: #ffffff;">
          <!-- Header -->
          <tr>
            <td style="text-align: center; padding-bottom: 20px;">
              <img src="${logoUrl}" alt="APEX Protocol" width="64" height="64" style="display: block; margin: 0 auto 12px;" />
              <h1 style="color: #0b0b0b; font-size: 22px; margin: 0; font-weight: 700; letter-spacing: 0.5px;">APEX Protocol</h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 0 4px;">
              <div style="text-align: left; margin-bottom: 20px;">
                <h2 style="color: #111111; font-size: 20px; margin: 0 0 6px; font-weight: 700;">Your Trading Assessment</h2>
                <p style="color: #333333; font-size: 15px; margin: 0; line-height: 1.6;">
                  Hi ${firstName},
                </p>
                <p style="color: #333333; font-size: 15px; margin: 10px 0 0; line-height: 1.6;">
                  Thanks for completing the quiz. Below is your personalized report and your free PDF guide.
                </p>
              </div>

              <!-- Assessment Results -->
              <div style="padding: 16px 0 20px; border-top: 1px solid #e6e6e6; border-bottom: 1px solid #e6e6e6; margin-bottom: 20px;">
                <p style="color: #111111; font-size: 14px; margin: 0 0 10px; font-weight: 700; text-transform: none;">Your Personalized Report</p>
                <p style="color: #2b2b2b; font-size: 14px; line-height: 1.65; margin: 0; white-space: pre-line;">
${reportText}
                </p>
              </div>

              <!-- Free Download -->
              <div style="margin-bottom: 24px;">
                <p style="color: #111111; font-size: 15px; margin: 0 0 8px; font-weight: 700;">Your Free Gold Trading Guide</p>
                <p style="color: #2b2b2b; font-size: 14px; line-height: 1.65; margin: 0 0 14px;">
                  As promised, here is your PDF with the top 3 gold trading strategies.
                </p>
                <table role="presentation" style="width: 100%;">
                  <tr>
                    <td align="left" style="padding: 0;">
                      <a href="${guideUrl}"
                         style="background-color: #0066FF; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block;">
                        Download Free PDF Guide
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- CTA -->
              <div style="padding: 16px 0 0; border-top: 1px solid #e6e6e6;">
                <p style="color: #111111; font-size: 15px; margin: 0 0 8px; font-weight: 700;">Ready to Transform Your Trading?</p>
                <p style="color: #2b2b2b; font-size: 14px; line-height: 1.65; margin: 0 0 14px;">
                  Explore APEX Protocol and see how AI can eliminate emotions and trade around the clock.
                </p>
                <table role="presentation" style="width: 100%;">
                  <tr>
                    <td align="left" style="padding: 0;">
                      <a href="https://apexprotocolsystem.com"
                         style="background-color: #0066FF; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block;">
                        Visit ApexProtocolSystem.com
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 24px; text-align: left;">
              <p style="color: #555555; font-size: 12px; margin: 0 0 6px;">
                Questions? Reach us at support@apexprotocolsystem.com
              </p>
              <p style="color: #777777; font-size: 11px; margin: 0;">
                © ${new Date().getFullYear()} APEX Protocol™
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Send email via Resend (if configured)
    if (!resend) {
      console.log("Resend not configured - skipping email send");
      console.log(`Would have sent quiz completion email to: ${email}`);
      return NextResponse.json({
        success: true,
        messageId: "mock-" + Date.now(),
        note: "Email skipped - Resend API key not configured",
      });
    }

    // Send quiz completion email
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "APEX Protocol <onboarding@resend.dev>",
      to: email,
      subject: `🎯 Your Trading Assessment + Free Guide | APEX Protocol™`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
    });
  } catch (error) {
    console.error("Quiz completion email sending error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
