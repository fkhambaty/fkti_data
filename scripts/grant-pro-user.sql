-- Grant Pro to user c6971780-462d-488f-b8d5-97c544df5528 (bandukwalafatema92@gmail.com)
-- Run in Supabase Dashboard → SQL Editor (paste and Run)

-- 1) Check current status (optional)
SELECT id, subscription_status, subscription_end_date, updated_at
FROM public.profiles
WHERE id = 'c6971780-462d-488f-b8d5-97c544df5528';

-- 2) Set Pro for 7 days (run this)
UPDATE public.profiles
SET
  subscription_status = 'pro',
  subscription_end_date = (NOW() + INTERVAL '7 days')::timestamptz,
  updated_at = NOW()
WHERE id = 'c6971780-462d-488f-b8d5-97c544df5528';

-- 3) Confirm (optional)
SELECT id, subscription_status, subscription_end_date
FROM public.profiles
WHERE id = 'c6971780-462d-488f-b8d5-97c544df5528';
