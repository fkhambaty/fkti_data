-- FINAL QUERY: Returns vendor_id and government_id for all governments
-- Current count for milpitas-ca (government_id = 669): 4996 vendors

SELECT 
    gov_id AS government_id,
    id AS vendor_id,
    organization_id,
    organization_name,
    doing_business_as,
    organization_website,
    organization_phone,
    organization_address1,
    organization_city,
    organization_state,
    organization_zip_code
FROM vendors_dataset,
LATERAL unnest(subscribed_governments_ids) AS gov_id
ORDER BY gov_id, organization_name;


-- To get the count for milpitas-ca:
-- SELECT COUNT(DISTINCT id) FROM vendors_dataset, LATERAL unnest(subscribed_governments_ids) AS gov_id WHERE gov_id = 669;
-- Result: 4996

-- Note: The database currently shows 4996 vendors subscribed to milpitas-ca (government_id = 669).
-- If the UI shows 5008, it may be due to:
-- 1. The screenshot being from a different time
-- 2. The UI using a different filtering logic
-- 3. Materialized views needing to be refreshed

-- To verify and potentially get 5008, try refreshing the materialized views:
-- REFRESH MATERIALIZED VIEW org_subscribers_mv;
-- REFRESH MATERIALIZED VIEW vendors_dataset;
-- REFRESH MATERIALIZED VIEW vendor_user_subscriptions_mv;

