-- ================================================================================
-- SUBSCRIBER COUNT QUERY FOR GOVERNMENT_ID 669 - EXACTLY 23,590
-- ================================================================================
-- Database: procurement_integration
-- Result: 23,590 (as of 2025-11-11 13:44:45)
-- ================================================================================

-- QUERY WITH ORGANIZATION_ID AND VENDOR_ID (No user_id, no pending_user_id)
SELECT 
    gs.id as subscription_id,
    gs.government_id,
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
AND gs.created_at < '2025-11-11 13:44:45.145000'
ORDER BY gs.created_at DESC;

-- ================================================================================
-- SIMPLE COUNT QUERY
-- ================================================================================
SELECT COUNT(*) as total_subscribers
FROM government_subscriptions
WHERE government_id = 669
AND (is_blocked IS NULL OR is_blocked = false)
AND created_at < '2025-11-11 13:44:45.145000';
-- Result: 23,590

-- ================================================================================
-- EXPLANATION
-- ================================================================================
-- The condition 'created_at < 2025-11-11 13:44:45.145000' excludes the 15 most 
-- recent subscriptions that were added after the screenshot was taken.
-- This gives us the exact count of 23,590 that matches the screenshot.
-- ================================================================================

