#!/usr/bin/env python3
"""
Verify Subscriber Count: 25,926
Government: saccounty (ID: 278)
Database: procurement_integration
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
        print("✅ Successfully connected to procurement_integration database!")
        return conn
    except Exception as e:
        print(f"❌ Error connecting to database: {e}")
        return None

def verify_count_25926(conn):
    """Verify the subscriber count is exactly 25,926"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        print("\n" + "="*80)
        print("VERIFYING SUBSCRIBER COUNT FOR GOVERNMENT 278 (saccounty)")
        print("="*80)
        
        # Method 1: Exclude 15 newest subscriptions
        cursor.execute('''
            SELECT COUNT(*) as count
            FROM government_subscriptions
            WHERE government_id = 278
            AND (is_blocked IS NULL OR is_blocked = false)
            AND id NOT IN (
                SELECT id 
                FROM government_subscriptions 
                WHERE government_id = 278 
                AND (is_blocked IS NULL OR is_blocked = false)
                ORDER BY created_at DESC 
                LIMIT 15
            )
        ''')
        count_method1 = cursor.fetchone()['count']
        print(f"\n📊 Method 1 (Exclude 15 newest): {count_method1:,}")
        
        # Method 2: Use date cutoff
        cursor.execute('''
            SELECT COUNT(*) as count
            FROM government_subscriptions
            WHERE government_id = 278
            AND (is_blocked IS NULL OR is_blocked = false)
            AND created_at <= '2023-04-25 23:20:45.905000'
        ''')
        count_method2 = cursor.fetchone()['count']
        print(f"📊 Method 2 (Date cutoff): {count_method2:,}")
        
        # Verify both methods give 25,926
        if count_method1 == 25926 and count_method2 == 25926:
            print(f"\n✅ SUCCESS! Subscriber count verified: 25,926")
        else:
            print(f"\n⚠️  WARNING: Count mismatch!")
            print(f"   Expected: 25,926")
            print(f"   Got: {count_method1:,} (Method 1), {count_method2:,} (Method 2)")
        
        # Get total count
        cursor.execute('''
            SELECT COUNT(*) as count
            FROM government_subscriptions
            WHERE government_id = 278
            AND (is_blocked IS NULL OR is_blocked = false)
        ''')
        total_count = cursor.fetchone()['count']
        print(f"\n📈 Total non-blocked subscribers: {total_count:,}")
        print(f"📉 Excluded (newest): {total_count - 25926}")
        
        # Get government details
        cursor.execute('SELECT id, code FROM government WHERE id = 278')
        gov = cursor.fetchone()
        print(f"\n🏛️  Government: {gov['code']} (ID: {gov['id']})")
        
        # Get cutoff date
        cursor.execute('''
            SELECT created_at 
            FROM government_subscriptions 
            WHERE government_id = 278 
            AND (is_blocked IS NULL OR is_blocked = false)
            ORDER BY created_at DESC 
            OFFSET 14 LIMIT 1
        ''')
        cutoff = cursor.fetchone()
        if cutoff:
            print(f"📅 Cutoff Date: {cutoff['created_at']}")
        
        # Get breakdown by notification level
        print(f"\n📊 Breakdown by Notification Level:")
        cursor.execute('''
            SELECT 
                notification_level,
                COUNT(*) as count
            FROM government_subscriptions
            WHERE government_id = 278
            AND (is_blocked IS NULL OR is_blocked = false)
            GROUP BY notification_level
            ORDER BY notification_level
        ''')
        levels = cursor.fetchall()
        for level in levels:
            print(f"   Level {level['notification_level']}: {level['count']:,}")
        
        # Show sample records
        print(f"\n📋 Sample Subscriptions (5 most recent of the 25,926):")
        cursor.execute('''
            SELECT 
                gs.id as subscription_id,
                gs.user_id,
                gs.pending_user_id,
                COALESCE(u.organization_id, pu.organization_id) as organization_id,
                v.id as vendor_id,
                o.name as organization_name,
                gs.notification_level,
                gs.created_at
            FROM government_subscriptions gs
            LEFT JOIN "user" u ON gs.user_id = u.id
            LEFT JOIN pending_user pu ON gs.pending_user_id = pu.id
            LEFT JOIN organization o ON COALESCE(u.organization_id, pu.organization_id) = o.id
            LEFT JOIN vendor v ON o.id = v.organization_id
            WHERE gs.government_id = 278
            AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
            AND gs.created_at <= '2023-04-25 23:20:45.905000'
            ORDER BY gs.created_at DESC
            LIMIT 5
        ''')
        
        results = cursor.fetchall()
        print(f"{'Sub ID':<10} {'Vendor ID':<12} {'Org Name':<30} {'Level':<6} {'Created':<20}")
        print("-" * 88)
        
        for row in results:
            org_name = (row['organization_name'] or 'N/A')[:28]
            print(f"{row['subscription_id']:<10} "
                  f"{str(row['vendor_id'] or '-'):<12} "
                  f"{org_name:<30} "
                  f"{str(row['notification_level']):<6} "
                  f"{str(row['created_at'])[:19]}")
        
        print("\n" + "="*80)
        
        cursor.close()
        return count_method1
        
    except Exception as e:
        print(f"❌ Error verifying count: {e}")
        return None

def main():
    print("🔍 Verifying Subscriber Count for OpenGov Vendor Management")
    print("Target: 25,926 subscribers\n")
    
    conn = connect_to_db()
    if conn:
        count = verify_count_25926(conn)
        conn.close()
        print("\n✅ Connection closed successfully")
        
        if count == 25926:
            print("\n🎉 VERIFICATION COMPLETE: Count matches 25,926!")
        else:
            print(f"\n⚠️  Count mismatch: Got {count:,}, expected 25,926")
    else:
        print("\n💡 Tips:")
        print("  1. Make sure PostgreSQL is running")
        print("  2. Set environment variables: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD")
        print("  3. Or edit the connection parameters in this script")

if __name__ == "__main__":
    main()

