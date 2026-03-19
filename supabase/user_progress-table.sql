-- ============================================================
-- User Progress / Session — for "My learning" and continue-where-you-left-off
-- Run once in Supabase: Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_progress (
    user_id              UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id            TEXT NOT NULL,
    last_lesson_id       TEXT,
    last_lesson_label    TEXT,
    last_visited_at      TIMESTAMPTZ DEFAULT now(),
    completed_lesson_ids TEXT[] DEFAULT '{}',
    progress_pct         INT DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
    updated_at           TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_last_visited ON public.user_progress (last_visited_at DESC);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own progress
DROP POLICY IF EXISTS "Users can read own progress" ON public.user_progress;
CREATE POLICY "Users can read own progress"
    ON public.user_progress FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
CREATE POLICY "Users can insert own progress"
    ON public.user_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
CREATE POLICY "Users can update own progress"
    ON public.user_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- Upsert in progress.js uses INSERT or UPDATE; the three policies above allow both.
