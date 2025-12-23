# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with these variables:

```bash
# ===========================================
# APEX Protocol Environment Variables
# ===========================================

# Base URL (for redirects and emails)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ===========================================
# DODO PAYMENTS (Card Payments)
# ===========================================
# Get these from: https://dashboard.dodopayments.com/
DODO_PAYMENTS_API_KEY=your_dodo_api_key
DODO_WEBHOOK_KEY=your_webhook_secret
DODO_TEST_MODE=true

# Product IDs from DodoPayments dashboard
DODO_STARTER_PRODUCT_ID=prod_starter_xxx
DODO_ELITE_PRODUCT_ID=prod_elite_xxx

# ===========================================
# RESEND (Email)
# ===========================================
# Get from: https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=APEX Protocol <noreply@yourdomain.com>

# ===========================================
# CRYPTO WALLET ADDRESSES
# ===========================================
# Your receiving addresses for crypto payments
NEXT_PUBLIC_BTC_ADDRESS=1F5zkR25VXA9eRSqjWKH7rM7w15qmGgr5F
NEXT_PUBLIC_ETH_ADDRESS=0x146530c7e40cffd4c2d1579073d40227d1ad5759
NEXT_PUBLIC_USDT_ADDRESS=TPDckwaqQ8oShd28htUpvmUFWTkk3Mgsfm
NEXT_PUBLIC_SOL_ADDRESS=2BG35UaSoyySmnthoQdSCo7LH1w4apfQ3cszCVVVocgp
NEXT_PUBLIC_LTC_ADDRESS=LPsxTKzztyszVhqw6jPzaRWRZ9KHyfj7Nn
NEXT_PUBLIC_USDC_ADDRESS=0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Testing Without Real Payments

Add `?test=true` to any checkout URL to enable test mode:

```
http://localhost:3000/checkout?package=starter&test=true
http://localhost:3000/checkout?package=elite&test=true
```

In test mode:
- No actual payment is processed
- Email confirmation is still sent (if Resend is configured)
- You're redirected to success page immediately
- A banner shows indicating test mode

## DodoPayments Setup

1. Create account at [DodoPayments](https://dodopayments.com)
2. Go to Dashboard → Developer → API
3. Generate API key and add to `DODO_PAYMENTS_API_KEY`
4. Create products (one-time payments) for Starter and Elite packages
5. Copy product IDs to `DODO_STARTER_PRODUCT_ID` and `DODO_ELITE_PRODUCT_ID`

## Resend Setup

### Step 1: Create Resend Account
1. Go to [Resend](https://resend.com) and sign up
2. Verify your email address

### Step 2: Add and Verify Your Domain
1. In Resend dashboard, go to **Domains** → **Add Domain**
2. Enter your domain: `apexprotocolsystem.com`
3. Add the DNS records shown (TXT, MX, CNAME) to your domain provider
4. Wait for verification (usually takes 5-30 minutes)

### Step 3: Create API Key
1. Go to **API Keys** → **Create API Key**
2. Name it "APEX Production" or similar
3. Copy the key and add to `.env.local` as `RESEND_API_KEY`

### Step 4: Configure FROM Email
In your `.env.local`, set:
```bash
RESEND_FROM_EMAIL=APEX Protocol <support@apexprotocolsystem.com>
```

**Important:** The email domain must match your verified domain in Resend.

### Email Flow
When a purchase is made:
1. **Customer** receives order confirmation at their email
2. **Admin & Support** receive notification at:
   - `admin@apexprotocolsystem.com`
   - `support@apexprotocolsystem.com`

Make sure these email addresses exist in your domain or set up email forwarding.

## Crypto Addresses

Add your actual wallet addresses for each supported cryptocurrency:
- Bitcoin (BTC)
- Ethereum (ETH)
- Tether (USDT) - ERC-20
- Solana (SOL)
- Litecoin (LTC)
- USD Coin (USDC) - ERC-20
