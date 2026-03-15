# Razorpay secrets for create-subscription (Pro checkout)

The **create-subscription** Edge Function needs exactly these three secrets. Names are **case-sensitive**.

| Secret name               | Where to get the value |
|---------------------------|------------------------|
| `RAZORPAY_KEY_ID`         | Razorpay Dashboard → Settings → API Keys → Key ID (starts with `rzp_live_` or `rzp_test_`) |
| `RAZORPAY_KEY_SECRET`     | Same page → generate/reveal **Key Secret** (not the Key ID) |
| `RAZORPAY_PLAN_ID`        | Razorpay Dashboard → **Subscriptions** → **Plans** → create a plan (e.g. ₹499/month) → copy **Plan ID** (e.g. `plan_xxxxx`) |

## Steps to fix “Could not start subscription”

### 1. Confirm secret names in Supabase

- Supabase Dashboard → your project → **Project Settings** (gear) → **Edge Functions** (or **Secrets**).
- Ensure you have **exactly** these names (no extra spaces, correct case):
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
  - `RAZORPAY_PLAN_ID`

If you have different names (e.g. `Razorpay_Plan_Id`), either rename them or add new secrets with the exact names above and remove the old ones.

### 2. Set correct values

- **RAZORPAY_PLAN_ID** must be the **Plan ID** from Razorpay (Subscriptions → Plans), e.g. `plan_xxxxxxxxxxxx`, **not** the Key ID and **not** a custom label.
- **RAZORPAY_KEY_SECRET** must be the **Key Secret** from API Keys, not the Key ID.
- Avoid leading/trailing spaces when pasting; the function trims values.

### 3. Redeploy the function

After changing secrets, redeploy so the function sees the new values:

```bash
supabase functions deploy create-subscription
```

Or from Dashboard: **Edge Functions** → **create-subscription** → **Redeploy** (or trigger a new deployment).

### 4. See which secret is missing (optional)

If it still fails, the function now returns an error message that names the missing secret(s), e.g.:

- `"missing secret(s) [RAZORPAY_PLAN_ID]"`
- `"missing secret(s) [RAZORPAY_KEY_SECRET, RAZORPAY_PLAN_ID]"`

Check that message (in the profile error or in the browser Network tab for the `create-subscription` request) and fix the named secret(s) in Supabase, then redeploy again.

### 5. Other secrets are fine

Having other secrets (e.g. `SUPABASE_URL`, `RAZORPAY_WEBHOOK_SECRET`, `ADMIN_PASSCODE`) does **not** affect this function. Only the three above are read by **create-subscription**.
