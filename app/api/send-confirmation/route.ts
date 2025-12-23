import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, packageName, amount, paymentMethod, isTest } = body;

    // Generate a random order ID
    const orderId = `APEX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Format payment method for display (uppercase crypto)
    const formatPaymentMethod = (method: string) => {
      if (method.startsWith('crypto_')) {
        const crypto = method.replace('crypto_', '').toUpperCase();
        return `${crypto} (Crypto)`;
      }
      return method.charAt(0).toUpperCase() + method.slice(1);
    };

    // Email HTML content
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Received - APEX Protocol™</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table role="presentation" style="width: 100%; max-width: 480px; border-collapse: collapse;">
          <!-- Header -->
          <tr>
            <td style="text-align: center; padding-bottom: 24px;">
              <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 700;">APEX</h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background-color: #0a0a0a; border: 1px solid #222; border-radius: 12px; padding: 24px;">
              ${isTest ? `
              <div style="background-color: #1a1a1a; border-radius: 8px; padding: 12px; margin-bottom: 20px; text-align: center;">
                <span style="color: #888; font-size: 13px;">🧪 Test Mode</span>
              </div>
              ` : ''}

              <div style="text-align: center; margin-bottom: 24px;">
                <div style="margin: 0 auto 12px; width: 48px; height: 48px; background-color: #111; border: 1px solid #333; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 24px; line-height: 48px;">✓</span>
                </div>
                <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 6px; font-weight: 600;">payment received</h2>
                <p style="color: #888; font-size: 14px; margin: 0;">
                  hey ${firstName} 👋
                </p>
              </div>

              <!-- Order Details -->
              <div style="background-color: #000; border: 1px solid #222; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="color: #666; padding: 6px 0; font-size: 13px;">order</td>
                    <td style="color: #fff; padding: 6px 0; text-align: right; font-family: monospace; font-size: 12px;">${orderId}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; padding: 6px 0; font-size: 13px;">package</td>
                    <td style="color: #fff; padding: 6px 0; text-align: right; font-size: 13px;">${packageName}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; padding: 6px 0; font-size: 13px;">amount</td>
                    <td style="color: #fff; padding: 6px 0; text-align: right; font-size: 13px;">$${amount}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; padding: 6px 0; font-size: 13px;">method</td>
                    <td style="color: #fff; padding: 6px 0; text-align: right; font-size: 13px;">${formatPaymentMethod(paymentMethod)}</td>
                  </tr>
                </table>
              </div>

              <!-- What's Happening -->
              <div style="background-color: #111; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <p style="color: #fff; font-size: 14px; margin: 0 0 10px; font-weight: 600;">what happens next</p>
                <p style="color: #888; font-size: 13px; line-height: 1.6; margin: 0;">
                  our support team will reach out to you <strong style="color: #fff;">within 1 week</strong> with your setup instructions, onboarding guide, and access details.
                </p>
                <p style="color: #888; font-size: 13px; line-height: 1.6; margin: 12px 0 0;">
                  we're currently dealing with a bulk order wave and working through setup/onboarding for everyone. appreciate your patience—we'll get you trading asap 🚀
                </p>
              </div>

              <!-- License Key -->
              <div style="background-color: #000; border: 1px solid #333; border-radius: 8px; padding: 16px; text-align: center;">
                <p style="color: #888; font-size: 11px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">license key</p>
                <p style="color: #fff; font-size: 16px; margin: 0; font-family: monospace; word-break: break-all; letter-spacing: 0.5px;">
                  ${generateLicenseKey()}
                </p>
                <p style="color: #666; font-size: 11px; margin: 8px 0 0;">save this—you'll need it for setup</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 20px; text-align: center;">
              <p style="color: #555; font-size: 12px; margin: 0 0 4px;">
                questions? hit us up → support@apexprotocolsystem.com
              </p>
              <p style="color: #333; font-size: 11px; margin: 0;">
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
      console.log(`Would have sent email to: ${email}`);
      console.log(`Order ID: ${orderId}`);
      return NextResponse.json({
        success: true,
        messageId: "mock-" + Date.now(),
        orderId,
        note: "Email skipped - Resend API key not configured",
      });
    }

    // Send customer confirmation email
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "APEX Protocol <onboarding@resend.dev>",
      to: email,
      subject: `🎉 Order Confirmed - ${packageName} | APEX Protocol™`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email", details: error },
        { status: 500 }
      );
    }

    // Send admin notification email
    const adminEmailHtml = createAdminNotificationEmail({
      orderId,
      customerEmail: email,
      customerName: firstName,
      packageName,
      amount,
      paymentMethod,
      isTest,
    });

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "APEX Protocol <onboarding@resend.dev>",
        to: ["admin@apexprotocolsystem.com", "support@apexprotocolsystem.com"],
        subject: `${isTest ? '[TEST] ' : ''}New Order: ${packageName} - $${amount}`,
        html: adminEmailHtml,
      });
    } catch (adminError) {
      console.error("Failed to send admin notification:", adminError);
      // Don't fail the request if admin email fails
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
      orderId,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Generate a random license key
function generateLicenseKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segments = 4;
  const segmentLength = 5;

  const key = [];
  for (let i = 0; i < segments; i++) {
    let segment = "";
    for (let j = 0; j < segmentLength; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    key.push(segment);
  }

  return key.join("-");
}

// Create admin notification email
function createAdminNotificationEmail(data: {
  orderId: string;
  customerEmail: string;
  customerName: string;
  packageName: string;
  amount: number;
  paymentMethod: string;
  isTest: boolean;
}) {
  // Format payment method (uppercase crypto)
  const formatMethod = (method: string) => {
    if (method.startsWith('crypto_')) {
      return method.replace('crypto_', '').toUpperCase() + ' (Crypto)';
    }
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order - Admin</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table role="presentation" style="width: 100%; max-width: 480px; border-collapse: collapse; background-color: #fff; border-radius: 8px; border: 1px solid #e5e5e5;">
          <!-- Header -->
          <tr>
            <td style="background-color: #111; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #fff; font-size: 18px; margin: 0; font-weight: 600;">🔔 new order</h1>
              ${data.isTest ? '<p style="color: #888; font-size: 12px; margin: 6px 0 0;">test mode</p>' : ''}
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 24px;">
              <div style="background-color: #f9f9f9; border-radius: 6px; padding: 16px; margin-bottom: 16px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; color: #666; font-size: 13px;">order</td>
                    <td style="padding: 6px 0; color: #111; font-family: monospace; font-size: 12px; text-align: right;">${data.orderId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #666; font-size: 13px;">package</td>
                    <td style="padding: 6px 0; color: #111; font-size: 13px; text-align: right;">${data.packageName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #666; font-size: 13px;">amount</td>
                    <td style="padding: 6px 0; color: #10B981; font-size: 16px; font-weight: 600; text-align: right;">$${data.amount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #666; font-size: 13px;">method</td>
                    <td style="padding: 6px 0; color: #111; font-size: 13px; text-align: right;">${formatMethod(data.paymentMethod)}</td>
                  </tr>
                </table>
              </div>

              <div style="background-color: #f9f9f9; border-radius: 6px; padding: 16px;">
                <p style="color: #111; font-size: 13px; font-weight: 600; margin: 0 0 10px;">customer</p>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 4px 0; color: #666; font-size: 13px;">name</td>
                    <td style="padding: 4px 0; color: #111; font-size: 13px; text-align: right;">${data.customerName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #666; font-size: 13px;">email</td>
                    <td style="padding: 4px 0; text-align: right;">
                      <a href="mailto:${data.customerEmail}" style="color: #111; text-decoration: underline; font-size: 13px;">${data.customerEmail}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #666; font-size: 13px;">time</td>
                    <td style="padding: 4px 0; color: #111; font-size: 12px; text-align: right;">${new Date().toLocaleString('en-US', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                      timeZone: 'America/New_York'
                    })} EST</td>
                  </tr>
                </table>
              </div>

              ${!data.isTest ? `
              <div style="background-color: #10B981; border-radius: 6px; padding: 12px; margin-top: 16px;">
                <p style="color: #fff; margin: 0; font-size: 13px;">✓ customer email sent</p>
              </div>
              ` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 16px; text-align: center; background-color: #f9f9f9; border-top: 1px solid #e5e5e5;">
              <p style="color: #666; font-size: 11px; margin: 0;">APEX admin notification</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
