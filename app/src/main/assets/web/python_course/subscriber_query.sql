-- ================================================================================
-- SUBSCRIBER COUNT QUERY FOR GOVERNMENT_ID 669
-- ================================================================================
-- Database: procurement_integration
-- Expected Result: 23,590 (as of 2025-11-11)
-- Current Result: 23,605 (as of 2025-11-17)
-- ================================================================================

-- MAIN QUERY: Get subscribers with vendor_id and organization_id
SELECT 
    gs.id as subscription_id,
    gs.government_id,
    gs.user_id,
    gs.pending_user_id,
    COALESCE(u.organization_id, pu.organization_id) as organization_id,
    v.id as vendor_id,
    gs.is_blocked,
    gs.created_at
FROM government_subscriptions gs
LEFT JOIN "user" u ON gs.user_id = u.id
LEFT JOIN pending_user pu ON gs.pending_user_id = pu.id
LEFT JOIN organization o ON COALESCE(u.organization_id, pu.organization_id) = o.id
LEFT JOIN vendor v ON o.id = v.organization_id
WHERE gs.government_id = 669
AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
ORDER BY gs.created_at DESC;

-- ================================================================================
-- TOTAL COUNT
-- ================================================================================

-- Total active subscribers (excluding blocked)
SELECT COUNT(*) as total_subscribers
FROM government_subscriptions gs
WHERE gs.government_id = 669
AND (gs.is_blocked IS NULL OR gs.is_blocked = false);
-- Result: 23,605

-- ================================================================================
-- KEY INSIGHTS
-- ================================================================================
-- 1. Total active subscribers: 23,605
-- 2. The data includes both active users and pending users
-- 3. Blocked subscribers are excluded from the count
-- 4. Organization_id and vendor_id are included for reference
-- 
-- RELATIONSHIP CHAIN:
-- government_subscriptions → user/pending_user → organization → vendor
-- ================================================================================

