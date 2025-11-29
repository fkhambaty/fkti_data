#!/usr/bin/env python3
"""
Connect to Production Database and Execute Queries for Government ID 108
Target: 25,926 subscribers and 13,765 vendors
No datetime filters
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
        print("✅ Successfully connected to Production database (procurement_integration)!")
        print(f"📅 Connection time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        return conn
    except Exception as e:
        print(f"❌ Error connecting to database: {e}")
        return None

def get_subscriber_count(conn, government_id):
    """Get subscriber count for government_id 108 (Target: 25,926)"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT COUNT(*) as subscriber_count
            FROM government_subscriptions gs
            WHERE gs.government_id = %s
              AND (gs.is_blocked IS NULL OR gs.is_blocked = false);
        """
        
        cursor.execute(query, (government_id,))
        result = cursor.fetchone()
        count = result['subscriber_count']
        
        print(f"📊 SUBSCRIBER COUNT for Government ID {government_id}")
        print(f"   Result: {count:,}")
        print(f"   Target: 25,926")
        print(f"   Match: {'✅ YES' if count == 25926 else '❌ NO'}\n")
        
        cursor.close()
        return count
    except Exception as e:
        print(f"❌ Error getting subscriber count: {e}\n")
        return None

def get_vendor_count(conn, government_id):
    """Get vendor count for government_id 108 (Target: 13,765)"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT COUNT(DISTINCT id) as vendor_count
            FROM vendors_dataset,
            LATERAL unnest(subscribed_governments_ids) AS gov_id
            WHERE gov_id = %s
              AND organization_id IS NOT NULL;
        """
        
        cursor.execute(query, (government_id,))
        result = cursor.fetchone()
        count = result['vendor_count']
        
        print(f"📊 VENDOR COUNT for Government ID {government_id}")
        print(f"   Result: {count:,}")
        print(f"   Target: 13,765")
        print(f"   Match: {'✅ YES' if count == 13765 else '❌ NO'}\n")
        
        cursor.close()
        return count
    except Exception as e:
        print(f"❌ Error getting vendor count: {e}\n")
        return None

def get_vendor_ids_with_count(conn, government_id, limit=10):
    """Get vendor IDs for government (sample)"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT 
                id AS vendor_id,
                COUNT(*) OVER() as total_vendor_count
            FROM vendors_dataset,
            LATERAL unnest(subscribed_governments_ids) AS gov_id
            WHERE gov_id = %s
              AND organization_id IS NOT NULL
            ORDER BY id
            LIMIT %s;
        """
        
        cursor.execute(query, (government_id, limit))
        results = cursor.fetchall()
        
        if results:
            print(f"📋 VENDOR IDs (showing first {limit})")
            print(f"   Total vendors: {results[0]['total_vendor_count']:,}")
            print(f"\n   {'Vendor ID':<12}")
            print(f"   {'-' * 12}")
            for row in results:
                print(f"   {row['vendor_id']:<12}")
            print()
        
        cursor.close()
        return results
    except Exception as e:
        print(f"❌ Error getting vendor IDs: {e}\n")
        return None

def get_certification_counts(conn, government_id, limit=10):
    """Get certification IDs with vendor counts"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
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
            WHERE gov_id = %s
              AND organization_id IS NOT NULL
            GROUP BY cert_id
            ORDER BY vendor_count DESC
            LIMIT %s;
        """
        
        cursor.execute(query, (government_id, limit))
        results = cursor.fetchall()
        
        if results:
            print(f"📋 CERTIFICATION IDs with VENDOR COUNTS (top {limit})")
            print(f"\n   {'Certification ID':<20} {'Vendor Count':>15}")
            print(f"   {'-' * 20} {'-' * 15}")
            for row in results:
                cert_id = row['certification_id'] or 'NULL'
                print(f"   {cert_id:<20} {row['vendor_count']:>15,}")
            print()
        
        cursor.close()
        return results
    except Exception as e:
        print(f"❌ Error getting certification counts: {e}\n")
        return None

def get_combined_summary(conn, government_id):
    """Get combined summary: subscribers + vendors"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT 
                %s AS government_id,
                (
                    SELECT COUNT(*)
                    FROM government_subscriptions gs
                    WHERE gs.government_id = %s
                      AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
                ) as subscriber_count,
                (
                    SELECT COUNT(DISTINCT id)
                    FROM vendors_dataset,
                    LATERAL unnest(subscribed_governments_ids) AS gov_id
                    WHERE gov_id = %s
                      AND organization_id IS NOT NULL
                ) as vendor_count;
        """
        
        cursor.execute(query, (government_id, government_id, government_id))
        result = cursor.fetchone()
        
        print("=" * 60)
        print("📊 COMBINED SUMMARY FOR GOVERNMENT ID 108")
        print("=" * 60)
        print(f"Government ID:    {result['government_id']}")
        print(f"Subscriber Count: {result['subscriber_count']:,} (Target: 25,926)")
        print(f"Vendor Count:     {result['vendor_count']:,} (Target: 13,765)")
        print("=" * 60)
        print()
        
        cursor.close()
        return result
    except Exception as e:
        print(f"❌ Error getting combined summary: {e}\n")
        return None

def main():
    print("=" * 60)
    print("🔌 CONNECTING TO PRODUCTION DATABASE")
    print("=" * 60)
    print("Database: procurement_integration")
    print("Government ID: 108")
    print("Target Counts: 25,926 subscribers | 13,765 vendors")
    print("Filter: No datetime restrictions")
    print("=" * 60)
    print()
    
    # Connect to database
    conn = connect_to_production()
    if not conn:
        print("\n💡 Tips:")
        print("  1. Make sure PostgreSQL is running")
        print("  2. Set environment variables: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD")
        print("  3. Or edit the connection parameters in this script")
        return
    
    government_id = 108
    
    try:
        # Get subscriber count
        get_subscriber_count(conn, government_id)
        
        # Get vendor count
        get_vendor_count(conn, government_id)
        
        # Get vendor IDs sample
        get_vendor_ids_with_count(conn, government_id, limit=10)
        
        # Get certification counts
        get_certification_counts(conn, government_id, limit=10)
        
        # Get combined summary
        get_combined_summary(conn, government_id)
        
    finally:
        conn.close()
        print("✅ Connection closed successfully\n")

if __name__ == "__main__":
    main()

