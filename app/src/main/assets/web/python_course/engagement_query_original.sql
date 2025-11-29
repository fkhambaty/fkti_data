
WITH engaged_orgs AS (
    SELECT DISTINCT u_pvus.organization_id
    FROM project_vendor_user_subscriptions pvus2
    INNER JOIN "user" u_pvus ON u_pvus.id = pvus2.user_id
    
    UNION ALL
    
    SELECT DISTINCT u_pud.organization_id
    FROM project_user_downloads pud2
    INNER JOIN "user" u_pud ON u_pud.id = pud2.user_id
    
    UNION ALL
    
    SELECT DISTINCT v.organization_id
    FROM proposal pr2
    INNER JOIN vendor v ON v.id = pr2.vendor_id
)
SELECT 
    p.id as project_id,
    p.government_id,
    o.name as vendor_name,
    MAX(CASE WHEN u_pvus.id IS NOT NULL THEN 1 ELSE 0 END) as followed,
    MAX(CASE WHEN u_pud.id IS NOT NULL THEN 1 ELSE 0 END) as downloaded,
    MAX(CASE WHEN pr.id IS NOT NULL THEN 1 ELSE 0 END) as applied,
    MAX(CASE WHEN pr.no_bid_reason IS NOT NULL THEN 1 ELSE 0 END) as no_bid,
    MAX(CASE WHEN (pr.submitted_at IS NOT NULL OR pr.is_government_submitted = 'true') THEN 1 ELSE 0 END) as submitted
FROM project p
INNER JOIN engaged_orgs ON 1=1
INNER JOIN organization o ON o.id = engaged_orgs.organization_id
LEFT JOIN vendor v ON v.organization_id = o.id
LEFT JOIN proposal pr ON pr.project_id = p.id AND pr.vendor_id = v.id
LEFT JOIN project_vendor_user_subscriptions pvus ON pvus.project_id = p.id
LEFT JOIN "user" u_pvus ON u_pvus.id = pvus.user_id AND u_pvus.organization_id = o.id
LEFT JOIN project_user_downloads pud ON pud.project_id = p.id
LEFT JOIN "user" u_pud ON u_pud.id = pud.user_id AND u_pud.organization_id = o.id
WHERE o.id != p.government_id
GROUP BY p.id, p.government_id, o.name
HAVING 
    MAX(CASE WHEN u_pvus.id IS NOT NULL THEN 1 ELSE 0 END) = 1 
    OR MAX(CASE WHEN u_pud.id IS NOT NULL THEN 1 ELSE 0 END) = 1
    OR MAX(CASE WHEN pr.id IS NOT NULL THEN 1 ELSE 0 END) = 1
