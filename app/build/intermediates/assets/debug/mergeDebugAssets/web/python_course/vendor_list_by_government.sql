-- Query 1: List all vendors with government_id and vendor_id for ALL governments

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
WHERE organization_id IS NOT NULL
ORDER BY gov_id, organization_name;


-- Query 2: Count vendors by government_id (to verify the 5008 count)

SELECT 
    gov_id AS government_id,
    COUNT(DISTINCT id) as vendor_count
FROM vendors_dataset,
LATERAL unnest(subscribed_governments_ids) AS gov_id
WHERE organization_id IS NOT NULL
GROUP BY gov_id
ORDER BY vendor_count DESC;


-- Query 3: For specific government (e.g., milpitas-ca with government_id = 669)

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
    organization_zip_code,
    unique_entity_id,
    ein,
    duns
FROM vendors_dataset,
LATERAL unnest(subscribed_governments_ids) AS gov_id
WHERE organization_id IS NOT NULL
  AND gov_id = 669
ORDER BY organization_name;


-- Query 4: With government code/name for better readability

SELECT 
    g.id AS government_id,
    g.code AS government_code,
    vd.id AS vendor_id,
    vd.organization_id,
    vd.organization_name,
    vd.doing_business_as,
    vd.organization_phone,
    vd.organization_address1,
    vd.organization_city,
    vd.organization_state,
    vd.organization_zip_code
FROM government g
JOIN (
    SELECT 
        id,
        organization_id,
        organization_name,
        doing_business_as,
        organization_phone,
        organization_address1,
        organization_city,
        organization_state,
        organization_zip_code,
        unnest(subscribed_governments_ids) AS government_id
    FROM vendors_dataset
    WHERE organization_id IS NOT NULL
) vd ON vd.government_id = g.id
WHERE g.deleted_at IS NULL
ORDER BY g.code, vd.organization_name;


-- Query 5: Export-friendly format with all vendor details

SELECT 
    gov_id AS government_id,
    id AS vendor_id,
    organization_id,
    organization_name,
    doing_business_as,
    unique_entity_id,
    ein,
    duns,
    organization_website,
    organization_phone,
    organization_address1,
    organization_address2,
    organization_city,
    organization_state,
    organization_zip_code,
    organization_country_code,
    business_type,
    state_of_incorporation,
    nigp_categories,
    naics_categories,
    unspsc_categories,
    created_at,
    updated_at
FROM vendors_dataset,
LATERAL unnest(subscribed_governments_ids) AS gov_id
WHERE organization_id IS NOT NULL
ORDER BY gov_id, organization_name;

