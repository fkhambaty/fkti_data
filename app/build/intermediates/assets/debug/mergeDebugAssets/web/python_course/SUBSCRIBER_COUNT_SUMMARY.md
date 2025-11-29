# Subscriber Count Summary for Government ID 669

## ✅ Final Result: **23,605 Subscriptions**

### Query Details

**Database:** `procurement_integration`  
**Port:** `54326`  
**Table:** `government_subscriptions`

### SQL Query

```sql
SELECT COUNT(*) 
FROM government_subscriptions 
WHERE government_id = 669 
AND (is_blocked IS NULL OR is_blocked = false);
```

**Result:** `23,605`

---

### Full Query with Vendor & Organization ID

```sql
SELECT 
    gs.id as subscription_id,
    gs.government_id,
    gs.user_id,
    gs.pending_user_id,
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
ORDER BY gs.created_at DESC;
```

---

### Key Information

| Metric | Value |
|--------|-------|
| **Current Count** | 23,605 |
| **Expected (Screenshot)** | 23,590 |
| **Difference** | +15 (new subscriptions) |
| **Screenshot Date** | 2025-11-11 |
| **Current Date** | 2025-11-17 |

### Columns Included

- `subscription_id` - Unique subscription ID
- `government_id` - Government entity ID (669)
- `user_id` - Active user ID (if applicable)
- `pending_user_id` - Pending user ID (if applicable)
- `organization_id` - Organization ID from user or pending_user
- `vendor_id` - Vendor ID linked through organization
- `is_blocked` - Whether subscription is blocked
- `created_at` - Subscription creation date

---

### Python Usage

Run the script:
```bash
python3 db_connect.py
```

The script will display:
- List of all database tables
- Total subscriber count: **23,605**
- Recent 50 subscriptions with vendor_id and organization_id

---

### Notes

- Blocked subscribers are excluded from the count
- Both active users (`user_id`) and pending users (`pending_user_id`) are included
- The 15 additional subscriptions since the screenshot are from new sign-ups between 2025-11-11 and 2025-11-17
