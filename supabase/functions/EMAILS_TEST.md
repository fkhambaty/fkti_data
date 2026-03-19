# Testing the 3 user emails

Three emails are sent to users:

| # | When | Email | Function / trigger |
|---|------|--------|--------------------|
| 1 | **On signup** | Welcome email (confirm your email) | `send-email` — Supabase Auth “Send Email” hook |
| 2 | **On subscription** | Welcome to Pro bro! | `razorpay-callback` — after successful Razorpay payment |
| 3 | **One day before subscription ends** | Do not miss out on Pro bro! | `send-renewal-reminders` — run daily via cron |

---

## 1. Test: Welcome email (signup)

- **Trigger:** Create a new account at `https://datafordummies.in/auth/signup.html` (or your deployed auth signup page).
- **Prerequisites:**
  - Send Email hook configured in **Authentication → Hooks** pointing to `send-email`.
  - Secrets: `RESEND_API_KEY`, `SEND_EMAIL_HOOK_SECRET`.
  - “Confirm email” enabled in **Authentication → Providers → Email** (so Supabase sends the signup email and the hook runs).
- **Expected:** Inbox receives “Welcome to Data For Dummies! — confirm your email” with a working “Confirm my email” link.

---

## 2. Test: Welcome to Pro bro! (on subscription)

- **Trigger:** Complete a real or test Pro subscription (Razorpay payment success → redirect to callback).
- **Prerequisites:**
  - `razorpay-callback` deployed.
  - Secrets: `RESEND_API_KEY`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_KEY_ID`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- **Expected:** Inbox receives “Welcome to Pro bro! 🎉” with plan details and “Start Learning Now” link.

---

## 3. Test: Do not miss out on Pro bro! (1 day before expiry)

- **Trigger:** The function sends to users whose `subscription_end_date` is **tomorrow** (next calendar day). So either wait for cron or call the function manually.
- **Prerequisites:**
  - `send-renewal-reminders` deployed.
  - Secrets: `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
  - At least one profile with `subscription_status = 'pro'` and `subscription_end_date` = tomorrow (e.g. set in DB for testing).

**Option A — Manual trigger (curl)**

```bash
# Replace PROJECT_REF and optional passcode
FUNCTION_URL="https://PROJECT_REF.supabase.co/functions/v1/send-renewal-reminders"

# If you set ADMIN_PASSCODE:
curl -X POST "$FUNCTION_URL" -H "Content-Type: application/json" -d '{"passcode":"YOUR_ADMIN_PASSCODE"}'

# Or GET (no auth if ADMIN_PASSCODE not set):
curl "$FUNCTION_URL"
```

**Option B — Temporary test user**

1. In Supabase **Table Editor → profiles**, pick a Pro user (or create one).
2. Set `subscription_end_date` to **tomorrow** (e.g. if today is 2025-03-19, set to 2025-03-20 12:00:00).
3. Call the function (curl above). Check that user’s email for “Do not miss out on Pro bro! — your subscription renews tomorrow”.

**Cron (production)**

- Call `send-renewal-reminders` once per day (e.g. 9:00 AM). Use Supabase pg_cron, GitHub Actions, or any scheduler GET/POST to the function URL.

---

## Quick checklist

- [ ] **send-email** deployed with `--no-verify-jwt`, Send Email hook configured, secrets set.
- [ ] **razorpay-callback** deployed; after a test payment, “Welcome to Pro bro!” received.
- [ ] **send-renewal-reminders** deployed; one profile with `subscription_end_date` = tomorrow; after calling the function, “Do not miss out on Pro bro!” received.
- [ ] Cron (or scheduler) set to call `send-renewal-reminders` daily.
