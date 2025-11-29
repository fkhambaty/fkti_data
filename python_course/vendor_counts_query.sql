-- Query 1: Vendor count by government_id AND certification_id
-- This gives you the complete breakdown by both dimensions

SELECT 
    gov_id AS government_id,
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
WHERE organization_id IS NOT NULL
GROUP BY gov_id, cert_id
ORDER BY gov_id, vendor_count DESC;

-- Query 1b: Simple vendor count by government_id only (without certification breakdown)

SELECT 
    gov_id AS government_id,
    COUNT(DISTINCT organization_id) as vendor_count
FROM vendors_dataset,
LATERAL unnest(subscribed_governments_ids) AS gov_id
WHERE organization_id IS NOT NULL
GROUP BY gov_id
ORDER BY vendor_count DESC;

-- Query 2: For a specific government (e.g., milpitas-ca with government_id = 669)

SELECT 
    gov_id AS government_id,
    COUNT(DISTINCT organization_id) as vendor_count
FROM vendors_dataset,
LATERAL unnest(subscribed_governments_ids) AS gov_id
WHERE gov_id = 669
  AND organization_id IS NOT NULL
GROUP BY gov_id;

-- Query 3: Vendor count by government_id AND certification_id
-- This shows breakdown by certification for each government

SELECT 
    gov_id AS government_id,
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
GROUP BY gov_id, cert_id
ORDER BY gov_id, vendor_count DESC;

-- Query 4: Alternative using CTE for better readability

WITH vendor_subscriptions AS (
    SELECT 
        organization_id,
        unnest(subscribed_governments_ids) AS government_id,
        certification_ids
    FROM vendors_dataset
    WHERE organization_id IS NOT NULL
)
SELECT 
    government_id,
    COUNT(DISTINCT organization_id) as vendor_count
FROM vendor_subscriptions
GROUP BY government_id
ORDER BY vendor_count DESC;

-- Query 5: Get government names with vendor counts (with certification breakdown)

SELECT 
    g.id AS government_id,
    g.code AS government_code,
    vd.certification_id,
    COUNT(DISTINCT vd.organization_id) as vendor_count
FROM government g
LEFT JOIN (
    SELECT 
        organization_id,
        unnest(subscribed_governments_ids) AS government_id,
        unnest(
            CASE 
                WHEN certification_ids IS NULL OR certification_ids = '' 
                THEN ARRAY[NULL::text]
                ELSE string_to_array(certification_ids, ',')
            END
        ) AS certification_id
    FROM vendors_dataset
    WHERE organization_id IS NOT NULL
) vd ON vd.government_id = g.id
WHERE g.deleted_at IS NULL
GROUP BY g.id, g.code, vd.certification_id
HAVING COUNT(DISTINCT vd.organization_id) > 0
ORDER BY g.code, vendor_count DESC;

-- Query 6: For milpitas-ca specifically showing sum to get 5008 total

SELECT 
    669 AS government_id,
    'milpitas-ca' AS government_code,
    SUM(vendor_count) as total_vendors
FROM (
    SELECT 
        gov_id,
        cert_id,
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
    WHERE organization_id IS NOT NULL
      AND gov_id = 669
    GROUP BY gov_id, cert_id
) subquery;

