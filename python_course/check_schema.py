#!/usr/bin/env python3
"""
Check the actual schema structure in the database
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

def check_schemas(conn):
    """List all schemas"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT schema_name 
            FROM information_schema.schemata
            ORDER BY schema_name;
        """)
        schemas = cursor.fetchall()
        print("\n📋 Available Schemas:")
        for schema in schemas:
            print(f"  - {schema['schema_name']}")
        cursor.close()
        return [s['schema_name'] for s in schemas]
    except Exception as e:
        print(f"❌ Error listing schemas: {e}")
        return []

def check_tables_in_schema(conn, schema):
    """List tables in a specific schema"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = %s
            ORDER BY table_name;
        """, (schema,))
        tables = cursor.fetchall()
        if tables:
            print(f"\n📊 Tables in schema '{schema}':")
            for table in tables:
                print(f"  - {table['table_name']}")
        cursor.close()
        return [t['table_name'] for t in tables]
    except Exception as e:
        print(f"❌ Error listing tables in schema {schema}: {e}")
        return []

def check_relevant_tables(conn):
    """Check if the tables mentioned in the query exist"""
    required_tables = [
        'project',
        'organization',
        'vendor',
        'user',
        'proposal',
        'project_vendor_user_subscriptions',
        'project_user_downloads'
    ]
    
    print("\n" + "="*80)
    print("🔍 Checking for required tables...")
    print("="*80)
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        for table in required_tables:
            # Check in public schema
            cursor.execute("""
                SELECT EXISTS (
                    SELECT 1 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = %s
                );
            """, (table,))
            exists = cursor.fetchone()['exists']
            
            status = "✅" if exists else "❌"
            print(f"{status} {table}: {'Found' if exists else 'Not found'}")
            
            if exists:
                # Get row count
                try:
                    cursor.execute(f'SELECT COUNT(*) as count FROM "{table}"')
                    count = cursor.fetchone()['count']
                    print(f"   📊 Row count: {count:,}")
                except Exception as e:
                    print(f"   ⚠️  Could not get count: {e}")
        
        cursor.close()
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    print("="*80)
    print("🔍 DATABASE SCHEMA INVESTIGATION")
    print("="*80)
    
    conn = connect_to_db()
    if not conn:
        return
    
    # List all schemas
    schemas = check_schemas(conn)
    
    # Check for bronze schema specifically
    if 'bronze' in schemas:
        print("\n✅ Found 'bronze' schema!")
        check_tables_in_schema(conn, 'bronze')
    else:
        print("\n⚠️  No 'bronze' schema found")
    
    # Check public schema
    print("\n" + "="*80)
    check_tables_in_schema(conn, 'public')
    
    # Check for required tables
    check_relevant_tables(conn)
    
    conn.close()
    print("\n✅ Investigation complete")

if __name__ == "__main__":
    main()

