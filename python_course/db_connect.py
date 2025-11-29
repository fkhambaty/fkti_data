#!/usr/bin/env python3
"""
PostgreSQL Database Connection Script
Connect to procurement_integration database
"""

import psycopg2
from psycopg2.extras import RealDictCursor
import os

def connect_to_db():
    """Connect to the PostgreSQL database"""
    try:
        # Connection parameters - UPDATE THESE WITH YOUR CREDENTIALS
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

def list_tables(conn):
    """List all tables in the database"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        """)
        tables = cursor.fetchall()
        print("\n📋 Tables in procurement_integration:")
        for table in tables:
            print(f"  - {table['table_name']}")
        cursor.close()
        return tables
    except Exception as e:
        print(f"❌ Error listing tables: {e}")
        return []

def describe_table(conn, table_name):
    """Show structure of a table"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = %s
            ORDER BY ordinal_position;
        """, (table_name,))
        columns = cursor.fetchall()
        print(f"\n📊 Structure of {table_name}:")
        for col in columns:
            print(f"  - {col['column_name']}: {col['data_type']}")
        cursor.close()
        return columns
    except Exception as e:
        print(f"❌ Error describing table: {e}")
        return []

def get_subscribers(conn, government_id):
    """Get subscriber count with vendor_id and organization_id for a government"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Query to get subscribers with vendor_id and organization_id
        query = '''
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
            WHERE gs.government_id = %s
            AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
            ORDER BY gs.created_at DESC
            LIMIT 50
        '''
        
        cursor.execute(query, (government_id,))
        results = cursor.fetchall()
        
        # Get total count
        cursor.execute('''
            SELECT COUNT(*)
            FROM government_subscriptions gs
            WHERE gs.government_id = %s
            AND (gs.is_blocked IS NULL OR gs.is_blocked = false)
        ''', (government_id,))
        total_count = cursor.fetchone()['count']
        
        print(f"\n📊 Subscriber Count for Government ID {government_id}: {total_count:,}")
        
        print(f"\n📋 Recent Subscriptions (showing first 50):")
        print(f"{'Sub ID':<10} {'User ID':<10} {'Pend ID':<10} {'Organization ID':<18} {'Vendor ID':<12} {'Created':<20}")
        print("-" * 90)
        
        for row in results:
            print(f"{str(row['subscription_id']):<10} "
                  f"{str(row['user_id'] or '-'):<10} "
                  f"{str(row['pending_user_id'] or '-'):<10} "
                  f"{str(row['organization_id'] or '-'):<18} "
                  f"{str(row['vendor_id'] or '-'):<12} "
                  f"{str(row['created_at'])[:19] if row['created_at'] else '-':<20}")
        
        cursor.close()
        return total_count
    except Exception as e:
        print(f"❌ Error getting subscribers: {e}")
        return None

def main():
    print("🔌 Connecting to procurement_integration database...\n")
    
    conn = connect_to_db()
    if conn:
        # List all tables
        list_tables(conn)
        
        # Get subscriber count for government_id 669
        print("\n" + "="*80)
        get_subscribers(conn, 669)
        print("="*80)
        
        conn.close()
        print("\n✅ Connection closed successfully")
    else:
        print("\n💡 Tips:")
        print("  1. Make sure PostgreSQL is running")
        print("  2. Set environment variables: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD")
        print("  3. Or edit the connection parameters in this script")

if __name__ == "__main__":
    main()


