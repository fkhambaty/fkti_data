# Payments Setup (Razorpay + Supabase Edge Functions)

## 1. Razorpay Dashboard

- Create a **Plan**: Name "Data For Dummies Pro", amount **₹499**, billing cycle **monthly**. Note the **plan_id** (e.g. `plan_xxxx`).
- Under **Webhooks**, add a webhook URL: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/razorpay-webhook`. Subscribe to events: `subscription.charged`, `subscription.activated` (and optionally `payment.captured`). Copy the **Webhook Secret**.

## 2. Supabase Edge Function secrets

Set these in Supabase Dashboard → Project Settings → Edge Functions → Secrets (or via CLI):

- **create-subscription**: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_PLAN_ID`
- **razorpay-webhook**: `RAZORPAY_WEBHOOK_SECRET`. Supabase automatically provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

## 3. Deploy Edge Functions

From the project root:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase functions deploy create-subscription
npx supabase functions deploy razorpay-webhook
```

## 4. Frontend config

On the pricing page (and any page that opens checkout), set:

```js
window.RAZORPAY_KEY_ID = 'your_razorpay_key_id';
window.SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co';
window.SUPABASE_ANON_KEY = 'your_anon_key';
```

Optional: if you do not use the create-subscription function, set `window.RAZORPAY_SUBSCRIPTION_LINK` to a Razorpay Subscription Link URL from the dashboard; the "Upgrade to Pro" button will redirect there instead.
