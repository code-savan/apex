import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface VerificationRequest {
  txHash: string;
  crypto: string;
  email: string;
  firstName: string;
  packageName: string;
  expectedAmount: number;
  packageId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerificationRequest = await request.json();
    const { txHash, crypto, email, firstName, packageName, expectedAmount, packageId } = body;

    // Generate order ID
    const orderId = `APEX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    console.log("Crypto payment submitted for verification:", {
      orderId,
      crypto: crypto.toUpperCase(),
      txHash,
      email,
      amount: expectedAmount,
    });

    // Verify transaction on blockchain (using free APIs)
    const verificationResult = await verifyBlockchainTransaction(txHash, crypto, expectedAmount);

    // Send "verifying payment" email to customer
    await sendVerificationEmail({
      email,
      firstName,
      packageName,
      crypto: crypto.toUpperCase(),
      txHash,
      orderId,
      amount: expectedAmount,
    });

    // Send admin notification with verification status
    await sendAdminNotification({
      orderId,
      email,
      firstName,
      packageName,
      crypto: crypto.toUpperCase(),
      txHash,
      amount: expectedAmount,
      packageId,
      verificationStatus: verificationResult,
    });

    return NextResponse.json({
      success: true,
      orderId,
      verification: verificationResult,
      message: "Transaction submitted for verification. Check your email for confirmation.",
    });
  } catch (error) {
    console.error("Crypto verification error:", error);
    return NextResponse.json(
      { error: "Failed to submit transaction" },
      { status: 500 }
    );
  }
}

// Verify transaction on blockchain using free APIs
async function verifyBlockchainTransaction(txHash: string, crypto: string, expectedAmount: number) {
  try {
    switch (crypto.toLowerCase()) {
      case "btc":
        return await verifyBitcoin(txHash);
      case "eth":
      case "usdt":
        return await verifyEthereum(txHash);
      case "sol":
        return await verifySolana(txHash);
      case "ltc":
        return await verifyLitecoin(txHash);
      default:
        return { status: "pending", message: "Manual verification required" };
    }
  } catch (error) {
    console.error(`Blockchain verification error for ${crypto}:`, error);
    return { status: "pending", message: "Auto-verification failed, manual check needed" };
  }
}

// Bitcoin verification (BlockCypher - FREE: 200 req/hr)
async function verifyBitcoin(txHash: string) {
  try {
    const response = await fetch(`https://api.blockcypher.com/v1/btc/main/txs/${txHash}`);
    if (!response.ok) return { status: "pending", message: "TX not found yet" };

    const data = await response.json();
    return {
      status: data.confirmations >= 1 ? "confirmed" : "pending",
      confirmations: data.confirmations,
      message: data.confirmations >= 1 ? "Transaction confirmed!" : "Waiting for confirmations",
    };
  } catch (error) {
    return { status: "error", message: "Could not verify" };
  }
}

// Ethereum verification (Etherscan - FREE: 5 req/sec)
async function verifyEthereum(txHash: string) {
  const apiKey = process.env.ETHERSCAN_API_KEY || ""; // Free tier works without key
  try {
    const response = await fetch(
      `https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${apiKey}`
    );
    if (!response.ok) return { status: "pending", message: "TX not found yet" };

    const data = await response.json();
    return {
      status: data.result?.status === "1" ? "confirmed" : "pending",
      message: data.result?.status === "1" ? "Transaction confirmed!" : "Pending confirmation",
    };
  } catch (error) {
    return { status: "error", message: "Could not verify" };
  }
}

// Solana verification (Free RPC)
async function verifySolana(txHash: string) {
  try {
    const response = await fetch("https://api.mainnet-beta.solana.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTransaction",
        params: [txHash, { encoding: "json" }],
      }),
    });

    const data = await response.json();
    return {
      status: data.result ? "confirmed" : "pending",
      message: data.result ? "Transaction confirmed!" : "TX not found yet",
    };
  } catch (error) {
    return { status: "error", message: "Could not verify" };
  }
}

// Litecoin verification (BlockCypher - FREE)
async function verifyLitecoin(txHash: string) {
  try {
    const response = await fetch(`https://api.blockcypher.com/v1/ltc/main/txs/${txHash}`);
    if (!response.ok) return { status: "pending", message: "TX not found yet" };

    const data = await response.json();
    return {
      status: data.confirmations >= 1 ? "confirmed" : "pending",
      confirmations: data.confirmations,
      message: data.confirmations >= 1 ? "Transaction confirmed!" : "Waiting for confirmations",
    };
  } catch (error) {
    return { status: "error", message: "Could not verify" };
  }
}

// Send "verifying payment" email to customer
async function sendVerificationEmail(data: {
  email: string;
  firstName: string;
  packageName: string;
  crypto: string;
  txHash: string;
  orderId: string;
  amount: number;
}) {
  if (!resend) return;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Verification - APEX Protocol™</title>
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
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="margin: 0 auto 12px; width: 48px; height: 48px; background-color: #111; border: 1px solid #333; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 24px; line-height: 48px;">⏳</span>
                </div>
                <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 6px; font-weight: 600;">verifying payment</h2>
                <p style="color: #888; font-size: 14px; margin: 0;">
                  hey ${data.firstName} 👋
                </p>
              </div>

              <!-- Transaction Details -->
              <div style="background-color: #000; border: 1px solid #222; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="color: #666; padding: 6px 0; font-size: 13px;">order</td>
                    <td style="color: #fff; padding: 6px 0; text-align: right; font-family: monospace; font-size: 12px;">${data.orderId}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; padding: 6px 0; font-size: 13px;">package</td>
                    <td style="color: #fff; padding: 6px 0; text-align: right; font-size: 13px;">${data.packageName}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; padding: 6px 0; font-size: 13px;">amount</td>
                    <td style="color: #fff; padding: 6px 0; text-align: right; font-size: 13px;">$${data.amount}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; padding: 6px 0; font-size: 13px;">crypto</td>
                    <td style="color: #fff; padding: 6px 0; text-align: right; font-size: 13px;">${data.crypto}</td>
                  </tr>
                  <tr>
                    <td style="color: #666; padding: 6px 0; font-size: 13px;">tx hash</td>
                    <td style="color: #fff; padding: 6px 0; text-align: right; font-family: monospace; font-size: 10px; word-break: break-all;">${data.txHash.substring(0, 20)}...</td>
                  </tr>
                </table>
              </div>

              <!-- Status Message -->
              <div style="background-color: #111; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <p style="color: #fff; font-size: 14px; margin: 0 0 10px; font-weight: 600;">what's happening</p>
                <p style="color: #888; font-size: 13px; line-height: 1.6; margin: 0;">
                  we're verifying your ${data.crypto} payment on the blockchain. this usually takes <strong style="color: #fff;">10-30 minutes</strong> depending on network congestion.
                </p>
                <p style="color: #888; font-size: 13px; line-height: 1.6; margin: 12px 0 0;">
                  once confirmed, we'll send you another email with your setup instructions and access details.
                </p>
              </div>

              <!-- Note -->
              <div style="background-color: #000; border: 1px solid #333; border-radius: 8px; padding: 12px; text-align: center;">
                <p style="color: #666; font-size: 11px; margin: 0;">
                  no action needed—just wait for our confirmation email
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 20px; text-align: center;">
              <p style="color: #555; font-size: 12px; margin: 0 0 4px;">
                questions? → support@apexprotocolsystem.com
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

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "APEX Protocol <onboarding@resend.dev>",
      to: data.email,
      subject: `⏳ Verifying Your ${data.crypto} Payment | APEX Protocol™`,
      html: emailHtml,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }
}

// Send admin notification with verification status
async function sendAdminNotification(data: any) {
  if (!resend) return;

  const statusColor = data.verificationStatus.status === "confirmed" ? "#10B981" :
                      data.verificationStatus.status === "pending" ? "#F59E0B" : "#EF4444";

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Crypto Payment</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table role="presentation" style="width: 100%; max-width: 480px; border-collapse: collapse; background-color: #fff; border-radius: 8px; border: 1px solid #e5e5e5;">
          <tr>
            <td style="background-color: #111; padding: 20px; text-align: center;">
              <h1 style="color: #fff; font-size: 18px; margin: 0;">🔔 new crypto payment</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px;">
              <div style="background-color: ${statusColor}20; border: 1px solid ${statusColor}; border-radius: 6px; padding: 12px; margin-bottom: 16px;">
                <p style="color: ${statusColor}; font-size: 13px; font-weight: 600; margin: 0;">
                  ${data.verificationStatus.status.toUpperCase()}: ${data.verificationStatus.message}
                </p>
              </div>

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
                    <td style="padding: 6px 0; color: #666; font-size: 13px;">crypto</td>
                    <td style="padding: 6px 0; color: #111; font-size: 13px; text-align: right; font-weight: 600;">${data.crypto}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #666; font-size: 13px;">amount</td>
                    <td style="padding: 6px 0; color: #10B981; font-size: 16px; font-weight: 600; text-align: right;">$${data.amount}</td>
                  </tr>
                </table>
              </div>

              <div style="background-color: #f9f9f9; border-radius: 6px; padding: 16px; margin-bottom: 16px;">
                <p style="color: #111; font-size: 13px; font-weight: 600; margin: 0 0 10px;">customer</p>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 4px 0; color: #666; font-size: 13px;">name</td>
                    <td style="padding: 4px 0; color: #111; font-size: 13px; text-align: right;">${data.firstName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #666; font-size: 13px;">email</td>
                    <td style="padding: 4px 0; text-align: right;"><a href="mailto:${data.email}" style="color: #111; text-decoration: underline; font-size: 13px;">${data.email}</a></td>
                  </tr>
                </table>
              </div>

              <div style="background-color: #000; border-radius: 6px; padding: 12px;">
                <p style="color: #888; font-size: 11px; margin: 0 0 6px;">TX Hash:</p>
                <p style="color: #fff; font-size: 10px; font-family: monospace; margin: 0; word-break: break-all;">${data.txHash}</p>
              </div>

              ${data.verificationStatus.status === "confirmed" ? `
              <div style="background-color: #10B981; border-radius: 6px; padding: 12px; margin-top: 16px;">
                <p style="color: #fff; margin: 0; font-size: 13px;">✓ VERIFIED - Send access details to customer</p>
              </div>
              ` : `
              <div style="background-color: #F59E0B; border-radius: 6px; padding: 12px; margin-top: 16px;">
                <p style="color: #000; margin: 0; font-size: 13px;">⏳ MANUAL CHECK NEEDED</p>
              </div>
              `}
            </td>
          </tr>

          <tr>
            <td style="padding: 16px; background-color: #f9f9f9; text-align: center;">
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

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "APEX Protocol <onboarding@resend.dev>",
      to: ["admin@apexprotocolsystem.com", "support@apexprotocolsystem.com"],
      subject: `🔔 ${data.crypto} Payment - ${data.verificationStatus.status.toUpperCase()} - $${data.amount}`,
      html: emailHtml,
    });
  } catch (error) {
    console.error("Failed to send admin notification:", error);
  }
}
