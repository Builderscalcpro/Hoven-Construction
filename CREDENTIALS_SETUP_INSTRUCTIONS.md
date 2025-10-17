# 🔑 Credentials Setup - Interactive Input Form

## Access the Setup Page

Navigate to: **http://localhost:5173/credentials-setup**

This page provides an interactive form where you can enter all your OAuth secrets and API keys.

## Features

✅ **Organized Tabs**: Required vs Optional credentials
✅ **Input Validation**: Shows which fields are required
✅ **Live Preview**: See your .env file content before copying
✅ **One-Click Copy**: Copy all credentials to clipboard
✅ **Pre-filled Values**: Already includes known credentials from your project

## How to Use

1. **Open the page**: Visit `/credentials-setup` in your browser
2. **Fill in Required Tab**: Enter all required credentials:
   - Supabase Anon Key (if not already filled)
   - Google OAuth Client Secret
   - Stripe Publishable Key
3. **Fill in Optional Tab** (if needed):
   - Microsoft OAuth credentials
   - Anthropic API Key
   - SendGrid API Key
4. **Click "Show Content"**: Review the generated .env content
5. **Click "Copy to Clipboard"**: Copy all credentials
6. **Paste into .env**: Open your .env file and paste
7. **Restart Dev Server**: Run `npm run dev` again

## Required Credentials

### 1. **Supabase Anon Key**
- Location: Supabase Dashboard → Settings → API
- Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2. **Google OAuth Client Secret**
- Location: Google Cloud Console → APIs & Services → Credentials
- Format: `GOCSPX-xxxxxxxxxxxxxxxxxxxxx`

### 3. **Stripe Publishable Key**
- Location: Stripe Dashboard → Developers → API Keys
- Format: `pk_live_xxxxxxxxxxxxxxxxxxxxx` or `pk_test_xxxxxxxxxxxxxxxxxxxxx`

## Optional Credentials

### Microsoft OAuth (for Outlook Calendar)
- Client ID: Azure AD Application ID
- Client Secret: Azure AD Client Secret Value

### Anthropic API Key (for AI Chatbot)
- Location: Anthropic Console → API Keys
- Format: `sk-ant-xxxxxxxxxxxxxxxxxxxxx`

### SendGrid API Key (for Email)
- Location: SendGrid Dashboard → Settings → API Keys
- Format: `SG.xxxxxxxxxxxxxxxxxxxxx`

## After Setup

1. Save the .env file
2. Restart your development server
3. Test the integrations in the admin dashboard
4. Visit `/admin/api-testing` to verify all connections

## Security Notes

⚠️ **Never commit your .env file to version control**
⚠️ **Keep your API keys secure**
⚠️ **Use test keys during development**
⚠️ **Switch to production keys only when deploying**

## Troubleshooting

**Can't see the page?**
- Make sure your dev server is running
- Clear browser cache
- Try incognito mode

**Copy button disabled?**
- Fill in all required fields first
- Check for validation errors

**Keys not working?**
- Verify keys are copied correctly (no extra spaces)
- Check key permissions in respective dashboards
- Ensure redirect URLs are configured correctly
