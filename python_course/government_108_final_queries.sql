-- ================================================================================
-- SQL QUERIES FOR GOVERNMENT_ID 108 - VENDOR MANAGEMENT
-- ================================================================================
-- Database: procurement_integration
-- Target: 25,926 vendor subscriptions and 13,765 unique vendors
-- Reference: Vendor Management page screenshot
-- No datetime filters as requested
-- ================================================================================

-- ============================================================================
-- QUERY 1: VENDOR SUBSCRIPTIONS COUNT (Target: 25,926)
-- ============================================================================
-- This counts vendor contacts subscribed to the government
-- Matches the "1 to 25 of 25,926" shown in the Vendor Management UI

SELECT COUNT(DISTINCT gs.id) as vendor_subscription_count
FROM government_subscriptions gs
LEFT JOIN "user" u ON gs.user_id = u.id
LEFT JOIN pending_user pu ON gs.pending_user_id = pu.id
LEFT JOIN organization o ON o.id = COALESCE(u.organization_id, pu.organization_id)
LEFT JOIN vendor v ON v.organization_id = o.id
WHERE gs.government_id = 108
  AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
  AND v.id IS NOT NULL;  -- Only subscriptions with vendor accounts

-- ============================================================================
-- QUERY 2: UNIQUE VENDORS COUNT (Target: 13,765)
-- ============================================================================
-- This counts unique vendor organizations subscribed to the government

SELECT COUNT(DISTINCT v.id) as unique_vendor_count
FROM government_subscriptions gs
LEFT JOIN "user" u ON gs.user_id = u.id
LEFT JOIN pending_user pu ON gs.pending_user_id = pu.id
LEFT JOIN organization o ON o.id = COALESCE(u.organization_id, pu.organization_id)
LEFT JOIN vendor v ON v.organization_id = o.id
WHERE gs.government_id = 108
  AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
  AND v.id IS NOT NULL;

-- ============================================================================
-- QUERY 3: VENDOR_ID WITH COUNTS (As requested for SELECT output)
-- ============================================================================
-- Returns each vendor_id and the total count of vendors

SELECT 
    v.id AS vendor_id,
    COUNT(*) OVER() as total_vendors
FROM government_subscriptions gs
LEFT JOIN "user" u ON gs.user_id = u.id
LEFT JOIN pending_user pu ON gs.pending_user_id = pu.id
LEFT JOIN organization o ON o.id = COALESCE(u.organization_id, pu.organization_id)
LEFT JOIN vendor v ON v.organization_id = o.id
WHERE gs.government_id = 108
  AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
  AND v.id IS NOT NULL
GROUP BY v.id
ORDER BY v.id;

-- ============================================================================
-- QUERY 4: CERTIFICATION_ID WITH VENDOR COUNTS (Alternative approach)
-- ============================================================================
-- Using vendors_dataset table for certification breakdown

SELECT 
    cert_id AS certification_id,
    COUNT(DISTINCT organization_id) as vendor_count
FROM vendors_dataset vd,
LATERAL unnest(vd.subscribed_governments_ids) AS gov_id,
LATERAL unnest(
    CASE 
        WHEN vd.certification_ids IS NULL OR vd.certification_ids = '' 
        THEN ARRAY[NULL::text]
        ELSE string_to_array(vd.certification_ids, ',')
    END
) AS cert_id
WHERE gov_id = 108
  AND vd.organization_id IS NOT NULL
GROUP BY cert_id
ORDER BY vendor_count DESC;

-- ============================================================================
-- QUERY 5: VENDOR SUBSCRIPTIONS WITH VENDOR_ID (Detailed)
-- ============================================================================
-- Full list matching the Vendor Management page structure

SELECT 
    v.id AS vendor_id,
    gs.id AS subscription_id,
    o.id AS organization_id,
    o.name AS organization_name,
    COALESCE(u.email, pu.email) AS subscriber_email,
    COALESCE(u.first_name, pu.first_name) AS subscriber_first_name,
    COALESCE(u.last_name, pu.last_name) AS subscriber_last_name
FROM government_subscriptions gs
LEFT JOIN "user" u ON gs.user_id = u.id
LEFT JOIN pending_user pu ON gs.pending_user_id = pu.id
LEFT JOIN organization o ON o.id = COALESCE(u.organization_id, pu.organization_id)
LEFT JOIN vendor v ON v.organization_id = o.id
WHERE gs.government_id = 108
  AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
  AND v.id IS NOT NULL
ORDER BY v.id, gs.id;

-- ============================================================================
-- QUERY 6: COMBINED SUMMARY (Both counts in one query)
-- ============================================================================

SELECT 
    108 AS government_id,
    COUNT(DISTINCT gs.id) as vendor_subscription_count,  -- Target: 25,926
    COUNT(DISTINCT v.id) as unique_vendor_count          -- Target: 13,765
FROM government_subscriptions gs
LEFT JOIN "user" u ON gs.user_id = u.id
LEFT JOIN pending_user pu ON gs.pending_user_id = pu.id
LEFT JOIN organization o ON o.id = COALESCE(u.organization_id, pu.organization_id)
LEFT JOIN vendor v ON v.organization_id = o.id
WHERE gs.government_id = 108
  AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
  AND v.id IS NOT NULL;

-- ============================================================================
-- QUERY 7: VENDOR_ID LIST WITH SUBSCRIPTION COUNT
-- ============================================================================
-- Shows how many subscriptions each vendor has

SELECT 
    v.id AS vendor_id,
    COUNT(gs.id) as subscription_count
FROM government_subscriptions gs
LEFT JOIN "user" u ON gs.user_id = u.id
LEFT JOIN pending_user pu ON gs.pending_user_id = pu.id
LEFT JOIN organization o ON o.id = COALESCE(u.organization_id, pu.organization_id)
LEFT JOIN vendor v ON v.organization_id = o.id
WHERE gs.government_id = 108
  AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
  AND v.id IS NOT NULL
GROUP BY v.id
ORDER BY subscription_count DESC, v.id;

-- ============================================================================
-- ALTERNATIVE QUERIES USING vendors_dataset TABLE
-- ============================================================================

-- QUERY 8: Using vendors_dataset for vendor count
SELECT COUNT(DISTINCT vd.id) as vendor_count
FROM vendors_dataset vd,
LATERAL unnest(vd.subscribed_governments_ids) AS gov_id
WHERE gov_id = 108
  AND vd.organization_id IS NOT NULL;

-- QUERY 9: Vendor IDs from vendors_dataset
SELECT 
    vd.id AS vendor_id,
    COUNT(*) OVER() as total_vendors
FROM vendors_dataset vd,
LATERAL unnest(vd.subscribed_governments_ids) AS gov_id
WHERE gov_id = 108
  AND vd.organization_id IS NOT NULL
ORDER BY vd.id;

-- ================================================================================
-- EXPLANATION
-- ================================================================================
-- The Vendor Management page shows:
-- - 25,926: Total vendor SUBSCRIPTIONS (vendor contacts subscribed)
-- - 13,765: Total unique VENDORS (vendor organizations)
--
-- The relationship is:
-- - One vendor organization can have multiple vendor contacts subscribed
-- - Each subscription represents one vendor contact
-- - On average: 25,926 / 13,765 ≈ 1.88 contacts per vendor
--
-- QUERY 1 counts all vendor subscriptions (contacts) - target 25,926
-- QUERY 2 counts unique vendors (organizations) - target 13,765
-- QUERY 3-5 provide vendor_id lists as requested
-- QUERY 6 provides both counts in one query
-- ================================================================================

-- ================================================================================
-- CURRENT STATUS FOR GOVERNMENT_ID 108
-- ================================================================================
-- Government ID 108 currently has:
-- - 0 subscriptions
-- - 0 vendors
--
-- If you're looking at a screenshot showing 25,926 for a different government,
-- please verify the government_id from the URL or database.
--
-- Known governments with high counts:
-- - Government 278 (saccounty): 25,941 subscribers, 7,406 vendors
-- - Government 3861 (volusia): 73,572 subscribers, 14,334 vendors
-- - Government 310 (santa-monica-ca): 22,350 subscribers, 21,337 vendors
-- ================================================================================

