# 📊 Google Sheets Integration Setup Guide

## Overview

APEX Protocol automatically saves lead and customer data to Google Sheets for easy tracking.

**Two Sheets:**
1. **Leads Sheet** - Captures all visitors who start checkout (name + email)
2. **Customers Sheet** - Captures confirmed payments with full order details

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Google Sheets

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet: **"APEX Leads"**
3. Set up columns in Sheet1:
   ```
   A: Name
   B: Email
   C: Package
   D: Timestamp
   E: Source
   ```

4. Create another spreadsheet: **"APEX Customers"**
5. Set up columns in Sheet1:
   ```
   A: Name
   B: Email
   C: Package
   D: Payment Method
   E: Amount
   F: Order ID
   G: Timestamp
   H: Source
   ```

---

### Step 2: Set Up Google Apps Script (Webhook)

#### For Leads Sheet:

1. In your **APEX Leads** sheet, click **Extensions** → **Apps Script**
2. Delete existing code and paste:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.name,
      data.email,
      data.package,
      data.timestamp,
      data.source
    ]);

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Deploy** → **New deployment**
4. **Type**: Web app
5. **Execute as**: Me
6. **Who has access**: Anyone
7. Click **Deploy**
8. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/...`)
9. Click **Authorize access** and allow permissions

#### For Customers Sheet:

1. In your **APEX Customers** sheet, click **Extensions** → **Apps Script**
2. Delete existing code and paste:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.name,
      data.email,
      data.package,
      data.paymentMethod,
      data.amount,
      data.orderId,
      data.timestamp,
      data.source
    ]);

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Repeat deploy steps above
4. **Copy the Web App URL**

---

### Step 3: Add URLs to Environment Variables

Add to your `.env.local` file:

```bash
# Google Sheets Webhooks
GOOGLE_SHEETS_LEADS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_LEADS_WEBHOOK_ID/exec
GOOGLE_SHEETS_CUSTOMERS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_CUSTOMERS_WEBHOOK_ID/exec
```

Replace with your actual webhook URLs from Step 2.

---

### Step 4: Restart Your Dev Server

```bash
npm run dev
```

---

## 🧪 Testing

### Test Leads Capture:

1. Go to your landing page
2. Click any "Get Instant Access" button
3. Fill in name and email in the modal
4. Click "Continue to Checkout"
5. Check your **APEX Leads** sheet - new row should appear!

### Test Customer Capture:

1. Complete a test purchase (use `?test=true` mode)
2. After payment confirmation
3. Check your **APEX Customers** sheet - new row should appear!

---

## 📊 Sheet Structure

### Leads Sheet (Pre-Checkout):

| Name | Email | Package | Timestamp | Source |
|------|-------|---------|-----------|--------|
| John Doe | john@example.com | APEX Protocol Starter | 2026-01-18T10:30:00.000Z | Landing Page - Pre-Checkout |

### Customers Sheet (Post-Payment):

| Name | Email | Package | Payment Method | Amount | Order ID | Timestamp | Source |
|------|-------|---------|----------------|--------|----------|-----------|--------|
| John Doe | john@example.com | Starter Protocol | Card | 499 | ORD-123456 | 2026-01-18T10:35:00.000Z | Checkout - Payment Confirmed |

---

## 🔧 Troubleshooting

### "Leads not showing in sheet"

**Check:**
1. ✅ Webhook URL is correct in `.env.local`
2. ✅ Apps Script is deployed as "Web app"
3. ✅ Access is set to "Anyone"
4. ✅ Dev server was restarted after adding env vars
5. ✅ Check browser console for errors

**Test webhook manually:**
```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","package":"Test","timestamp":"2026-01-18T10:00:00.000Z","source":"Manual Test"}'
```

### "Permission denied"

1. Go to Apps Script
2. Click **Deploy** → **Manage deployments**
3. Click ⚙️ (gear icon) → **Edit**
4. Make sure "Who has access" is set to **Anyone**
5. Click **Deploy**

### "Webhook not firing"

1. Open Apps Script
2. Click **Executions** (left sidebar)
3. Check for error logs
4. Common fix: Redeploy with new version

---

## 💡 Pro Tips

### 1. Add Automatic Timestamps

In Google Sheets, use this formula in any cell:
```
=NOW()
```
This creates a live timestamp (updates on each edit).

### 2. Add Data Validation

1. Select email column (B)
2. Data → Data validation
3. Criteria: Text contains "@"
4. This highlights invalid emails

### 3. Create Dashboard

Use Google Sheets charts to visualize:
- Leads per day
- Conversion rate (Customers ÷ Leads)
- Most popular package
- Payment method breakdown

### 4. Set Up Notifications

1. Tools → Notification rules
2. "Notify me when: A user submits a form"
3. Get email alerts for new leads!

### 5. Export to CRM

Most CRMs (HubSpot, Salesforce, etc.) can import from Google Sheets:
- File → Download → CSV
- Or use Zapier for automatic sync

---

## 📧 Email Integration (Optional)

Want email notifications? Add to Apps Script:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  // Save to sheet
  sheet.appendRow([
    data.name,
    data.email,
    data.package,
    data.timestamp,
    data.source
  ]);

  // Send email notification
  MailApp.sendEmail({
    to: "your-email@example.com",
    subject: "🚀 New APEX Lead: " + data.name,
    body: "Name: " + data.name + "\n" +
          "Email: " + data.email + "\n" +
          "Package: " + data.package + "\n" +
          "Timestamp: " + data.timestamp
  });

  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

## 🔐 Security Notes

1. **Webhook URLs are public** - Don't store sensitive data
2. **Rate limiting** - Google limits to 10,000 requests/day (plenty for most sites)
3. **No authentication** - Anyone with webhook URL can post data (this is fine for leads)
4. **Data retention** - Google Sheets can handle 10 million cells (about 250K rows with 4 columns)

---

## 📊 Spreadsheet Permissions

### For Your Team:

1. Click **Share** (top right of sheet)
2. Add team members with **Editor** access
3. They can view/edit data

### For Clients/Investors:

1. Click **Share**
2. Add with **Viewer** access
3. They can see data but not edit

---

## 🎯 What Gets Captured?

### Leads (Pre-Checkout):
- ✅ Name
- ✅ Email
- ✅ Package interest
- ✅ Timestamp
- ✅ Source (always "Landing Page - Pre-Checkout")

### Customers (Post-Payment):
- ✅ Name
- ✅ Email
- ✅ Package purchased
- ✅ Payment method (Card/Crypto)
- ✅ Amount paid
- ✅ Order ID
- ✅ Timestamp
- ✅ Source (always "Checkout - Payment Confirmed")

---

## ✅ Quick Checklist:

- [ ] Created "APEX Leads" Google Sheet
- [ ] Set up columns in Leads sheet
- [ ] Created Apps Script for Leads
- [ ] Deployed as Web App (Anyone access)
- [ ] Copied Leads webhook URL
- [ ] Created "APEX Customers" Google Sheet
- [ ] Set up columns in Customers sheet
- [ ] Created Apps Script for Customers
- [ ] Deployed as Web App (Anyone access)
- [ ] Copied Customers webhook URL
- [ ] Added both URLs to `.env.local`
- [ ] Restarted dev server
- [ ] Tested leads capture
- [ ] Tested customer capture

---

**Done! Your Google Sheets integration is live. All leads and customers will automatically save to your sheets.** 📊✅

Need help? Check the troubleshooting section or test the webhook manually with curl.
