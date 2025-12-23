# Test Purchase Flow Guide

## Quick Test Setup

### 1. Configure Resend in `.env.local`

```bash
# Add these to your .env.local file:
RESEND_API_KEY=re_your_actual_api_key
RESEND_FROM_EMAIL=APEX Protocol <support@apexprotocolsystem.com>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Start Development Server

```bash
npm run dev
```

Server should start at `http://localhost:3000`

---

## Test Purchase (No Real Payment)

### Step 1: Open Test Checkout

Visit one of these URLs in your browser:

**Starter Package:**
```
http://localhost:3000/checkout?package=starter&test=true
```

**Elite Package:**
```
http://localhost:3000/checkout?package=elite&test=true
```

You should see a **yellow banner** at the top saying "Test Mode Active"

### Step 2: Fill Out Form

Enter:
- **First Name:** Your name
- **Last Name:** Your last name
- **Email:** YOUR REAL EMAIL (so you can see the confirmation)
- **Phone:** (optional)

### Step 3: Select Payment Method

**Option A: Test Card Payment**
1. Click "Card Payment"
2. Click "Pay $XXX with Card"
3. Should redirect to success page immediately (no real payment)

**Option B: Test Crypto Payment**
1. Click "Crypto"
2. Select any cryptocurrency (BTC, ETH, etc.)
3. You'll see:
   - Live crypto amount to send
   - QR code placeholder (need to add actual images)
   - Wallet address with copy button
4. Click "I've Sent $XXX in [CRYPTO]"
5. Should redirect immediately (no real verification)

### Step 4: Check Your Email

Within **30 seconds to 2 minutes**, you should receive 2 emails:

#### Email 1: Customer Confirmation
- **To:** The email you entered
- **Subject:** "🎉 Order Confirmed - [Package Name] | APEX Protocol™"
- **Contains:**
  - Order ID
  - Package details
  - License key (randomly generated)
  - Next steps
  - Download portal link

#### Email 2: Admin Notification
- **To:** admin@apexprotocolsystem.com AND support@apexprotocolsystem.com
- **Subject:** "[TEST] New Order: [Package Name] - $XXX"
- **Contains:**
  - Order details
  - Customer information
  - Timestamp
  - Test mode indicator

---

## What Should Happen

### ✅ Success Indicators:

1. Test mode banner appears on checkout page
2. Form validation works (try submitting empty)
3. Payment button shows "Processing..." when clicked
4. Redirects to success page
5. Customer email arrives in inbox
6. Admin emails arrive at configured addresses
7. Console logs show "Email sent successfully"

### ❌ Common Issues:

#### "Email not sending"
**Check terminal for errors:**
```bash
# Look for:
Resend not configured - skipping email send
# OR
Resend error: [error details]
```

**Solution:**
- Verify `RESEND_API_KEY` is set in `.env.local`
- Restart dev server after adding env vars
- Check Resend dashboard for domain verification

#### "Admin emails not arriving"
**Options:**
1. Check spam folder
2. Verify `admin@apexprotocolsystem.com` exists or has forwarding
3. Verify `support@apexprotocolsystem.com` exists or has forwarding
4. Or temporarily change addresses in code (see RESEND_CONFIGURATION.md)

#### "Crypto amount not showing"
**Check:**
- Internet connection (fetches live prices from CoinGecko)
- Console for API errors
- Should show loading spinner then amount

---

## Testing Real Crypto Payment Flow

### With Live Crypto (Advanced)

1. Remove `&test=true` from URL:
```
http://localhost:3000/checkout?package=starter
```

2. Follow crypto payment flow
3. You'll be redirected to `/checkout/crypto-pending` page
4. This is where you'd verify the transaction on-chain

**Note:** Full crypto verification requires additional setup (blockchain monitoring).

---

## Testing Real Card Payments

### With DodoPayments (Production)

1. Complete DodoPayments setup (see ENV_SETUP.md)
2. Add product IDs to `.env.local`:
```bash
DODO_STARTER_PRODUCT_ID=prod_xxxxx
DODO_ELITE_PRODUCT_ID=prod_xxxxx
```
3. Remove `&test=true` from URL
4. Complete actual payment via DodoPayments
5. Webhook will trigger and send real emails

---

## Monitoring

### Terminal Output
Watch for these logs:
```
Email sent successfully
Order ID: APEX-ABC123
Customer: user@example.com
```

### Resend Dashboard
1. Go to [https://resend.com/emails](https://resend.com/emails)
2. See all sent emails
3. Check delivery status
4. View email previews

---

## Next Steps After Testing

Once test emails work:

1. ✅ Configure DodoPayments products
2. ✅ Add crypto QR code images to `/public/` folder:
   - `/btc.jpeg`
   - `/eth.jpeg`
   - `/usdt.jpeg`
   - `/sol.jpeg`
   - `/ltc.jpeg`
3. ✅ Set up webhooks (see ENV_SETUP.md)
4. ✅ Test real payments in DodoPayments test mode
5. ✅ Go live!

---

## Quick Verification Checklist

Before considering setup complete:

- [ ] Test mode checkout loads correctly
- [ ] Form validation works
- [ ] Can submit test purchase
- [ ] Customer email arrives (check inbox & spam)
- [ ] Admin email arrives at both addresses
- [ ] License key is generated (visible in email)
- [ ] Order ID is unique per purchase
- [ ] Both Starter and Elite packages tested
- [ ] Both card and crypto payment methods tested
- [ ] Emails look professional (no broken HTML)

---

## Troubleshooting

### Check Environment Variables
```bash
# Print to verify (don't commit this!)
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET ✓' : 'NOT SET ✗');
console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);
```

### Force Restart
Sometimes env vars don't reload:
```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

### Clear Cache
```bash
# Nuclear option:
rm -rf .next
npm run dev
```

---

## Support

If stuck, check:
1. `RESEND_CONFIGURATION.md` - Detailed Resend setup
2. `ENV_SETUP.md` - Environment variables reference
3. Console logs in terminal and browser
4. Resend dashboard for delivery errors

Happy testing! 🚀
