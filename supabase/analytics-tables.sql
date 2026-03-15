-- ============================================================
-- FKTI Analytics Tables for Supabase
-- Run this entire script in Supabase SQL Editor (one-time setup)
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- 1. Page Views — one row per page load across all devices
CREATE TABLE IF NOT EXISTS public.page_views (
    id           BIGSERIAL PRIMARY KEY,
    visitor_id   TEXT NOT NULL,
    session_id   TEXT,
    page_path    TEXT NOT NULL,
    page_title   TEXT,
    referrer     TEXT,
    ip_address   TEXT,
    country      TEXT,
    city         TEXT,
    device_type  TEXT,         -- desktop / mobile / tablet
    browser      TEXT,
    os           TEXT,
    screen_size  TEXT,
    user_id      UUID,         -- NULL for anonymous visitors
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Analytics Events — button clicks, funnel steps, course entries
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id           BIGSERIAL PRIMARY KEY,
    visitor_id   TEXT NOT NULL,
    session_id   TEXT,
    event_type   TEXT NOT NULL,
    event_data   JSONB DEFAULT '{}',
    page_path    TEXT,
    ip_address   TEXT,
    country      TEXT,
    user_id      UUID,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Visitors — deduplicated visitor profiles
CREATE TABLE IF NOT EXISTS public.site_visitors (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visitor_id      TEXT UNIQUE NOT NULL,
    first_seen      TIMESTAMPTZ DEFAULT NOW(),
    last_seen       TIMESTAMPTZ DEFAULT NOW(),
    ip_address      TEXT,
    country         TEXT,
    city            TEXT,
    device_type     TEXT,
    browser         TEXT,
    os              TEXT,
    total_visits    INTEGER DEFAULT 1,
    total_page_views INTEGER DEFAULT 1,
    is_registered   BOOLEAN DEFAULT FALSE,
    user_id         UUID
);

-- 4. Also add the missing column for Razorpay (from earlier plan)
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS razorpay_subscription_id TEXT;

-- ============================================================
-- Indexes for fast dashboard queries
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_page_views_created   ON public.page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page      ON public.page_views (page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor    ON public.page_views (visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_country    ON public.page_views (country);
CREATE INDEX IF NOT EXISTS idx_events_type           ON public.analytics_events (event_type);
CREATE INDEX IF NOT EXISTS idx_events_created        ON public.analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_last_seen    ON public.site_visitors (last_seen DESC);

-- ============================================================
-- Row Level Security
-- Anon users can INSERT (tracker writes data)
-- Only admin users can SELECT (dashboard reads data)
-- ============================================================
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visitors ENABLE ROW LEVEL SECURITY;

-- Anon insert policies
CREATE POLICY "anon_insert_page_views" ON public.page_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "anon_insert_events" ON public.analytics_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "anon_insert_visitors" ON public.site_visitors
    FOR INSERT WITH CHECK (true);

-- Anon update for visitors (to bump last_seen / totals)
CREATE POLICY "anon_update_visitors" ON public.site_visitors
    FOR UPDATE USING (true) WITH CHECK (true);

-- Admin select policies
CREATE POLICY "admin_select_page_views" ON public.page_views
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "admin_select_events" ON public.analytics_events
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "admin_select_visitors" ON public.site_visitors
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
