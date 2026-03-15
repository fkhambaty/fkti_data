# Auth Setup (Supabase + Resend)

## 1. Supabase

- Create a project at [supabase.com](https://supabase.com).
- In **Authentication > Providers**, enable **Email** and **Email OTP** (for 6-digit code).
- In **Authentication > URL Configuration**, set **Site URL** to `https://datafordummies.in` and add **Redirect URLs**: `https://datafordummies.in/auth/verify.html`, `https://datafordummies.in/auth/profile.html`, `https://datafordummies.in/**`. (Add `http://localhost:*/auth/*` only if you test auth locally.)
- In **SQL Editor**, run the schema from the main plan (create `profiles` table and RLS). Add an **INSERT** policy so users can create their own profile:
  ```sql
  CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
  ```
- In **Authentication > SMTP**, configure Resend (or another SMTP) so OTP emails are delivered. Without custom SMTP, Supabase free tier has a low email rate limit.
- In each auth page (`auth/login.html`, `auth/signup.html`, etc.), set:
  ```js
  window.SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
  window.SUPABASE_ANON_KEY = 'your-anon-key';
  ```

## 2. Resend (optional but recommended)

- Sign up at [resend.com](https://resend.com).
- Add and verify your domain (e.g. `datafordummies.in`).
- Create an API key.
- In Supabase **Authentication > SMTP**: Host `smtp.resend.com`, Port `465`, Username `resend`, Password = your Resend API key, Sender = `noreply@yourdomain.com`.

## 3. Trigger for new users (optional)

To auto-create a `profiles` row when a user signs up, you can add a Supabase Database Trigger that runs on `auth.users` insert and inserts into `public.profiles`. Alternatively, the verify page already upserts the profile after OTP verification.
