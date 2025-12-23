# Payment Verification Setup Guide

## Overview
How to verify when users have actually paid (not just clicked submit).

---

## 1. DodoPayments Webhooks (Card Payments)

### What Are Webhooks?
Webhooks are automatic notifications DodoPayments sends to your server when a payment succeeds, fails, or gets refunded.

### Your Webhook is Already Built! ✓
Location: `app/api/webhook/dodo/route.ts`

It already handles:
- ✅ Payment succeeded events
- ✅ Payment failed events
- ✅ Sends confirmation email automatically
- ✅ Signature verification (security)

### Setup in DodoPayments Dashboard:

#### Step 1: Get Your Webhook URL
```
https://yourdomain.com/api/webhook/dodo
```
(Replace `yourdomain.com` with your actual domain)

For testing locally (with ngrok or similar):
```
https://your-ngrok-url.ngrok.io/api/webhook/dodo
```

#### Step 2: Configure in Dodo Dashboard

1. Go to [DodoPayments Dashboard](https://dashboard.dodopayments.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add Endpoint**
4. Enter your webhook URL: `https://yourdomain.com/api/webhook/dodo`
5. Select events to listen for:
   - ✅ `payment.succeeded`
   - ✅ `payment.failed`
   - ✅ `payment.refunded` (optional)
6. Click **Save**

#### Step 3: Get Webhook Signing Secret

1. After creating the endpoint, Dodo shows you a **Signing Secret**
2. Copy it (starts with `whsec_...`)
3. Add to your `.env.local`:

```bash
DODO_WEBHOOK_KEY=whsec_your_actual_secret_here
```

4. Restart your server:
```bash
npm run dev
```

### How It Works:

1. **User pays** → DodoPayments processes payment
2. **Payment succeeds** → Dodo sends webhook to your API
3. **Your API receives it** → Verifies signature (security)
4. **Sends emails** automatically:
   - Customer confirmation email
   - Admin notification email
5. **Done!** → User gets license key, you get notified

### Testing Webhooks:

**Option A: Use Dodo's Test Mode**
1. Create test products in Dodo dashboard
2. Use test credit cards (Dodo provides these)
3. Complete test checkout
4. Watch your terminal for webhook logs

**Option B: Local Testing with ngrok**
```bash
# In one terminal:
npm run dev

# In another terminal:
npx ngrok http 3000

# Copy the ngrok URL (e.g., https://abc123.ngrok.io)
# Add to Dodo webhooks: https://abc123.ngrok.io/api/webhook/dodo
```

### Monitoring Webhooks:

**In Your Terminal:**
Watch for these logs:
```
Payment succeeded for customer@email.com - Starter Protocol
Email sent successfully
```

**In Dodo Dashboard:**
- Go to **Developers** → **Webhooks** → **Logs**
- See all webhook attempts
- Check if they succeeded or failed
- Retry failed webhooks manually

---

## 2. Crypto Payment Verification

### The Challenge:
Unlike card payments (instant via Dodo), crypto transactions need blockchain verification.

### Current Flow:
1. User submits form saying "I've sent crypto"
2. Redirected to `/checkout/crypto-pending` page
3. **Manual verification required** (you check if payment arrived)

### Automated Verification Options:

#### Option A: Blockchain APIs (Recommended for Production)

**For Bitcoin (BTC):**
- Use **BlockCypher API** (free tier: 200 req/hr)
- API: `https://api.blockcypher.com/v1/btc/main/addrs/{your_address}/balance`

**For Ethereum/USDT (ETH, USDT):**
- Use **Etherscan API** (free tier: 5 req/sec)
- API: `https://api.etherscan.io/api?module=account&action=txlist&address={your_address}`

**For Solana (SOL):**
- Use **Solana RPC** (free via public nodes)
- API: `https://api.mainnet-beta.solana.com`

**For Litecoin (LTC):**
- Use **BlockCypher API** (same as BTC)
- API: `https://api.blockcypher.com/v1/ltc/main/addrs/{your_address}/balance`

#### Option B: Third-Party Services (Easiest)

**NOWPayments** (Recommended)
- Website: https://nowpayments.io
- Handles ALL crypto verification automatically
- Webhooks for confirmed payments
- $0 setup, 0.5-1% fee
- Supports 200+ cryptocurrencies

**How NOWPayments Works:**
1. User selects crypto → API generates unique payment address
2. User sends crypto
3. NOWPayments monitors blockchain
4. Sends webhook when payment confirmed
5. You send confirmation email

**Setup:**
```bash
# Add to .env.local
NOWPAYMENTS_API_KEY=your_key_here
NOWPAYMENTS_IPN_SECRET=your_ipn_secret
```

#### Option C: Manual Verification (Current - OK for Low Volume)

**Process:**
1. User submits crypto payment form
2. You receive admin notification email with:
   - Customer email
   - Amount expected
   - Wallet address used
   - Crypto type
3. Manually check wallet/blockchain explorer
4. If payment confirmed → Reply to customer with access

**Tools to Check Payments:**
- **Bitcoin:** https://blockchain.com/explorer
- **Ethereum:** https://etherscan.io
- **Solana:** https://solscan.io
- **Litecoin:** https://blockchair.com/litecoin

---

## 3. Recommended Setup (Production)

### Immediate (Works Now):
✅ **Card Payments:** DodoPayments webhooks (set up using steps above)
✅ **Crypto Payments:** Manual verification via admin emails

### When You Scale Up:
✅ **Card Payments:** Same (Dodo webhooks work great)
✅ **Crypto Payments:** Add NOWPayments for automation

---

## 4. Quick Setup Checklist

### For Dodo Webhooks:
- [ ] Deploy your site (Vercel, Netlify, or your domain)
- [ ] Get your webhook URL: `https://yourdomain.com/api/webhook/dodo`
- [ ] Add endpoint in Dodo dashboard
- [ ] Copy webhook signing secret
- [ ] Add `DODO_WEBHOOK_KEY` to production environment variables
- [ ] Test with Dodo test mode
- [ ] Verify emails arrive (customer + admin)

### For Crypto Verification:
- [ ] Decide: Manual or Automated?
- [ ] If Manual: Set up wallet monitoring routine
- [ ] If Automated: Sign up for NOWPayments or similar
- [ ] Configure API keys in environment variables
- [ ] Test with small real transaction ($5-10)
- [ ] Document your process for team

---

## 5. Environment Variables Summary

Add these to your **production** environment (Vercel/Netlify/hosting):

```bash
# DodoPayments
DODO_PAYMENTS_API_KEY=your_api_key
DODO_WEBHOOK_KEY=whsec_your_webhook_secret
DODO_STARTER_PRODUCT_ID=prod_starter_xxx
DODO_ELITE_PRODUCT_ID=prod_elite_xxx

# Resend (Emails)
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=APEX Protocol <support@apexprotocolsystem.com>

# Crypto Wallets
NEXT_PUBLIC_BTC_ADDRESS=your_btc_address
NEXT_PUBLIC_ETH_ADDRESS=your_eth_address
NEXT_PUBLIC_USDT_ADDRESS=your_usdt_address
NEXT_PUBLIC_SOL_ADDRESS=your_sol_address
NEXT_PUBLIC_LTC_ADDRESS=your_ltc_address

# Optional: Crypto Verification API
NOWPAYMENTS_API_KEY=your_nowpayments_key (if using)
BLOCKCYPHER_API_KEY=your_blockcypher_key (if using)
```

---

## 6. Testing Payment Flow End-to-End

### Test Card Payment:
```bash
1. Go to: https://yourdomain.com/checkout?package=starter
2. Fill out form with real email
3. Use Dodo test card (from their docs)
4. Complete payment
5. Check:
   ✓ Email arrives at customer
   ✓ Email arrives at admin/support
   ✓ Webhook logged in terminal/Dodo dashboard
```

### Test Crypto Payment:
```bash
1. Go to: https://yourdomain.com/checkout?package=starter
2. Select crypto payment
3. Choose BTC (or any crypto)
4. Note the amount and address
5. Send real crypto (small amount for test)
6. Check wallet/blockchain explorer
7. Manually confirm with customer
```

---

## 7. Troubleshooting

### Webhook Not Firing?
- Check webhook URL is correct (no typos)
- Verify webhook is **enabled** in Dodo dashboard
- Check production environment variables are set
- Look at Dodo webhook logs for errors
- Ensure your API route is accessible (not blocked by firewall)

### Emails Not Sending After Webhook?
- Check `RESEND_API_KEY` is set in production
- Verify `RESEND_FROM_EMAIL` uses verified domain
- Check Resend dashboard for delivery logs
- Look at your server logs for Resend errors

### Crypto Verification Issues?
- Double-check wallet addresses are correct
- Ensure enough confirmations (BTC needs 1-3, ETH needs 12+)
- Check blockchain explorer for transaction status
- Verify customer sent to correct address

---

## 8. Advanced: Crypto Verification API (Optional)

If you want to build automated crypto verification, here's a starter API route:

```typescript
// app/api/verify-crypto/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { txHash, crypto, expectedAmount, customerEmail } = await request.json();

  // Verify transaction on blockchain
  const isValid = await verifyTransaction(txHash, crypto, expectedAmount);

  if (isValid) {
    // Send confirmation email
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-confirmation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: customerEmail,
        // ... other details
      }),
    });

    return NextResponse.json({ verified: true });
  }

  return NextResponse.json({ verified: false });
}
```

---

## Need Help?

**DodoPayments Support:**
- Docs: https://docs.dodopayments.com
- Discord: Ask in their community

**Resend Support:**
- Docs: https://resend.com/docs
- Email: team@resend.com

**Crypto Verification:**
- NOWPayments: https://nowpayments.io/help
- BlockCypher: https://www.blockcypher.com/dev

---

## Summary

**Right now (works today):**
- ✅ Card payments → Automated via Dodo webhooks
- ✅ Crypto payments → Manual verification

**Future (when you scale):**
- ✅ Add NOWPayments for crypto automation
- ✅ Keep Dodo webhooks for cards

Both methods send beautiful Gen Z emails automatically! 🚀
