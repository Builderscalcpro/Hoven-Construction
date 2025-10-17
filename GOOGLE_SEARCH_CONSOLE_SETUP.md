# 🔍 Google Search Console Verification Setup

## 📋 Current Status
- ✅ **Bing Webmaster Tools**: Verified (4A93A73460398FAD34FC270D09FAF38C)
- ⏳ **Google Search Console**: Awaiting verification token

---

## 🚀 How to Get Your Google Search Console Verification Token

### Step 1: Access Google Search Console
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Sign in with your Google account
3. Click **"Add Property"** (or select existing property)

### Step 2: Add Your Website
1. Select **"URL prefix"** property type
2. Enter: `https://heinhoven.com`
3. Click **"Continue"**

### Step 3: Get Verification Code (HTML Tag Method)
1. In the verification methods, select **"HTML tag"**
2. Copy the meta tag that looks like:
   ```html
   <meta name="google-site-verification" content="ABC123xyz..." />
   ```
3. **Copy ONLY the content value** (the long string between the quotes after `content=`)
   - Example: `ABC123xyz789DEF456ghi`

### Step 4: Add to index.html
Replace line 12 in `index.html`:
```html
<!-- BEFORE -->
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />

<!-- AFTER -->
<meta name="google-site-verification" content="YOUR_ACTUAL_TOKEN_HERE" />
```

### Step 5: Deploy & Verify
1. Deploy your updated `index.html` to production
2. Return to Google Search Console
3. Click **"Verify"** button
4. ✅ Success! Your site is now verified

---

## 🔑 Token Format Comparison

| Service | Meta Tag Name | Example Token |
|---------|---------------|---------------|
| **Google** | `google-site-verification` | `ABC123xyz789DEF456ghi` (40-50 chars) |
| **Bing** | `msvalidate.01` | `4A93A73460398FAD34FC270D09FAF38C` (32 chars) |

---

## ⚠️ Important Notes

- **Different tokens**: Google and Bing use different verification codes
- **You provided**: Bing token (msvalidate.01) - already added ✅
- **Still needed**: Google token (google-site-verification)
- **Where to find**: Google Search Console > Settings > Ownership verification > HTML tag

---

## 📞 Need Help?

If you can't find your Google verification token:
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Click **Settings** (gear icon)
3. Click **Ownership verification**
4. Under **HTML tag**, copy the content value
