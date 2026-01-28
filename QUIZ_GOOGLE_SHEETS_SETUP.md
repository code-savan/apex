# Quiz Data Google Sheets Setup

## Overview
The quiz funnel saves data to two Google Sheets:
1. **Leads Sheet** - General leads tracking (existing)
2. **Quiz Sheet** - Detailed quiz responses (new)

## Environment Variables

Add this to your `.env.local`:

```env
# Existing - for leads
GOOGLE_SHEETS_LEADS_WEBHOOK_URL=your_existing_leads_webhook_url

# New - for quiz data
GOOGLE_SHEETS_QUIZ_WEBHOOK_URL=your_new_quiz_webhook_url
```

## Quiz Sheet Setup

### Step 1: Create a New Google Sheet

1. Go to Google Sheets and create a new spreadsheet
2. Name it "APEX Protocol - Quiz Responses"
3. Create headers in Row 1:

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Name | Email | Phone | Lead Score | Urgency | Buying Power | Losses | Education Spent | Experience Level | Main Blocker | Goal Motivation | Source |

### Step 2: Create Google Apps Script Webhook

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code and paste this:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Append the data as a new row
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.leadScore || 0,
      data.urgency || '',
      data.buyingPower || '',
      data.losses || 0,
      data.educationSpent || 0,
      data.experienceLevel || '',
      data.mainBlocker || '',
      data.goalMotivation || '',
      data.source || 'quiz'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Deploy > New deployment**
4. Select **Web app**
5. Set:
   - Description: "Quiz Data Webhook"
   - Execute as: "Me"
   - Who has access: "Anyone"
6. Click **Deploy**
7. Copy the Web app URL - this is your `GOOGLE_SHEETS_QUIZ_WEBHOOK_URL`

### Step 3: Update Environment Variables

Add the webhook URL to your `.env.local`:

```env
GOOGLE_SHEETS_QUIZ_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## Data Flow

### Quiz Start (Email Capture)
- Saves to: Leads Sheet
- Data: name, email, phone, source="quiz_start"

### Quiz Complete
- Saves to: Quiz Sheet (detailed data)
- Saves to: Leads Sheet (summary)
- Data includes:
  - Lead Score (0-100)
  - Urgency level (hot/warm/medium/cold)
  - Buying Power (low/medium/high/very-high/cold)
  - Estimated losses ($)
  - Education spent ($)
  - Experience level
  - Main blocker
  - Goal motivation

### Landing Page Visit (from Quiz)
- When user clicks CTA on results page and lands on main page
- Saves to: Leads Sheet
- Data: name, email, source="Quiz Lead - Score: X, Urgency: Y"

## URL Parameters

When users are redirected from quiz to landing page, these params are passed:

```
/?source=quiz&score=75&losses=5000&spent=2000&urgency=hot&email=user@example.com&name=John%20Doe
```

The landing page reads these and:
1. Skips the email modal (already has name/email)
2. Goes directly to checkout when CTA is clicked
3. Saves the lead data to Google Sheets

## Testing

1. Complete the quiz at `/quiz`
2. Check your Quiz Google Sheet for the detailed entry
3. Check your Leads Google Sheet for the summary entry
4. Click "View APEX Protocol Pricing" on results page
5. Landing page should recognize you (no email modal on CTA click)
6. Check Leads Sheet for the "Quiz Visitor" entry
