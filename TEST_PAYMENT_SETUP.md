# Test Payment Page Setup

## Overview

A simple $1 test payment page that:
- ✅ Only accepts card payments (no crypto)
- ✅ Always uses LIVE mode (never test mode)
- ✅ Collects NO user information
- ✅ Processes real $1 payments via DodoPayments

## Access the Page

```
http://localhost:3000/test-payment
```

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# API Key - Use LIVE key for real payments
DODO_PAYMENTS_API_KEY=sk_live_your_actual_live_key_here

# Product ID - Must be a LIVE product that costs $1
DODO_TEST_PRODUCT_ID=prd_your_one_dollar_product_id

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Setup Steps

### 1. Create $1 Product in Dodo Dashboard

1. Go to your DodoPayments dashboard
2. **Switch to LIVE mode** (toggle at top)
3. Go to Products section
4. Click "Create Product"
5. Set:
   - Name: "Test Payment" (or any name)
   - Price: $1.00
   - Currency: USD
   - Type: One-time payment
6. Save and copy the product ID (starts with `prd_`)

### 2. Get Your LIVE API Key

1. In Dodo dashboard, go to Settings → API Keys
2. **Make sure you're in LIVE mode**
3. Copy your LIVE API key (starts with `sk_live_`)
4. This key will process REAL payments

### 3. Update .env.local

```bash
DODO_PAYMENTS_API_KEY=sk_live_xxxxxxxxxxxxx
DODO_TEST_PRODUCT_ID=prd_xxxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Restart Your Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### 5. Test the Payment

1. Go to `http://localhost:3000/test-payment`
2. Click "Pay $1"
3. Complete payment with a real card
4. You'll be redirected to success page

## Important Notes

⚠️ **This processes REAL payments**
- Every transaction charges a real card $1
- Money goes to your Dodo account
- There is NO test mode for this page

💳 **Card Payment Only**
- No cryptocurrency options
- Direct card payment through DodoPayments

🔒 **No Information Collection**
- No email required
- No name required
- No phone required
- Just click and pay

## File Structure

```
app/
├── test-payment/
│   ├── page.tsx              # Main payment page
│   └── success/
│       └── page.tsx          # Success page after payment
└── api/
    └── create-test-checkout/
        └── route.ts          # API endpoint for checkout
```

## Troubleshooting

### Error: "Payment service not configured"
- Check that `DODO_PAYMENTS_API_KEY` is set in `.env.local`
- Restart your dev server after adding it

### Error: "Product not configured"
- Check that `DODO_TEST_PRODUCT_ID` is set in `.env.local`
- Make sure it's a LIVE product ID (starts with `prd_`)

### Error: "Authentication failed"
- You might be using a test API key
- Switch to your LIVE API key (`sk_live_...`)

### Error: "Product not found"
- The product ID might not exist
- Make sure you're using a LIVE product ID
- Verify the product exists in LIVE mode in your Dodo dashboard

### Payment doesn't process
- Check browser console for errors
- Check terminal/server logs for detailed error messages
- Verify your Dodo account is fully set up and verified

## Testing with Real Cards

Since this is in LIVE mode, you need to use real cards. Options:

1. **Use a low-limit prepaid card** for testing
2. **Use your own card** and refund after testing
3. **Ask team members** to test with their cards

## Refunding Test Payments

To refund the $1 test payments:

1. Go to Dodo dashboard
2. Find the transaction in Payments/Transactions
3. Click on it
4. Click "Refund"
5. Confirm refund

Refunds typically process within 5-10 business days.
