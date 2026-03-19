# Deploy Edge Functions (create-subscription, etc.)

Your Supabase project is already linked (ref: `gfskxboxvzuwozknfulo`). Deploy from your machine where the code lives.

## 1. Install Supabase CLI (if needed)

```bash
# macOS (Homebrew)
brew install supabase/tap/supabase

# Or npm
npm install -g supabase
```

## 2. Log in and link project

From the **Website** repo root (parent of `supabase/`):

```bash
cd /Users/fakhruddinkhambaty/Downloads/FKTI/Website
supabase login
supabase link --project-ref gfskxboxvzuwozknfulo
```

Use your Supabase account when prompted. If the project is already linked, `supabase link` may be skipped.

## 3. Deploy the function

Deploy **only** `create-subscription`:

```bash
supabase functions deploy create-subscription
```

Deploy **all** functions in `supabase/functions/`:

```bash
supabase functions deploy
```

Deploy **send-email** (Auth hook — use `--no-verify-jwt`):

```bash
supabase functions deploy send-email --no-verify-jwt
```

You’ll see a success message and the function URL (e.g. `https://gfskxboxvzuwozknfulo.supabase.co/functions/v1/create-subscription`).

## 4. After changing secrets

Secrets are set in **Dashboard → Project Settings → Edge Functions → Secrets**.  
After adding or editing secrets, **redeploy** so the function sees them:

```bash
supabase functions deploy create-subscription
```

## 5. Verify

- In **Dashboard → Edge Functions → create-subscription**, the **Code** tab should match your local `supabase/functions/create-subscription/index.ts`.
- Use **Test** in the dashboard or trigger “Upgrade to Pro” on the site and check **Invocations** / **Logs**.

---

## 6. Welcome / signup emails (send-email Auth Hook)

To fix “no welcome email on signup”, use Resend for **all** auth emails (signup confirmation, password reset) via the Send Email hook.

### 6.1 Secrets

In **Dashboard → Project Settings → Edge Functions → Secrets**, ensure:

- `RESEND_API_KEY` — same key you use for Pro welcome emails (already set).
- `SEND_EMAIL_HOOK_SECRET` — you get this when you add the hook (step 6.2). It looks like `v1,whsec_<base64>`.

### 6.2 Enable the Send Email hook

1. In Supabase Dashboard go to **Authentication → Hooks**.
2. Under **Send Email**, choose **HTTP** and set:
   - **URL:** `https://gfskxboxvzuwozknfulo.supabase.co/functions/v1/send-email`
   - **Secret:** Generate or copy the secret (e.g. `v1,whsec_...`) and add it as `SEND_EMAIL_HOOK_SECRET` in Edge Function secrets.
3. Save. New signups and password resets will be sent via Resend (noreply@datafordummies.in).

### 6.3 Confirm email is enabled

In **Authentication → Providers → Email**, ensure **Enable Email Signup** is ON. If **Confirm email** is ON, users get the confirmation + welcome email from Resend.

---

## 7. Renewal reminder (“Do not miss out on Pro bro!”)

Sent **one day before** a subscription expires. Deploy `send-renewal-reminders` and call it **once per day** (e.g. 9:00 AM) via cron or a scheduler.

- **Secrets:** `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. Optional: `ADMIN_PASSCODE` for authenticated POST.
- **Cron:** `GET https://gfskxboxvzuwozknfulo.supabase.co/functions/v1/send-renewal-reminders` (or POST with `{"passcode":"..."}` if you set `ADMIN_PASSCODE`).
- **Testing:** See `supabase/functions/EMAILS_TEST.md` and `scripts/test-renewal-reminder.sh`.

---

**Note:** Supabase Edge Functions are deployed via the **CLI**, not by uploading code in the dashboard. The dashboard shows the deployed version and lets you run tests and view logs.
