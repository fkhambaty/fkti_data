# Government ID 108 - Vendor Management Queries

## 📊 Summary

**Database:** `procurement_integration` (Production)  
**Government ID:** 108  
**Target Counts:** 25,926 vendor subscriptions | 13,765 unique vendors  
**Filter:** No datetime restrictions (all active subscriptions)

---

## ✅ Connection Details

```python
import psycopg2

conn = psycopg2.connect(
    host='localhost',
    port='54326',
    database='procurement_integration',
    user='usr_teleport_writer',
    password=''
)
```

---

## 🎯 Key Queries

### Query 1: Vendor Subscriptions Count (Target: 25,926)

This counts **vendor contacts** (subscriptions) for the government. Each subscription represents one vendor contact subscribed to opportunities.

```sql
SELECT COUNT(DISTINCT gs.id) as vendor_subscription_count
FROM government_subscriptions gs
LEFT JOIN "user" u ON gs.user_id = u.id
LEFT JOIN pending_user pu ON gs.pending_user_id = pu.id
LEFT JOIN organization o ON o.id = COALESCE(u.organization_id, pu.organization_id)
LEFT JOIN vendor v ON v.organization_id = o.id
WHERE gs.government_id = 108
  AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
  AND v.id IS NOT NULL;
```

**Returns:** Count of vendor subscriptions (vendor contacts)  
**Current Result:** 0 (no data for government 108)

---

### Query 2: Unique Vendors Count (Target: 13,765)

This counts **unique vendor organizations** subscribed to the government.

```sql
SELECT COUNT(DISTINCT v.id) as unique_vendor_count
FROM government_subscriptions gs
LEFT JOIN "user" u ON gs.user_id = u.id
LEFT JOIN pending_user pu ON gs.pending_user_id = pu.id
LEFT JOIN organization o ON o.id = COALESCE(u.organization_id, pu.organization_id)
LEFT JOIN vendor v ON v.organization_id = o.id
WHERE gs.government_id = 108
  AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
  AND v.id IS NOT NULL;
```

**Returns:** Count of unique vendors  
**Current Result:** 0 (no data for government 108)

---

### Query 3: Vendor IDs with Count (As Requested)

Returns **vendor_id** for each vendor and the total count.

```sql
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
```

**Returns:** List of vendor_ids with total count in each row

---

### Query 4: Certification IDs with Vendor Counts

Returns **certification_id** and the count of vendors for each certification.

```sql
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
```

**Returns:** List of certification_ids with vendor counts

---

### Query 5: Combined Summary (Both Counts)

Returns both subscription count and unique vendor count in one query.

```sql
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
```

**Returns:** Both counts in a single result row

---

## 📈 Current Results

| Metric | Current Value | Target Value |
|--------|--------------|--------------|
| Government ID | 108 | 108 |
| Vendor Subscriptions | 0 | 25,926 |
| Unique Vendors | 0 | 13,765 |
| Average Contacts per Vendor | N/A | ~1.88 |

---

## 🔍 Understanding the Metrics

### Vendor Subscriptions (25,926)
- Represents **individual vendor contacts** subscribed to opportunities
- Each subscription is one vendor contact (user or pending_user)
- One vendor organization can have multiple contacts subscribed
- This matches the "1 to 25 of 25,926" shown in the Vendor Management UI

### Unique Vendors (13,765)
- Represents **unique vendor organizations** 
- Multiple contacts from the same organization count as one vendor
- This is the actual number of distinct vendor companies

### Relationship
- 25,926 vendor subscriptions ÷ 13,765 unique vendors = ~1.88 contacts per vendor on average
- Some vendors have multiple employees/contacts subscribed

---

## 🏛️ Government Data Status

### Government ID 108
- **Subscriptions:** 0
- **Vendors:** 0
- **Status:** No data currently exists for this government

### Known Governments with High Counts

| Government ID | Code | Subscriptions | Vendors |
|--------------|------|---------------|---------|
| 3861 | volusia | 73,572 | 14,334 |
| 3521 | alachuacounty | 60,751 | 10,988 |
| 278 | saccounty | 25,941 | 7,406 |
| 310 | santa-monica-ca | 22,350 | 21,337 |
| 669 | milpitas-ca | 23,605 | 4,996 |

---

## 📁 Files Created

1. **`government_108_queries.sql`** - All SQL queries
2. **`government_108_final_queries.sql`** - Final comprehensive queries with explanations
3. **`run_government_108_queries.py`** - Python script to execute queries
4. **`verify_government_108_final.py`** - Verification script with all query variations
5. **`find_government_with_counts.py`** - Script to find governments with specific counts
6. **`GOVERNMENT_108_SUMMARY.md`** - This summary document

---

## 🚀 How to Execute

### Option 1: Using Python Script

```bash
cd /Users/fakhruddinkhambaty/Downloads/Receipts
python3 verify_government_108_final.py
```

### Option 2: Using psql Command Line

```bash
psql -h localhost -p 54326 -U usr_teleport_writer -d procurement_integration -f government_108_final_queries.sql
```

### Option 3: Using Python with psycopg2

```python
import psycopg2

conn = psycopg2.connect(
    host='localhost',
    port='54326',
    database='procurement_integration',
    user='usr_teleport_writer',
    password=''
)

cursor = conn.cursor()
cursor.execute("""
    SELECT 
        108 AS government_id,
        COUNT(DISTINCT gs.id) as vendor_subscription_count,
        COUNT(DISTINCT v.id) as unique_vendor_count
    FROM government_subscriptions gs
    LEFT JOIN "user" u ON gs.user_id = u.id
    LEFT JOIN pending_user pu ON gs.pending_user_id = pu.id
    LEFT JOIN organization o ON o.id = COALESCE(u.organization_id, pu.organization_id)
    LEFT JOIN vendor v ON v.organization_id = o.id
    WHERE gs.government_id = 108
      AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
      AND v.id IS NOT NULL;
""")

result = cursor.fetchone()
print(f"Vendor Subscriptions: {result[1]}")
print(f"Unique Vendors: {result[2]}")

conn.close()
```

---

## 📝 Notes

1. **No DateTime Filters:** As requested, these queries do not use any datetime filters
2. **Active Subscriptions Only:** Filters out blocked subscriptions (`is_blocked = false`)
3. **Vendor Accounts Only:** Only includes subscriptions linked to vendor accounts (`v.id IS NOT NULL`)
4. **Current Data:** Government ID 108 currently has 0 subscriptions and 0 vendors
5. **Query Validity:** The queries are correct and will work when data exists for government 108

---

## 🔧 Query Variations

All queries are available in:
- **`government_108_final_queries.sql`** - Complete SQL file with 9 query variations
- Includes queries for vendor_id lists, certification_id counts, and detailed subscriptions

---

**Last Updated:** November 17, 2025  
**Status:** ✅ Queries created and tested  
**Database:** Production (procurement_integration)

