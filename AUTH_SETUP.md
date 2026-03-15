# Auth Setup (Supabase)

## 1. Supabase

- Create a project at [supabase.com](https://supabase.com).
- In **Authentication → Providers**, enable **Email** (email + password signup with confirmation link).
- In **Authentication → URL Configuration**:
  - **Site URL**: `https://datafordummies.in` (or your production URL).
  - **Redirect URLs** (add all that apply):
    - `https://datafordummies.in/auth/confirm.html` — email verification link (signup).
    - `https://datafordummies.in/auth/update-password.html` — password reset link.
    - `https://datafordummies.in/auth/profile.html`
    - For local testing: `http://localhost:8080/auth/confirm.html`, `http://localhost:8080/auth/update-password.html` (adjust port if needed).
- In **SQL Editor**, run the schema (create `profiles` table and RLS). Ensure an **INSERT** policy so users can create their own profile:
  ```sql
  CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
  ```
- In **Authentication → SMTP** (optional but recommended): configure Resend or another SMTP so confirmation and reset emails are delivered. Without custom SMTP, Supabase free tier has a low email rate limit.
- Auth pages use `js/supabase-config.js` for `SUPABASE_URL` and `SUPABASE_ANON_KEY`; ensure that file has your project values.

## 2. Current auth flow

- **Sign up**: User enters name, email, password → we send a **verification link** by email (no OTP). User clicks the link → lands on `confirm.html` → profile created/updated → redirect to `profile.html`.
- **Log in**: Email + password. If they signed up but never clicked the verification link, they see “Please confirm your email first.”
- **Forgot password**: User enters email on `reset-password.html` → we send a **reset link** → user clicks link → lands on `update-password.html` → sets new password → redirect to login with success message.

## 3. Resend (optional)

- Sign up at [resend.com](https://resend.com), verify your domain, create an API key.
- In Supabase **Authentication → SMTP**: Host `smtp.resend.com`, Port `465`, Username `resend`, Password = your Resend API key, Sender = `noreply@yourdomain.com`.

## 4. Trigger for new users (optional)

You can add a Database Trigger on `auth.users` insert that inserts into `public.profiles`. Otherwise, `confirm.html` upserts the profile when the user clicks the verification link.
