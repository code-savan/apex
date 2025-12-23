# Resend Email Configuration Guide

## Overview
This guide will help you configure Resend to send transactional emails for APEX Protocol purchases.

---

## 1. Create Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Click **Sign Up** (it's free to start)
3. Verify your email address

---

## 2. Add Your Domain

### In Resend Dashboard:

1. Click **Domains** in the left sidebar
2. Click **Add Domain**
3. Enter: `apexprotocolsystem.com`
4. Click **Add**

### Add DNS Records to Your Domain Provider:

Resend will show you 3-4 DNS records to add. You need to add these to wherever you manage your domain (GoDaddy, Namecheap, Cloudflare, etc.):

**Example records** (yours will be different):

```
Type: TXT
Name: _resend
Value: resend-domain-verification=xxxxxxxxx

Type: MX
Name: @
Value: mx.resend.com
Priority: 10

Type: TXT
Name: @
Value: v=spf1 include:amazonses.com ~all

Type: CNAME
Name: resend._domainkey
Value: resend._domainkey.resend.com
```

### Verification:
- DNS propagation takes **5-30 minutes**
- Resend will automatically verify once DNS is updated
- You'll see a green checkmark when verified ✓

---

## 3. Create API Key

1. In Resend dashboard, click **API Keys**
2. Click **Create API Key**
3. Name it: `APEX Production`
4. Permission: **Full Access** (default)
5. Click **Add**
6. **Copy the key immediately** (you won't see it again!)

Example key format: `re_123abc456def789ghi`

---

## 4. Update Environment Variables

In your `.env.local` file, add:

```bash
# Resend Configuration
RESEND_API_KEY=re_your_actual_key_here
RESEND_FROM_EMAIL=APEX Protocol <support@apexprotocolsystem.com>
```

**Important Notes:**
- The FROM email domain **MUST** match your verified domain
- Use `support@apexprotocolsystem.com` as the sender
- Format: `Display Name <email@domain.com>`

---

## 5. Configure Email Addresses

### Admin/Support Emails
The system sends notifications to these addresses:
- `admin@apexprotocolsystem.com`
- `support@apexprotocolsystem.com`

### Setup Options:

**Option A: Create Actual Mailboxes**
- Create these email addresses in your email hosting (recommended)
- You'll receive actual emails there

**Option B: Email Forwarding**
- Set up forwarding rules in your domain provider
- Forward both to your personal/business email
- Example: Forward both → `yourname@gmail.com`

**Option C: Update the Code**
- If you want different addresses, edit:
- File: `app/api/send-confirmation/route.ts`
- Line with: `to: ["admin@apexprotocolsystem.com", "support@apexprotocolsystem.com"]`
- Change to your preferred addresses

---

## 6. Test the Setup

### Test Mode (No Real Payment):

1. Start your development server:
```bash
npm run dev
```

2. Visit test checkout URL:
```
http://localhost:3000/checkout?package=starter&test=true
```

3. Fill out the form with:
   - Your real email (to receive test email)
   - Any name
   - Click "Pay with Card"

4. Check your inbox:
   - ✓ Customer should receive order confirmation
   - ✓ Admin/support addresses should receive notification

### What to Look For:

**Customer Email:**
- Subject: "🎉 Order Confirmed - Starter Protocol | APEX Protocol™"
- Contains order details, license key, next steps
- Professional APEX branded design

**Admin Email:**
- Subject: "[TEST] New Order: Starter Protocol - $499"
- Contains customer info, order details, timestamp
- Clear admin-focused layout

---

## 7. Troubleshooting

### Email Not Sending?

**Check 1: API Key**
```bash
# In .env.local - verify this is set:
RESEND_API_KEY=re_xxxxx
```

**Check 2: Domain Verification**
- Go to Resend → Domains
- Make sure domain shows green checkmark ✓
- If not, check DNS records

**Check 3: FROM Email**
```bash
# Must use YOUR verified domain:
RESEND_FROM_EMAIL=APEX Protocol <support@apexprotocolsystem.com>
# NOT: onboarding@resend.dev (that's only for testing)
```

**Check 4: Console Logs**
- Look at terminal running `npm run dev`
- Check for Resend errors
- Look for "Email sent successfully" messages

### Common Errors:

**Error: "Domain not verified"**
- Solution: Wait for DNS to propagate (up to 30 min)
- Verify DNS records are correct

**Error: "Invalid API key"**
- Solution: Regenerate key in Resend dashboard
- Copy it correctly (no spaces)

**Error: "Email not delivered"**
- Check spam folder
- Verify recipient email is valid
- Check Resend logs (in dashboard)

---

## 8. Resend Dashboard - Monitoring

### View Sent Emails:
1. Go to Resend dashboard
2. Click **Emails** in sidebar
3. See all sent emails, delivery status, opens (if tracking enabled)

### Check Logs:
- Real-time delivery status
- Bounce notifications
- Failed sends

---

## 9. Production Checklist

Before going live:

- [ ] Domain verified in Resend ✓
- [ ] API key added to `.env.local` ✓
- [ ] FROM email uses verified domain ✓
- [ ] Admin emails exist or forward correctly ✓
- [ ] Test purchase completed successfully ✓
- [ ] Customer email received and looks good ✓
- [ ] Admin notification received ✓
- [ ] Check spam folders (shouldn't be there) ✓
- [ ] Remove `?test=true` for real payments ✓

---

## 10. Email Customization (Optional)

Want to customize the emails?

**Customer Confirmation Email:**
- File: `app/api/send-confirmation/route.ts`
- Edit the `emailHtml` variable (line ~18)
- It's HTML - modify text, colors, layout

**Admin Notification Email:**
- File: `app/api/send-confirmation/route.ts`
- Function: `createAdminNotificationEmail`
- Bottom of file (~line 220)

---

## Need Help?

**Resend Support:**
- Docs: [https://resend.com/docs](https://resend.com/docs)
- Discord: [https://resend.com/discord](https://resend.com/discord)

**DNS Help:**
- Use [https://dnschecker.org](https://dnschecker.org) to verify DNS propagation
- Check if MX, TXT, CNAME records are visible globally

---

## Summary

Once configured, here's what happens automatically:

1. **User makes purchase** → Checkout page
2. **Payment processes** → DodoPayments or crypto
3. **Webhook fires** → Your API endpoint
4. **2 Emails sent:**
   - Customer gets order confirmation + license key
   - Admin/support get notification with details
5. **Done!** → User has access, you're notified

✨ Professional, automated, reliable.
