# Create Your Admin Account (Full Access, No Payment)

This gives you **one** login (username = email + password) with **full access** to all courses and Pro content. You use the normal **Login** page — no separate admin page.

---

## Step 1: Create the admin user in Supabase

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) → your project (**fkhambaty's Project**).
2. Go to **Authentication** → **Users**.
3. Click **Add user** → **Create new user**.
4. Enter:
   - **Email:** your chosen admin email (e.g. `admin@datafordummies.in` or your personal email).
   - **Password:** a strong password you will use to log in on the site.
5. Click **Create user**.
6. In the users list, find the user you just created and **copy the User UID** (long string like `a1b2c3d4-e5f6-7890-abcd-ef1234567890`). You need it for Step 2.

---

## Step 2: Add the `profiles` table and `role` column (if needed)

1. In Supabase, go to **SQL Editor** → **New query**.
2. Run this script **once** (it is safe to run multiple times):

```sql
-- Create profiles table if it doesn't exist (id = auth user id)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  subscription_status TEXT DEFAULT 'free',
  subscription_end_date TIMESTAMPTZ,
  role TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add role column if it doesn't exist (safe if already there)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT NULL;
  END IF;
END $$;

-- Allow users to read/update their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

3. Click **Run**.

---

## Step 3: Mark your user as admin with full access

1. Still in **SQL Editor**, open a **new query**.
2. Run **one** of the following.

**Option A — By email (use this if your admin user is `fk_qrf@yahoo.com`)**  
No need to copy the User UID; the SQL finds the user by email:

```sql
-- Gives admin + full access to the user with this email
INSERT INTO public.profiles (id, subscription_status, subscription_end_date, role)
SELECT u.id, 'pro', '2099-12-31 23:59:59+00'::timestamptz, 'admin'
FROM auth.users u
WHERE u.email = 'fk_qrf@yahoo.com'
ON CONFLICT (id) DO UPDATE SET
  subscription_status = EXCLUDED.subscription_status,
  subscription_end_date = EXCLUDED.subscription_end_date,
  role = EXCLUDED.role,
  updated_at = now();
```

**Option B — By User UID (use if you use a different email)**  
Replace `YOUR_USER_UID_HERE` with the User UID from **Authentication → Users**:

```sql
INSERT INTO public.profiles (id, subscription_status, subscription_end_date, role)
VALUES (
  'YOUR_USER_UID_HERE'::UUID,
  'pro',
  '2099-12-31 23:59:59+00',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET
  subscription_status = 'pro',
  subscription_end_date = '2099-12-31 23:59:59+00',
  role = 'admin',
  updated_at = now();
```

3. Click **Run**.

---

## Step 4: Log in on your live site

1. Go to **https://datafordummies.in/auth/login.html** (or your local URL before going live).
2. Enter **fk_qrf@yahoo.com** and the **password** you set for that user in Supabase.
3. Click **Log in**.

You will have full access to all content (no paywall). The site treats `role = 'admin'` as full access.

---

## Summary

| Step | Where | What |
|------|--------|------|
| 1 | Supabase → Authentication → Users | Add user (e.g. fk_qrf@yahoo.com + password) |
| 2 | Supabase → SQL Editor | Run first SQL (create/update `profiles`, add `role`) |
| 3 | Supabase → SQL Editor | Run Option A SQL (by email) to set admin + pro |
| 4 | datafordummies.in/auth/login.html | Log in with fk_qrf@yahoo.com and your password |

You only need to do this once. Keep the admin email and password safe; do not share them.
