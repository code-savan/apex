# Crypto Payment Verification - Complete Guide

## 🎯 How It Works

### Customer Flow:
1. User selects crypto payment on checkout
2. Sees payment instructions + QR code
3. Sends crypto to your wallet
4. Enters TX hash + name on pending page
5. Gets "verifying payment" email
6. **Waits for your manual confirmation**
7. You send them approved/rejected email

### Your Flow:
1. Receive admin notification email
2. Check blockchain verification status
3. Manually verify on blockchain explorer (if needed)
4. Send approval or rejection email to customer

---

## 🤖 Auto-Verification (FREE APIs)

The system automatically checks transactions using:

| Crypto | API Used | Status |
|--------|----------|--------|
| **BTC** | BlockCypher (200 req/hr FREE) | ✅ Auto-verifies |
| **ETH** | Etherscan (100K/day FREE) | ✅ Auto-verifies |
| **USDT** | Etherscan (same as ETH) | ✅ Auto-verifies |
| **SOL** | Solana RPC (FREE) | ✅ Auto-verifies |
| **LTC** | BlockCypher (same as BTC) | ✅ Auto-verifies |

**All FREE. No costs!**

---

## 📧 Email Flow

### 1. User Submits TX Hash → "Verifying Payment" Email

**To:** Customer
**Subject:** `⏳ Verifying Your [CRYPTO] Payment`
**Content:**
- "We're verifying your payment on the blockchain"
- "Takes 10-30 minutes"
- "You'll get confirmation email once verified"
- **NO license key yet**
- **NO "order confirmed"** yet

### 2. Admin Notification Email

**To:** admin@apexprotocolsystem.com, support@apexprotocolsystem.com
**Subject:** `🔔 [CRYPTO] Payment - [STATUS] - $[AMOUNT]`
**Content:**
- Order details
- Customer info
- TX hash
- **Auto-verification status:**
  - ✅ **CONFIRMED** → Transaction found & verified
  - ⏳ **PENDING** → Transaction not confirmed yet
  - ❌ **ERROR** → Could not auto-verify (manual check needed)

### 3. Your Manual Confirmation → Final Email

**You send this manually:**
- ✅ **If approved:** "Payment Confirmed" email with license key
- ❌ **If rejected:** "Payment Issue" email with instructions
- ⏳ **If waiting:** "Still Verifying" update email

**Templates:** See `CRYPTO_EMAIL_TEMPLATES.md`

---

## 🛠️ Setup Steps

### 1. Already Done ✅
- ✅ Crypto pending page updated
- ✅ TX hash collection form
- ✅ API route for verification (`/api/verify-crypto-payment`)
- ✅ Auto-verification using free blockchain APIs
- ✅ "Verifying payment" customer email
- ✅ Admin notification with verification status

### 2. What You Need to Do:

#### A. Add Crypto Wallet Addresses (If Not Done)

In `.env.local`:
```bash
NEXT_PUBLIC_BTC_ADDRESS=your_bitcoin_address
NEXT_PUBLIC_ETH_ADDRESS=your_ethereum_address
NEXT_PUBLIC_USDT_ADDRESS=your_usdt_address (ERC-20)
NEXT_PUBLIC_SOL_ADDRESS=your_solana_address
NEXT_PUBLIC_LTC_ADDRESS=your_litecoin_address
```

#### B. Optional: Add API Keys for Better Rate Limits

```bash
# Etherscan (optional - free tier works without key)
ETHERSCAN_API_KEY=your_key_here

# BlockCypher (optional - works without key)
BLOCKCYPHER_API_KEY=your_key_here
```

Get free keys:
- Etherscan: https://etherscan.io/register
- BlockCypher: https://accounts.blockcypher.com/signup

---

## 🎬 Testing the Flow

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Go to Crypto Checkout
```
http://localhost:3000/checkout?package=starter
```

### 3. Select Crypto Payment
- Choose any crypto (BTC, ETH, etc.)
- See QR code + wallet address

### 4. Submit TX Hash
- Click "I've Sent $XXX"
- Enter first name
- Enter any TX hash (for testing)
- Submit

### 5. Check Emails
**Customer email:**
- "Verifying payment..." message
- NO license key yet

**Admin email (your inbox):**
- Order details
- TX hash
- Verification status

### 6. Manually Verify & Respond
- Check blockchain explorer
- Send approval/rejection email using templates

---

## 📊 Verification Status Guide

### ✅ CONFIRMED
**Meaning:** Transaction found on blockchain and verified

**What to do:**
1. Generate license key
2. Open `CRYPTO_EMAIL_TEMPLATES.md`
3. Copy "Payment Confirmed" template
4. Replace placeholders
5. Send to customer
6. Done!

### ⏳ PENDING
**Meaning:** Transaction exists but not confirmed yet

**What to do:**
1. Wait 10-30 minutes
2. Check blockchain explorer manually
3. Once confirmed → send approval email
4. If still not found → send "still verifying" email

### ❌ ERROR
**Meaning:** Could not auto-verify (TX not found or API error)

**What to do:**
1. Copy TX hash from admin email
2. Check blockchain explorer manually:
   - BTC: https://blockchain.com/explorer
   - ETH: https://etherscan.io
   - SOL: https://solscan.io
   - LTC: https://blockchair.com/litecoin
3. If valid → send approval
4. If invalid/wrong amount → send rejection

---

## 🔍 Manual Verification Checklist

When checking blockchain explorer:

- [ ] **TX Hash matches** what customer submitted
- [ ] **Amount sent ≥ expected** (check USD value at time)
- [ ] **Sent to YOUR wallet** address
- [ ] **Transaction confirmed** (1+ confirmations)
- [ ] **Not pending or failed**
- [ ] **Recent timestamp** (within last 24-48 hours)

**If all ✅** → Approve payment
**If any ❌** → Reject or ask customer for clarification

---

## 🚀 Production Workflow

### Daily Routine:

**Morning:**
1. Check `admin@apexprotocolsystem.com` inbox
2. Look for crypto payment notifications
3. Verify each transaction
4. Send approval/rejection emails

**Tips:**
- Set up email filters for "[CRYPTO] Payment"
- Batch check multiple payments at once
- Keep spreadsheet of orders (OrderID, Status, Date)
- Respond within 1-2 hours if possible (customers appreciate speed)

---

## 💰 Cost Analysis

### Free Tier Limits:

| Service | Free Limit | Enough For? |
|---------|------------|-------------|
| BlockCypher | 200 req/hr | ~100 payments/hour ✅ |
| Etherscan | 5 req/sec | ~400K/day ✅ |
| Solana RPC | Unlimited | ∞ ✅ |

**Verdict:** Completely free for your volume!

**Paid tiers** only needed if you're processing 1000s/day.

---

## 🎯 Summary

**What's Automated:**
- ✅ Customer submits TX hash
- ✅ System verifies on blockchain (free APIs)
- ✅ "Verifying payment" email sent automatically
- ✅ Admin notification with verification status

**What's Manual:**
- ❌ Final approval/rejection (you send via email)
- ❌ License key generation (when approving)
- ❌ If auto-verification fails, manual blockchain check

---

## 📁 Key Files

**Frontend:**
- `app/checkout/page.tsx` - Crypto payment option
- `app/checkout/crypto-pending/page.tsx` - TX hash submission

**Backend:**
- `app/api/verify-crypto-payment/route.ts` - Verification API

**Email Templates:**
- `CRYPTO_EMAIL_TEMPLATES.md` - Manual email templates

**Documentation:**
- `CRYPTO_VERIFICATION_SETUP.md` - This file
- `PAYMENT_VERIFICATION_GUIDE.md` - General payment setup

---

## 🆘 Troubleshooting

**"Auto-verification always fails"**
- Check if blockchain APIs are accessible
- Try manual verification on explorer
- Make sure TX hash format is correct

**"Customer says they sent but we don't see it"**
- Ask for:
  - Screenshot of transaction
  - Their wallet address (sender)
  - Exact amount sent
  - Which network (BSC vs ETH, etc.)

**"Wrong amount sent"**
- Crypto prices fluctuate
- Accept if within ±5% of expected USD value
- Or ask customer to send difference

---

## ✨ Next Level (Optional)

Want to fully automate everything?

**Option 1: Use NOWPayments**
- https://nowpayments.io
- Handles everything (verification + emails)
- 0.5-1% fee
- Worth it for high volume

**Option 2: Keep Current System**
- Works great for <100 payments/day
- Free
- You have full control

---

Need help? Check:
- `CRYPTO_EMAIL_TEMPLATES.md` for email drafts
- `PAYMENT_VERIFICATION_GUIDE.md` for card payments
- Admin notification emails for TX details

Good luck! 🚀
