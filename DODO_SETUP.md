# DodoPayments Setup Guide

## Current Error: "Unauthorized"

This error typically means one of the following:

### 1. API Key Mismatch
- Your API key doesn't match the test/live mode
- **Solution**: Make sure you're using a **test API key** when `DODO_TEST_MODE=true`
- Test API keys usually start with `sk_test_...`
- Live API keys usually start with `sk_live_...`

### 2. Product ID Issues
From your error, the product ID is: `pdt_0NUgJTxpHzJcK8mJVTTy4`

Check in your Dodo dashboard:
- Does this product exist in TEST mode?
- Is it active/published?
- Does it have a price set?

### 3. API Key Permissions
- Verify your API key has "Create Checkout" permissions
- You can check this in your Dodo dashboard under API settings

## Required Environment Variables

Create a `.env.local` file with:

```bash
# Test Mode (for development)
DODO_TEST_MODE=true

# API Key (must be TEST key when DODO_TEST_MODE=true)
DODO_PAYMENTS_API_KEY=sk_test_your_key_here

# Product IDs (must be TEST mode products when DODO_TEST_MODE=true)
DODO_TEST_PRODUCT_ID=pdt_0NUgJTxpHzJcK8mJVTTy4
DODO_STARTER_PRODUCT_ID=pdt_your_starter_test_id
DODO_ELITE_PRODUCT_ID=pdt_your_elite_test_id

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Debugging Steps

1. **Verify API Key**:
   - Log into Dodo dashboard
   - Go to Settings → API Keys
   - Copy your **TEST** API key (starts with `sk_test_`)
   - Make sure it has "Create Checkout" permission

2. **Verify Product IDs**:
   - Go to Products section in Dodo dashboard
   - Make sure you're in **TEST** mode (toggle at top)
   - Find your products and copy their IDs
   - Product IDs in test mode start with `pdt_`
   - Product IDs in live mode start with `prd_`

3. **Check API Endpoint**:
   - Test mode uses: `https://test.dodopayments.com/checkouts`
   - Live mode uses: `https://live.dodopayments.com/checkouts`

4. **Test with cURL** (optional):
   ```bash
   curl -X POST https://test.dodopayments.com/checkouts \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TEST_API_KEY" \
     -d '{
       "product_cart": [{
         "product_id": "pdt_0NUgJTxpHzJcK8mJVTTy4",
         "quantity": 1
       }],
       "customer": {
         "email": "test@example.com",
         "name": "Test User"
       },
       "return_url": "http://localhost:3000/checkout/success"
     }'
   ```

## Common Fixes

### Fix 1: API Key Mode Mismatch
If you're using a **live** API key with **test** products (or vice versa), you'll get "Unauthorized".

**Solution**: Match the key to the mode:
- Test mode → Use test API key (`sk_test_...`) + test products (`pdt_...`)
- Live mode → Use live API key (`sk_live_...`) + live products (`prd_...`)

### Fix 2: Product Doesn't Exist
The product ID might not exist in your account.

**Solution**:
1. Go to Dodo dashboard
2. Create a new product in TEST mode
3. Copy the product ID
4. Update your `.env.local` with the correct ID

### Fix 3: API Key Expired or Invalid
Your API key might be invalid or revoked.

**Solution**:
1. Generate a new API key in Dodo dashboard
2. Update `.env.local` with the new key
3. Restart your Next.js server

## After Fixing

1. Update your `.env.local` file
2. Restart the Next.js development server:
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart
   npm run dev
   ```
3. Try the payment again

## Need More Help?

Check the server logs in your terminal for detailed error information. The error should now show:
- Status code
- API URL being called
- Product ID being used
- Test mode status
