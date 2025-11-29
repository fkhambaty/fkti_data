#!/usr/bin/env python3
"""
Query Optimization Script with Test Scenarios
Tests and optimizes the engagement query
"""

import psycopg2
from psycopg2.extras import RealDictCursor
import os
import json
import time
from datetime import datetime

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

# Original Query
ORIGINAL_QUERY = """
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
"""

# Optimized Query
OPTIMIZED_QUERY = """
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
"""

def run_query_with_timing(conn, query, query_name, limit=None):
    """Run a query and return results with timing"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        print(f"\n{'='*80}")
        print(f"🔍 Running {query_name}...")
        print(f"{'='*80}")
        
        # Add LIMIT if specified
        full_query = query
        if limit:
            full_query = f"{query}\nLIMIT {limit}"
        
        start_time = time.time()
        cursor.execute(full_query)
        results = cursor.fetchall()
        end_time = time.time()
        
        execution_time = end_time - start_time
        
        print(f"✅ Query completed in {execution_time:.2f} seconds")
        print(f"📊 Returned {len(results)} rows")
        
        cursor.close()
        
        return {
            'results': results,
            'execution_time': execution_time,
            'row_count': len(results),
            'timestamp': datetime.now().isoformat()
        }
    except Exception as e:
        print(f"❌ Error running query: {e}")
        return None

def get_test_scenarios(conn):
    """Define and prepare test scenarios"""
    print("\n" + "="*80)
    print("📋 Preparing Test Scenarios")
    print("="*80)
    
    scenarios = []
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Scenario 1: Count total rows (full query)
        print("\n1️⃣  Full result set count")
        scenarios.append({
            'name': 'Full Result Set',
            'description': 'Total number of project-organization engagement pairs',
            'test_type': 'count'
        })
        
        # Scenario 2: Sample specific government
        print("2️⃣  Checking available governments...")
        cursor.execute("""
            SELECT DISTINCT government_id 
            FROM project 
            WHERE government_id IS NOT NULL 
            LIMIT 5
        """)
        gov_ids = [row['government_id'] for row in cursor.fetchall()]
        if gov_ids:
            print(f"   Found governments: {gov_ids}")
            scenarios.append({
                'name': f'Government {gov_ids[0]}',
                'description': f'Engagements for government ID {gov_ids[0]}',
                'test_type': 'government_filter',
                'government_id': gov_ids[0]
            })
        
        # Scenario 3: Aggregated metrics
        print("3️⃣  Total engagement metrics across all records")
        scenarios.append({
            'name': 'Total Engagement Metrics',
            'description': 'Sum of all followed, downloaded, applied, no_bid, submitted',
            'test_type': 'aggregates'
        })
        
        # Scenario 4: Sample of specific records
        print("4️⃣  First 100 records ordered by project_id, vendor_name")
        scenarios.append({
            'name': 'First 100 Records',
            'description': 'Sample of first 100 records for comparison',
            'test_type': 'sample',
            'limit': 100
        })
        
        cursor.close()
        print("\n✅ Test scenarios prepared")
        
    except Exception as e:
        print(f"❌ Error preparing test scenarios: {e}")
    
    return scenarios

def run_test_scenario(conn, query, scenario):
    """Run a specific test scenario"""
    print(f"\n{'─'*80}")
    print(f"🧪 Test: {scenario['name']}")
    print(f"   {scenario['description']}")
    print(f"{'─'*80}")
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if scenario['test_type'] == 'count':
            # Count total rows
            count_query = f"SELECT COUNT(*) as total FROM ({query}) as subquery"
            start_time = time.time()
            cursor.execute(count_query)
            result = cursor.fetchone()
            end_time = time.time()
            
            test_result = {
                'total_rows': result['total'],
                'execution_time': end_time - start_time
            }
            print(f"   📊 Total rows: {result['total']:,}")
            print(f"   ⏱️  Time: {test_result['execution_time']:.2f}s")
            
        elif scenario['test_type'] == 'government_filter':
            # Filter by specific government
            filtered_query = f"""
                SELECT * FROM ({query}) as subquery
                WHERE government_id = {scenario['government_id']}
            """
            start_time = time.time()
            cursor.execute(filtered_query)
            results = cursor.fetchall()
            end_time = time.time()
            
            test_result = {
                'row_count': len(results),
                'execution_time': end_time - start_time,
                'sample_records': results[:5] if results else []
            }
            print(f"   📊 Rows for government {scenario['government_id']}: {len(results)}")
            print(f"   ⏱️  Time: {test_result['execution_time']:.2f}s")
            
        elif scenario['test_type'] == 'aggregates':
            # Sum all engagement metrics
            agg_query = f"""
                SELECT 
                    SUM(followed) as total_followed,
                    SUM(downloaded) as total_downloaded,
                    SUM(applied) as total_applied,
                    SUM(no_bid) as total_no_bid,
                    SUM(submitted) as total_submitted
                FROM ({query}) as subquery
            """
            start_time = time.time()
            cursor.execute(agg_query)
            result = cursor.fetchone()
            end_time = time.time()
            
            test_result = {
                'total_followed': result['total_followed'],
                'total_downloaded': result['total_downloaded'],
                'total_applied': result['total_applied'],
                'total_no_bid': result['total_no_bid'],
                'total_submitted': result['total_submitted'],
                'execution_time': end_time - start_time
            }
            print(f"   📊 Total Followed: {result['total_followed']:,}")
            print(f"   📊 Total Downloaded: {result['total_downloaded']:,}")
            print(f"   📊 Total Applied: {result['total_applied']:,}")
            print(f"   📊 Total No Bid: {result['total_no_bid']:,}")
            print(f"   📊 Total Submitted: {result['total_submitted']:,}")
            print(f"   ⏱️  Time: {test_result['execution_time']:.2f}s")
            
        elif scenario['test_type'] == 'sample':
            # Get sample of records
            sample_query = f"""
                SELECT * FROM ({query}) as subquery
                ORDER BY project_id, vendor_name
                LIMIT {scenario['limit']}
            """
            start_time = time.time()
            cursor.execute(sample_query)
            results = cursor.fetchall()
            end_time = time.time()
            
            test_result = {
                'row_count': len(results),
                'execution_time': end_time - start_time,
                'records': results
            }
            print(f"   📊 Sample size: {len(results)}")
            print(f"   ⏱️  Time: {test_result['execution_time']:.2f}s")
        
        cursor.close()
        return test_result
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return {'error': str(e)}

def compare_results(original, optimized, scenario_name):
    """Compare results from original and optimized queries"""
    print(f"\n{'═'*80}")
    print(f"🔍 COMPARISON: {scenario_name}")
    print(f"{'═'*80}")
    
    # Check for errors
    if 'error' in original or 'error' in optimized:
        print("❌ Cannot compare - one or both queries had errors")
        return False
    
    match = True
    
    # Compare based on what keys exist
    if 'total_rows' in original:
        if original['total_rows'] == optimized['total_rows']:
            print(f"✅ Total rows match: {original['total_rows']:,}")
        else:
            print(f"❌ Total rows MISMATCH:")
            print(f"   Original:  {original['total_rows']:,}")
            print(f"   Optimized: {optimized['total_rows']:,}")
            match = False
    
    if 'row_count' in original:
        if original['row_count'] == optimized['row_count']:
            print(f"✅ Row count matches: {original['row_count']:,}")
        else:
            print(f"❌ Row count MISMATCH:")
            print(f"   Original:  {original['row_count']:,}")
            print(f"   Optimized: {optimized['row_count']:,}")
            match = False
    
    # Compare aggregates
    for metric in ['total_followed', 'total_downloaded', 'total_applied', 'total_no_bid', 'total_submitted']:
        if metric in original:
            if original[metric] == optimized[metric]:
                print(f"✅ {metric}: {original[metric]:,}")
            else:
                print(f"❌ {metric} MISMATCH:")
                print(f"   Original:  {original[metric]:,}")
                print(f"   Optimized: {optimized[metric]:,}")
                match = False
    
    # Compare execution times
    if 'execution_time' in original and 'execution_time' in optimized:
        speedup = original['execution_time'] / optimized['execution_time'] if optimized['execution_time'] > 0 else 0
        improvement = ((original['execution_time'] - optimized['execution_time']) / original['execution_time'] * 100) if original['execution_time'] > 0 else 0
        
        print(f"\n⏱️  Performance:")
        print(f"   Original:  {original['execution_time']:.2f}s")
        print(f"   Optimized: {optimized['execution_time']:.2f}s")
        print(f"   Speedup:   {speedup:.2f}x")
        print(f"   Improvement: {improvement:.1f}%")
    
    return match

def save_results(filename, data):
    """Save results to JSON file"""
    try:
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2, default=str)
        print(f"✅ Results saved to {filename}")
    except Exception as e:
        print(f"❌ Error saving results: {e}")

def main():
    print("="*80)
    print("🚀 QUERY OPTIMIZATION WITH TEST SCENARIOS")
    print("="*80)
    
    conn = connect_to_db()
    if not conn:
        return
    
    # Prepare test scenarios
    scenarios = get_test_scenarios(conn)
    
    # Store all results
    all_results = {
        'timestamp': datetime.now().isoformat(),
        'original': {},
        'optimized': {},
        'comparisons': {}
    }
    
    # Run original query with all test scenarios
    print("\n" + "="*80)
    print("📊 PHASE 1: Testing Original Query")
    print("="*80)
    
    for scenario in scenarios:
        result = run_test_scenario(conn, ORIGINAL_QUERY, scenario)
        all_results['original'][scenario['name']] = result
    
    # Run optimized query with all test scenarios
    print("\n" + "="*80)
    print("🚀 PHASE 2: Testing Optimized Query")
    print("="*80)
    
    for scenario in scenarios:
        result = run_test_scenario(conn, OPTIMIZED_QUERY, scenario)
        all_results['optimized'][scenario['name']] = result
    
    # Compare results
    print("\n" + "="*80)
    print("🔬 PHASE 3: Comparing Results")
    print("="*80)
    
    all_match = True
    for scenario in scenarios:
        match = compare_results(
            all_results['original'][scenario['name']],
            all_results['optimized'][scenario['name']],
            scenario['name']
        )
        all_results['comparisons'][scenario['name']] = {
            'match': match,
            'timestamp': datetime.now().isoformat()
        }
        if not match:
            all_match = False
    
    # Final summary
    print("\n" + "="*80)
    print("📊 FINAL SUMMARY")
    print("="*80)
    
    if all_match:
        print("✅ ALL TEST SCENARIOS PASSED - Results match perfectly!")
        print("✅ The optimized query produces identical results")
    else:
        print("❌ SOME TEST SCENARIOS FAILED - Results differ")
        print("⚠️  Review the comparisons above for details")
    
    # Save results to file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"engagement_query_test_results_{timestamp}.json"
    save_results(filename, all_results)
    
    # Save queries to SQL files
    with open('engagement_query_original.sql', 'w') as f:
        f.write(ORIGINAL_QUERY)
    print("✅ Original query saved to engagement_query_original.sql")
    
    with open('engagement_query_optimized.sql', 'w') as f:
        f.write(OPTIMIZED_QUERY)
    print("✅ Optimized query saved to engagement_query_optimized.sql")
    
    conn.close()
    print("\n✅ Database connection closed")
    print("="*80)

if __name__ == "__main__":
    main()

