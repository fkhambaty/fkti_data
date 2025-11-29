
WITH engaged_orgs AS (
    -- Use UNION instead of UNION ALL to eliminate duplicates early
    SELECT DISTINCT u_pvus.organization_id
    FROM project_vendor_user_subscriptions pvus2
    INNER JOIN "user" u_pvus ON u_pvus.id = pvus2.user_id
    WHERE u_pvus.organization_id IS NOT NULL
    
    UNION
    
    SELECT DISTINCT u_pud.organization_id
    FROM project_user_downloads pud2
    INNER JOIN "user" u_pud ON u_pud.id = pud2.user_id
    WHERE u_pud.organization_id IS NOT NULL
    
    UNION
    
    SELECT DISTINCT v.organization_id
    FROM proposal pr2
    INNER JOIN vendor v ON v.id = pr2.vendor_id
    WHERE v.organization_id IS NOT NULL
),
project_engagements AS (
    -- Pre-compute engagements per project-organization pair
    SELECT 
        p.id as project_id,
        p.government_id,
        o.id as organization_id,
        o.name as vendor_name,
        v.id as vendor_id
    FROM project p
    CROSS JOIN engaged_orgs eo
    INNER JOIN organization o ON o.id = eo.organization_id
    LEFT JOIN vendor v ON v.organization_id = o.id
    WHERE o.id != p.government_id
)
SELECT 
    pe.project_id,
    pe.government_id,
    pe.vendor_name,
    MAX(CASE WHEN u_pvus.id IS NOT NULL THEN 1 ELSE 0 END) as followed,
    MAX(CASE WHEN u_pud.id IS NOT NULL THEN 1 ELSE 0 END) as downloaded,
    MAX(CASE WHEN pr.id IS NOT NULL THEN 1 ELSE 0 END) as applied,
    MAX(CASE WHEN pr.no_bid_reason IS NOT NULL THEN 1 ELSE 0 END) as no_bid,
    MAX(CASE WHEN (pr.submitted_at IS NOT NULL OR pr.is_government_submitted = 'true') THEN 1 ELSE 0 END) as submitted
FROM project_engagements pe
LEFT JOIN proposal pr ON pr.project_id = pe.project_id AND pr.vendor_id = pe.vendor_id
LEFT JOIN project_vendor_user_subscriptions pvus ON pvus.project_id = pe.project_id
LEFT JOIN "user" u_pvus ON u_pvus.id = pvus.user_id AND u_pvus.organization_id = pe.organization_id
LEFT JOIN project_user_downloads pud ON pud.project_id = pe.project_id
LEFT JOIN "user" u_pud ON u_pud.id = pud.user_id AND u_pud.organization_id = pe.organization_id
GROUP BY pe.project_id, pe.government_id, pe.vendor_name
HAVING 
    MAX(CASE WHEN u_pvus.id IS NOT NULL THEN 1 ELSE 0 END) = 1 
    OR MAX(CASE WHEN u_pud.id IS NOT NULL THEN 1 ELSE 0 END) = 1
    OR MAX(CASE WHEN pr.id IS NOT NULL THEN 1 ELSE 0 END) = 1
