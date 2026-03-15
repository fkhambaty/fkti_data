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

**Note:** Supabase Edge Functions are deployed via the **CLI**, not by uploading code in the dashboard. The dashboard shows the deployed version and lets you run tests and view logs.
