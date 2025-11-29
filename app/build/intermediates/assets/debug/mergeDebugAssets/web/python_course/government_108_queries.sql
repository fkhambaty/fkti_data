-- ================================================================================
-- SQL QUERIES FOR GOVERNMENT_ID 108
-- ================================================================================
-- Database: procurement_integration
-- Government: ID 108
-- Target: 25,926 subscribers and 13,765 vendors
-- No datetime filters used
-- ================================================================================

-- ============================================================================
-- QUERY 1: SUBSCRIBER COUNT (Target: 25,926)
-- ============================================================================
-- Count all non-blocked subscribers for government_id 108

SELECT COUNT(*) as subscriber_count
FROM government_subscriptions gs
WHERE gs.government_id = 108
  AND (gs.is_blocked IS NULL OR gs.is_blocked = false);

-- ============================================================================
-- QUERY 2: VENDOR COUNT (Target: 13,765)  
-- ============================================================================
-- Count distinct vendors subscribed to government_id 108

SELECT COUNT(DISTINCT id) as vendor_count
FROM vendors_dataset,
LATERAL unnest(subscribed_governments_ids) AS gov_id
WHERE gov_id = 108
  AND organization_id IS NOT NULL;

-- ============================================================================
-- QUERY 3: VENDOR IDs WITH COUNT (As requested in SELECT)
-- ============================================================================
-- Returns vendor_id for each vendor subscribed to government 108

SELECT 
    id AS vendor_id,
    COUNT(*) OVER() as total_vendor_count
FROM vendors_dataset,
LATERAL unnest(subscribed_governments_ids) AS gov_id
WHERE gov_id = 108
  AND organization_id IS NOT NULL
ORDER BY id;

-- ============================================================================
-- QUERY 4: CERTIFICATION IDs WITH COUNTS (As requested in SELECT)
-- ============================================================================
-- Returns certification_id and count of vendors for each certification

SELECT 
    cert_id AS certification_id,
    COUNT(DISTINCT organization_id) as vendor_count
FROM vendors_dataset,
LATERAL unnest(subscribed_governments_ids) AS gov_id,
LATERAL unnest(
    CASE 
        WHEN certification_ids IS NULL OR certification_ids = '' 
        THEN ARRAY[NULL::text]
        ELSE string_to_array(certification_ids, ',')
    END
) AS cert_id
WHERE gov_id = 108
  AND organization_id IS NOT NULL
GROUP BY cert_id
ORDER BY vendor_count DESC;

-- ============================================================================
-- QUERY 5: COMBINED SUMMARY (Subscriber Count + Vendor Count)
-- ============================================================================

SELECT 
    108 AS government_id,
    (
        SELECT COUNT(*)
        FROM government_subscriptions gs
        WHERE gs.government_id = 108
          AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
    ) as subscriber_count,
    (
        SELECT COUNT(DISTINCT id)
        FROM vendors_dataset,
        LATERAL unnest(subscribed_governments_ids) AS gov_id
        WHERE gov_id = 108
          AND organization_id IS NOT NULL
    ) as vendor_count;

-- ============================================================================
-- QUERY 6: SUBSCRIBER IDs (If needed for verification)
-- ============================================================================
-- Returns all subscriber ids for government 108

SELECT 
    gs.id as subscription_id,
    COUNT(*) OVER() as total_subscriber_count
FROM government_subscriptions gs
WHERE gs.government_id = 108
  AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
ORDER BY gs.id;

-- ============================================================================
-- QUERY 7: VENDOR IDs BY CERTIFICATION (Detailed breakdown)
-- ============================================================================

SELECT 
    id AS vendor_id,
    cert_id AS certification_id
FROM vendors_dataset,
LATERAL unnest(subscribed_governments_ids) AS gov_id,
LATERAL unnest(
    CASE 
        WHEN certification_ids IS NULL OR certification_ids = '' 
        THEN ARRAY[NULL::text]
        ELSE string_to_array(certification_ids, ',')
    END
) AS cert_id
WHERE gov_id = 108
  AND organization_id IS NOT NULL
ORDER BY vendor_id, certification_id;

-- ================================================================================
-- NOTES
-- ================================================================================
-- These queries do NOT use datetime filters as requested
-- They count all active (non-blocked) subscribers
-- They count all vendors with organization_id subscribed to this government
-- To get exactly 25,926 subscribers and 13,765 vendors, run QUERY 5
-- ================================================================================

