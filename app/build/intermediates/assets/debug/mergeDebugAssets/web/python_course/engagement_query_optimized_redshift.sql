-- ============================================================================
-- OPTIMIZED ENGAGEMENT QUERY FOR REDSHIFT
-- ============================================================================
-- Purpose: Track vendor engagement with projects (follows, downloads, proposals)
-- Optimizations:
--   1. UNION (not UNION ALL) in CTE to deduplicate organizations early
--   2. Filter NULL organization_ids before UNION to reduce data volume
--   3. Use COUNT(DISTINCT) instead of MAX(CASE WHEN) for cleaner aggregation
--   4. Cross join remains necessary to get all project-org combinations
--   5. HAVING clause filters only engaged organizations
-- ============================================================================

WITH engaged_orgs AS (
    -- Collect all unique organizations that have ANY engagement with projects
    -- Using UNION (not UNION ALL) automatically deduplicates across engagement types
    SELECT DISTINCT u.organization_id
    FROM project_vendor_user_subscriptions pvus
    INNER JOIN "user" u ON u.id = pvus.user_id
    WHERE u.organization_id IS NOT NULL
    
    UNION
    
    SELECT DISTINCT u.organization_id
    FROM project_user_downloads pud
    INNER JOIN "user" u ON u.id = pud.user_id
    WHERE u.organization_id IS NOT NULL
    
    UNION
    
    SELECT DISTINCT v.organization_id
    FROM proposal pr
    INNER JOIN vendor v ON v.id = pr.vendor_id
    WHERE v.organization_id IS NOT NULL
)
SELECT 
    p.id as project_id,
    p.government_id,
    o.name as vendor_name,
    CASE WHEN COUNT(DISTINCT pvus.id) > 0 THEN 1 ELSE 0 END as followed,
    CASE WHEN COUNT(DISTINCT pud.id) > 0 THEN 1 ELSE 0 END as downloaded,
    CASE WHEN COUNT(DISTINCT pr.id) > 0 THEN 1 ELSE 0 END as applied,
    CASE WHEN COUNT(DISTINCT CASE WHEN pr.no_bid_reason IS NOT NULL THEN pr.id END) > 0 THEN 1 ELSE 0 END as no_bid,
    CASE WHEN COUNT(DISTINCT CASE WHEN (pr.submitted_at IS NOT NULL OR pr.is_government_submitted = 'true') THEN pr.id END) > 0 THEN 1 ELSE 0 END as submitted
FROM project p
CROSS JOIN engaged_orgs eo
INNER JOIN organization o ON o.id = eo.organization_id
LEFT JOIN vendor v ON v.organization_id = o.id
LEFT JOIN proposal pr ON pr.project_id = p.id AND pr.vendor_id = v.id
LEFT JOIN project_vendor_user_subscriptions pvus ON pvus.project_id = p.id
LEFT JOIN "user" u_pvus ON u_pvus.id = pvus.user_id AND u_pvus.organization_id = o.id
LEFT JOIN project_user_downloads pud ON pud.project_id = p.id
LEFT JOIN "user" u_pud ON u_pud.id = pud.user_id AND u_pud.organization_id = o.id
WHERE o.id != p.government_id  -- Exclude the government entity that owns the project
GROUP BY p.id, p.government_id, o.name
HAVING 
    COUNT(DISTINCT pvus.id) > 0 
    OR COUNT(DISTINCT pud.id) > 0
    OR COUNT(DISTINCT pr.id) > 0;

