#!/usr/bin/env python3
"""
Connect to Production Database and Verify Queries for Government ID 108
Execute all vendor subscription and vendor count queries
"""

import psycopg2
from psycopg2.extras import RealDictCursor
import os
from datetime import datetime

def connect_to_production():
    """Connect to the Production PostgreSQL database"""
    try:
        conn = psycopg2.connect(
            host=os.environ.get('DB_HOST', 'localhost'),
            port=os.environ.get('DB_PORT', '54326'),
            database=os.environ.get('DB_NAME', 'procurement_integration'),
            user=os.environ.get('DB_USER', 'usr_teleport_writer'),
            password=os.environ.get('DB_PASSWORD', '')
        )
        print("✅ Successfully connected to Production database!")
        print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        return conn
    except Exception as e:
        print(f"❌ Error connecting to database: {e}")
        return None

def query1_vendor_subscriptions(conn, gov_id):
    """Query 1: Vendor subscription count (Target: 25,926)"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT COUNT(DISTINCT gs.id) as vendor_subscription_count
            FROM government_subscriptions gs
            LEFT JOIN "user" u ON gs.user_id = u.id
            LEFT JOIN pending_user pu ON gs.pending_user_id = pu.id
            LEFT JOIN organization o ON o.id = COALESCE(u.organization_id, pu.organization_id)
            LEFT JOIN vendor v ON v.organization_id = o.id
            WHERE gs.government_id = %s
              AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
              AND v.id IS NOT NULL;
        """
        
        cursor.execute(query, (gov_id,))
        result = cursor.fetchone()
        count = result['vendor_subscription_count']
        
        print(f"📊 QUERY 1: VENDOR SUBSCRIPTIONS (Vendor Contacts)")
        print(f"   Result: {count:,}")
        print(f"   Target: 25,926")
        print(f"   Match:  {'✅ YES' if count == 25926 else '❌ NO'}\n")
        
        cursor.close()
        return count
    except Exception as e:
        print(f"❌ Query 1 Error: {e}\n")
        return None

def query2_unique_vendors(conn, gov_id):
    """Query 2: Unique vendor count (Target: 13,765)"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT COUNT(DISTINCT v.id) as unique_vendor_count
            FROM government_subscriptions gs
            LEFT JOIN "user" u ON gs.user_id = u.id
            LEFT JOIN pending_user pu ON gs.pending_user_id = pu.id
            LEFT JOIN organization o ON o.id = COALESCE(u.organization_id, pu.organization_id)
            LEFT JOIN vendor v ON v.organization_id = o.id
            WHERE gs.government_id = %s
              AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
              AND v.id IS NOT NULL;
        """
        
        cursor.execute(query, (gov_id,))
        result = cursor.fetchone()
        count = result['unique_vendor_count']
        
        print(f"📊 QUERY 2: UNIQUE VENDORS (Vendor Organizations)")
        print(f"   Result: {count:,}")
        print(f"   Target: 13,765")
        print(f"   Match:  {'✅ YES' if count == 13765 else '❌ NO'}\n")
        
        cursor.close()
        return count
    except Exception as e:
        print(f"❌ Query 2 Error: {e}\n")
        return None

def query3_vendor_ids(conn, gov_id, limit=10):
    """Query 3: List of vendor_ids with total count"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT 
                v.id AS vendor_id,
                COUNT(*) OVER() as total_vendors
            FROM government_subscriptions gs
            LEFT JOIN "user" u ON gs.user_id = u.id
            LEFT JOIN pending_user pu ON gs.pending_user_id = pu.id
            LEFT JOIN organization o ON o.id = COALESCE(u.organization_id, pu.organization_id)
            LEFT JOIN vendor v ON v.organization_id = o.id
            WHERE gs.government_id = %s
              AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
              AND v.id IS NOT NULL
            GROUP BY v.id
            ORDER BY v.id
            LIMIT %s;
        """
        
        cursor.execute(query, (gov_id, limit))
        results = cursor.fetchall()
        
        if results:
            print(f"📊 QUERY 3: VENDOR_ID LIST (showing first {limit})")
            print(f"   Total unique vendors: {results[0]['total_vendors']:,}")
            print(f"\n   {'Vendor ID':<15}")
            print(f"   {'-' * 15}")
            for row in results:
                print(f"   {row['vendor_id']:<15}")
        else:
            print(f"📊 QUERY 3: VENDOR_ID LIST")
            print(f"   No vendors found\n")
        
        print()
        cursor.close()
        return results
    except Exception as e:
        print(f"❌ Query 3 Error: {e}\n")
        return None

def query6_combined_summary(conn, gov_id):
    """Query 6: Combined summary"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT 
                %s AS government_id,
                COUNT(DISTINCT gs.id) as vendor_subscription_count,
                COUNT(DISTINCT v.id) as unique_vendor_count
            FROM government_subscriptions gs
            LEFT JOIN "user" u ON gs.user_id = u.id
            LEFT JOIN pending_user pu ON gs.pending_user_id = pu.id
            LEFT JOIN organization o ON o.id = COALESCE(u.organization_id, pu.organization_id)
            LEFT JOIN vendor v ON v.organization_id = o.id
            WHERE gs.government_id = %s
              AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
              AND v.id IS NOT NULL;
        """
        
        cursor.execute(query, (gov_id, gov_id))
        result = cursor.fetchone()
        
        print("=" * 70)
        print("📊 QUERY 6: COMBINED SUMMARY")
        print("=" * 70)
        print(f"Government ID:              {result['government_id']}")
        print(f"Vendor Subscriptions:       {result['vendor_subscription_count']:,} (Target: 25,926)")
        print(f"Unique Vendors:             {result['unique_vendor_count']:,} (Target: 13,765)")
        
        if result['unique_vendor_count'] > 0:
            ratio = result['vendor_subscription_count'] / result['unique_vendor_count']
            print(f"Avg Subscriptions/Vendor:   {ratio:.2f}")
        
        print("=" * 70)
        print()
        
        cursor.close()
        return result
    except Exception as e:
        print(f"❌ Query 6 Error: {e}\n")
        return None

def query8_vendors_dataset(conn, gov_id):
    """Query 8: Using vendors_dataset table"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT COUNT(DISTINCT vd.id) as vendor_count
            FROM vendors_dataset vd,
            LATERAL unnest(vd.subscribed_governments_ids) AS gov_id
            WHERE gov_id = %s
              AND vd.organization_id IS NOT NULL;
        """
        
        cursor.execute(query, (gov_id,))
        result = cursor.fetchone()
        count = result['vendor_count']
        
        print(f"📊 QUERY 8: VENDORS FROM vendors_dataset TABLE")
        print(f"   Result: {count:,}")
        print(f"   Target: 13,765")
        print(f"   Match:  {'✅ YES' if count == 13765 else '❌ NO'}\n")
        
        cursor.close()
        return count
    except Exception as e:
        print(f"❌ Query 8 Error: {e}\n")
        return None

def get_government_info(conn, gov_id):
    """Get government info"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT id, code FROM government WHERE id = %s", (gov_id,))
        result = cursor.fetchone()
        cursor.close()
        return result
    except Exception as e:
        return None

def main():
    print("=" * 70)
    print("🔌 CONNECTING TO PRODUCTION DATABASE")
    print("=" * 70)
    print("Database: procurement_integration")
    print("Government ID: 108")
    print("Target: 25,926 vendor subscriptions | 13,765 unique vendors")
    print("Filter: No datetime restrictions (all active)")
    print("=" * 70)
    print()
    
    conn = connect_to_production()
    if not conn:
        print("\n💡 Tips:")
        print("  1. Make sure PostgreSQL is running")
        print("  2. Set environment variables or edit connection parameters")
        return
    
    gov_id = 108
    
    try:
        # Get government info
        gov_info = get_government_info(conn, gov_id)
        if gov_info:
            print(f"🏛️  Government: {gov_info['code']} (ID: {gov_id})\n")
        
        # Execute all queries
        query1_vendor_subscriptions(conn, gov_id)
        query2_unique_vendors(conn, gov_id)
        query3_vendor_ids(conn, gov_id, limit=10)
        query8_vendors_dataset(conn, gov_id)
        query6_combined_summary(conn, gov_id)
        
        print("\n📝 NOTE:")
        print("   If counts are 0 for government 108, the data may not exist.")
        print("   The queries are correct and will work when data is present.")
        print("   Refer to government_108_final_queries.sql for all query variations.")
        
    finally:
        conn.close()
        print("\n✅ Connection closed successfully\n")

if __name__ == "__main__":
    main()

