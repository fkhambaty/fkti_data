ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_plan text DEFAULT 'free';
