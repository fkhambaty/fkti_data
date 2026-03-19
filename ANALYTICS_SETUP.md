# FKTI Analytics - Central Storage Setup Guide

## Problem
The current analytics system uses `localStorage` which only stores data on the user's device. This means:
- If you access from laptop, then mobile, the count doesn't increment
- Data is not synced across devices
- Analytics are device-specific, not global

## Solution
We've implemented a central storage system that stores analytics data on the internet (server), so it works across all devices.

## Setup Instructions

### Option 1: Deploy to Vercel (Recommended - Free)

1. **Create a Vercel account** at https://vercel.com
2. **Install Vercel CLI**: `npm i -g vercel`
3. **Deploy the API**:
   ```bash
   cd /Users/fakhruddinkhambaty/Downloads/FKTI/Website
   vercel
   ```
4. **Update the URL** in `index.html`:
   - Find: `const BACKEND_URL = 'https://fkti-analytics.vercel.app/api/analytics';`
   - Replace with your Vercel deployment URL

### Option 2: Deploy to Netlify (Free)

1. **Create a Netlify account** at https://netlify.com
2. **Create `netlify/functions/analytics.js`** (copy from `api/analytics.js`)
3. **Deploy** via Netlify dashboard or CLI
4. **Update the URL** in `index.html`

### Option 3: Use Firebase (Free Tier)

1. **Create Firebase project** at https://firebase.google.com
2. **Enable Firestore Database**
3. **Add Firebase SDK** to `index.html`:
   ```html
   <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
   <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js"></script>
   ```
4. **Uncomment Firebase code** in `saveToCloud()` function
5. **Initialize Firebase** with your config

### Option 4: Use Supabase (Free Tier)

1. **Create Supabase project** at https://supabase.com
2. **Create `analytics` table**:
   ```sql
   CREATE TABLE analytics (
     id TEXT PRIMARY KEY,
     data JSONB,
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```
3. **Add Supabase SDK** to `index.html`
4. **Uncomment Supabase code** in `saveToCloud()` function

### Option 5: Use Your Own Server

1. **Set up a Node.js server** with Express
2. **Use the provided `api/analytics.js`** as a template
3. **Add a database** (MongoDB, PostgreSQL, etc.) for persistence
4. **Update `BACKEND_URL`** in `index.html` to point to your server

## Current Status

The code is ready but needs a backend to be deployed. Currently, it falls back to `localStorage` if the backend is not available.

## Testing

1. Deploy the backend API
2. Update the `BACKEND_URL` in `index.html`
3. Access the website from different devices
4. Check admin analytics - counts should sync across devices

## Notes

- The API file is in `api/analytics.js`
- For production, add a database (not in-memory storage)
- Add authentication to protect the analytics endpoint
- Consider rate limiting to prevent abuse

---

## Admin Analytics Dashboard (Supabase)

The **Admin Analytics** page (`admin/analytics.html`) shows page views, events, and visitors. It is protected by a passcode and calls the Supabase Edge Function `get-analytics`.

### Securing the passcode (required for production)

**Do not rely on the default behaviour.** Set a secret passcode so only you can access the dashboard:

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **Project Settings** → **Edge Functions** (or **Settings** → **Edge Functions**).
3. Add a secret: **Name** = `ADMIN_PASSCODE`, **Value** = a strong passphrase only you know (e.g. a long random string or a password you keep in a password manager).
4. Redeploy the `get-analytics` Edge Function if needed so it picks up the new secret.

After this, only that passcode will grant access. The dashboard login screen does **not** reveal how the passcode is generated; share the passcode only through a secure channel. Keep `ADMIN_PASSCODE` confidential and do not commit it to the repo.

**If you have not set `ADMIN_PASSCODE` yet:** The Edge Function accepts today's date in **DDMMYYYY** (Indian Standard Time) as a temporary passcode so you can access the dashboard. Set `ADMIN_PASSCODE` and use that passcode instead for production.


