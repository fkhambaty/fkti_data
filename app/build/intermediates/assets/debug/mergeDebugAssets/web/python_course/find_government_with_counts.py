#!/usr/bin/env python3
"""
Find which government has 25,926 subscribers and 13,765 vendors
"""

import psycopg2
from psycopg2.extras import RealDictCursor
import os

def connect_to_db():
    """Connect to the PostgreSQL database"""
    try:
        conn = psycopg2.connect(
            host=os.environ.get('DB_HOST', 'localhost'),
            port=os.environ.get('DB_PORT', '54326'),
            database=os.environ.get('DB_NAME', 'procurement_integration'),
            user=os.environ.get('DB_USER', 'usr_teleport_writer'),
            password=os.environ.get('DB_PASSWORD', '')
        )
        print("✅ Successfully connected to Production database!\n")
        return conn
    except Exception as e:
        print(f"❌ Error connecting to database: {e}")
        return None

def find_governments_with_subscriber_counts(conn):
    """Find governments with high subscriber counts"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT 
                gs.government_id,
                g.code AS government_code,
                COUNT(*) as subscriber_count
            FROM government_subscriptions gs
            JOIN government g ON g.id = gs.government_id
            WHERE (gs.is_blocked IS NULL OR gs.is_blocked = false)
            GROUP BY gs.government_id, g.code
            HAVING COUNT(*) > 10000
            ORDER BY subscriber_count DESC
            LIMIT 20;
        """
        
        cursor.execute(query)
        results = cursor.fetchall()
        
        print("📊 GOVERNMENTS WITH HIGH SUBSCRIBER COUNTS (> 10,000)")
        print(f"\n{'Gov ID':<10} {'Code':<20} {'Subscribers':>15} {'Target Match':<15}")
        print("-" * 70)
        
        for row in results:
            match = "✅ 25,926" if row['subscriber_count'] == 25926 else ""
            print(f"{row['government_id']:<10} {row['government_code']:<20} {row['subscriber_count']:>15,} {match:<15}")
        
        print()
        cursor.close()
        return results
    except Exception as e:
        print(f"❌ Error: {e}\n")
        return None

def find_governments_with_vendor_counts(conn):
    """Find governments with high vendor counts"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT 
                gov_id AS government_id,
                g.code AS government_code,
                COUNT(DISTINCT vd.id) as vendor_count
            FROM vendors_dataset vd,
            LATERAL unnest(vd.subscribed_governments_ids) AS gov_id
            JOIN government g ON g.id = gov_id
            WHERE vd.organization_id IS NOT NULL
            GROUP BY gov_id, g.code
            HAVING COUNT(DISTINCT vd.id) > 5000
            ORDER BY vendor_count DESC
            LIMIT 20;
        """
        
        cursor.execute(query)
        results = cursor.fetchall()
        
        print("📊 GOVERNMENTS WITH HIGH VENDOR COUNTS (> 5,000)")
        print(f"\n{'Gov ID':<10} {'Code':<20} {'Vendors':>15} {'Target Match':<15}")
        print("-" * 70)
        
        for row in results:
            match = "✅ 13,765" if row['vendor_count'] == 13765 else ""
            print(f"{row['government_id']:<10} {row['government_code']:<20} {row['vendor_count']:>15,} {match:<15}")
        
        print()
        cursor.close()
        return results
    except Exception as e:
        print(f"❌ Error: {e}\n")
        return None

def check_specific_governments(conn):
    """Check specific government IDs"""
    governments_to_check = [108, 278, 669]
    
    print("=" * 70)
    print("📋 CHECKING SPECIFIC GOVERNMENTS")
    print("=" * 70)
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        for gov_id in governments_to_check:
            # Get government info
            cursor.execute("""
                SELECT id, code
                FROM government 
                WHERE id = %s
            """, (gov_id,))
            gov = cursor.fetchone()
            
            # Get subscriber count
            cursor.execute("""
                SELECT COUNT(*) as count
                FROM government_subscriptions
                WHERE government_id = %s
                  AND (is_blocked IS NULL OR is_blocked = false)
            """, (gov_id,))
            sub_count = cursor.fetchone()['count']
            
            # Get vendor count
            cursor.execute("""
                SELECT COUNT(DISTINCT id) as count
                FROM vendors_dataset,
                LATERAL unnest(subscribed_governments_ids) AS gov_id
                WHERE gov_id = %s
                  AND organization_id IS NOT NULL
            """, (gov_id,))
            vendor_count = cursor.fetchone()['count']
            
            print(f"\n🏛️  Government ID: {gov_id}")
            if gov:
                print(f"   Code: {gov['code']}")
            print(f"   Subscribers: {sub_count:,}")
            print(f"   Vendors: {vendor_count:,}")
        
        print("\n" + "=" * 70 + "\n")
        cursor.close()
    except Exception as e:
        print(f"❌ Error: {e}\n")

def main():
    conn = connect_to_db()
    if not conn:
        return
    
    try:
        # Find governments with high subscriber counts
        find_governments_with_subscriber_counts(conn)
        
        # Find governments with high vendor counts
        find_governments_with_vendor_counts(conn)
        
        # Check specific governments
        check_specific_governments(conn)
        
    finally:
        conn.close()
        print("✅ Connection closed successfully\n")

if __name__ == "__main__":
    main()

