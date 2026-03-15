# Login & Sign Up — What You Need To Do (Step-by-Step)

If the **Login** and **Sign up** pages show nothing (blank or broken), follow these steps **in order**. Everything below is what **you** must do on your side.

---

## 1. Serve the site over HTTP (do not open HTML as file)

If you open `auth/login.html` or `auth/signup.html` directly from the file system (`file:///...`), the page can look broken or blank because the browser blocks some requests and relative paths (like `../styles/design-system.css`) may not resolve correctly.

**Production (hosted at [https://datafordummies.in](https://datafordummies.in/)):**  
Open the auth pages at `https://datafordummies.in/auth/login.html` and `https://datafordummies.in/auth/signup.html`. Redirects after login, signup, and password reset will use this domain automatically.

**Local testing:**  
From the project root, run e.g. `python3 -m http.server 8000` or `npx serve -l 8000`, then open `http://localhost:8000/auth/login.html`. If you use localhost, add the localhost redirect URLs in Supabase (see Step 3) as well.

---

## 2. Create a Supabase project and get URL + anon key

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create an account).
2. Click **New project**.
3. Choose an organization, set a **Project name** and **Database password** (save the password). Pick a region and click **Create new project**.
4. When the project is ready, go to **Project Settings** (gear icon in the left sidebar) → **API**.
5. Copy:
   - **Project URL** (e.g. `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public** key (under "Project API keys" — the long string labeled **anon** **public**).

You will paste these into the auth pages in Step 4.

---

## 3. Turn on Email auth and set URLs in Supabase

1. In the Supabase dashboard, go to **Authentication** → **Providers**.
2. Find **Email** and enable it (turn it **ON**).
3. If you use the 6-digit code signup flow, enable **Email OTP** as well (or the option your signup flow uses).
4. Go to **Authentication** → **URL Configuration**.
5. Set **Site URL** to your production domain:
   - **Production:** `https://datafordummies.in`
6. Under **Redirect URLs**, add these URLs (one per line) so login, signup, and password-reset redirects work on your domain:
   - `https://datafordummies.in/auth/verify.html`
   - `https://datafordummies.in/auth/profile.html`
   - `https://datafordummies.in/**`
   - Optional for local testing only: `http://localhost:8000/auth/verify.html`, `http://localhost:8000/auth/profile.html`, `http://localhost:8000/**`

Save the changes.

---

## 4. Paste Supabase URL and anon key into the auth pages

The site expects two variables to be set in the HTML: `window.SUPABASE_URL` and `window.SUPABASE_ANON_KEY`. Right now they are empty, so login/signup do nothing.

**Files to edit** (in your `Website` project):

| File | What to change |
|------|-----------------|
| `auth/login.html` | Find the two lines `window.SUPABASE_URL = '';` and `window.SUPABASE_ANON_KEY = '';` and replace the empty strings with your Project URL and anon key. |
| `auth/signup.html` | Same: set `window.SUPABASE_URL` and `window.SUPABASE_ANON_KEY` to your Project URL and anon key. |
| `auth/verify.html` | Same. |
| `auth/reset-password.html` | Same. |
| `auth/profile.html` | Same. |

**Example** (use your own values):

```js
window.SUPABASE_URL = 'https://xxxxxxxxxxxx.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

- Do **not** commit the anon key to a public repo if the repo is visible to others. For production, consider environment-based config or a backend that injects keys.
- Other pages (e.g. `index.html`, `learning-path.html`, `pricing.html`, `projects.html`, etc.) also have `window.SUPABASE_URL` and `window.SUPABASE_ANON_KEY` for the auth widget; update those too if you want “Log in” / “Sign up” to work from every page.

---

## 5. Optional: Database and profiles

- If the app uses a `profiles` table, run the SQL from your main plan in the Supabase **SQL Editor** (e.g. create `profiles` and RLS policies). Ensure there is a policy so users can insert/update their own profile (e.g. `auth.uid() = id`).
- If signup uses email OTP, configure **Authentication → SMTP** in Supabase (or use Resend as in `AUTH_SETUP.md`) so verification emails are sent; otherwise codes may not arrive.

---

## 6. Check that CSS/JS exist

The auth pages load:

- `../styles/design-system.css`
- `../styles/auth.css`
- `../js/supabase-auth.js`

These paths are relative to the `auth/` folder, so they must exist as:

- `styles/design-system.css`
- `styles/auth.css`
- `js/supabase-auth.js`

If any of these files are missing, the page can look empty or broken. Add or restore them if needed.

---

## Summary checklist

- [ ] Site opened via `https://datafordummies.in/...` (production) or a local server, not `file://`
- [ ] Supabase project created; Project URL and anon key copied
- [ ] Email (and Email OTP if used) enabled under Authentication → Providers
- [ ] **Site URL** = `https://datafordummies.in` and **Redirect URLs** include `https://datafordummies.in/auth/*` and `https://datafordummies.in/**`
- [ ] `window.SUPABASE_URL` and `window.SUPABASE_ANON_KEY` set in `auth/login.html`, `auth/signup.html`, `auth/verify.html`, `auth/reset-password.html`, `auth/profile.html`
- [ ] Optional: `profiles` table and RLS set up; SMTP configured for OTP emails
- [ ] `styles/design-system.css`, `styles/auth.css`, and `js/supabase-auth.js` present

After this, login and sign up at **https://datafordummies.in/auth/login.html** and **https://datafordummies.in/auth/signup.html** will work with Supabase. If something still shows nothing, check the browser console (F12 → Console) and confirm redirect URLs in Supabase include `https://datafordummies.in`.
