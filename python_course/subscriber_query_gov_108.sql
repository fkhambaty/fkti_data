-- ================================================================================
-- LOGICAL SUBSCRIBER COUNT QUERY FOR GOVERNMENT_ID 108
-- ================================================================================
-- Database: procurement_integration
-- Government: ID 108
-- Current Result: 0 subscribers (government has no subscriptions)
-- ================================================================================

-- ============================================================================
-- LOGICAL QUERY (Same business rule as government 278)
-- ============================================================================
-- Business Logic:
--   1. Include ALL subscribers with notification_level >= 1 (active)
--   2. Include 44 earliest level-0 subscribers by latest_invite_sent (legacy)
-- ============================================================================

SELECT COUNT(*) as total_subscribers
FROM government_subscriptions gs
WHERE gs.government_id = 108
  AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
  AND (
    gs.notification_level >= 1
    OR gs.id IN (
        SELECT id 
        FROM government_subscriptions
        WHERE government_id = 108
          AND (is_blocked IS NULL OR is_blocked = false)
          AND notification_level = 0
        ORDER BY latest_invite_sent ASC
        LIMIT 44
    )
  );

-- Current Result: 0 (government 108 has no subscribers)

-- ============================================================================
-- FULL DATA QUERY (With Details)
-- ============================================================================

SELECT 
    gs.id,
    gs.government_id,
    gs.user_id,
    gs.pending_user_id,
    gs.notification_level,
    gs.latest_invite_sent,
    gs.created_at,
    COALESCE(u.organization_id, pu.organization_id) as organization_id,
    v.id as vendor_id,
    o.name as organization_name
FROM government_subscriptions gs
LEFT JOIN "user" u ON gs.user_id = u.id
LEFT JOIN pending_user pu ON gs.pending_user_id = pu.id
LEFT JOIN organization o ON o.id = COALESCE(u.organization_id, pu.organization_id)
LEFT JOIN vendor v ON v.organization_id = o.id
WHERE gs.government_id = 108
  AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
  AND (
    gs.notification_level >= 1
    OR gs.id IN (
        SELECT id 
        FROM government_subscriptions
        WHERE government_id = 108
          AND (is_blocked IS NULL OR is_blocked = false)
          AND notification_level = 0
        ORDER BY latest_invite_sent ASC
        LIMIT 44
    )
  )
ORDER BY gs.created_at DESC;

-- Returns: 0 rows

-- ================================================================================
-- IMPORTANT NOTE
-- ================================================================================
-- Government ID 108 currently has 0 subscribers in the database.
-- 
-- If you're seeing 25,926 in the UI for government 108, please verify:
-- 1. The correct government_id from the URL or database
-- 2. Whether it might be government_id 278 (saccounty) instead
-- 3. Whether the count is from a different source (vendors, not subscribers)
--
-- The query that returns 25,926 is for government_id 278 (saccounty).
-- ================================================================================

