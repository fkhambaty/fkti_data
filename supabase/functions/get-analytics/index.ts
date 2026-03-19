// Return analytics data for admin dashboard. Auth is by passcode only (no Supabase Auth).
// Set ADMIN_PASSCODE in Edge Function secrets (Supabase Dashboard > Project Settings > Edge Functions > secrets).
// Do not rely on the date fallback in production; it is only for backward compatibility.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

/** IST = UTC+5:30. Returns today's date in IST as DDMMYYYY (reliable across server timezones). */
function getTodayISTDDMMYYYY(): string {
  const utcMs = Date.now();
  const istMs = utcMs + 5.5 * 60 * 60 * 1000;
  const d = new Date(istMs);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = d.getUTCFullYear();
  return dd + mm + yyyy;
}

function getExpectedPasscode(): string {
  const adminPasscode = Deno.env.get('ADMIN_PASSCODE');
  if (adminPasscode && adminPasscode.trim()) return adminPasscode.trim();
  return getTodayISTDDMMYYYY();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: cors });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: cors,
    });
  }

  let body: { passcode?: string; since?: string } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: cors,
    });
  }

  const passcode = (body.passcode || '').trim();
  const expected = getExpectedPasscode();
  if (passcode !== expected) {
    return new Response(JSON.stringify({ error: 'Invalid passcode' }), {
      status: 401,
      headers: cors,
    });
  }

  const since = body.since || '2020-01-01T00:00:00Z';
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'Server misconfiguration' }), {
      status: 500,
      headers: cors,
    });
  }

  const sb = createClient(supabaseUrl, serviceRoleKey);
  const nowIso = new Date().toISOString();

  const [pvRes, evRes, visRes, subRes] = await Promise.all([
    sb.from('page_views').select('*').gte('created_at', since).order('created_at', { ascending: false }).limit(5000),
    sb.from('analytics_events').select('*').gte('created_at', since).order('created_at', { ascending: false }).limit(3000),
    sb.from('site_visitors').select('*').order('last_seen', { ascending: false }).limit(1000),
    sb.from('profiles').select('id', { count: 'exact', head: true }).eq('subscription_status', 'pro').gte('subscription_end_date', nowIso),
  ]);

  let totalActiveSubscribers = 0;
  if (subRes.error) {
    console.error('[get-analytics] profiles count error:', subRes.error);
  } else if (typeof (subRes as { count?: number }).count === 'number') {
    totalActiveSubscribers = (subRes as { count: number }).count;
  }

  return new Response(
    JSON.stringify({
      page_views: pvRes.data || [],
      analytics_events: evRes.data || [],
      site_visitors: visRes.data || [],
      total_active_subscribers: totalActiveSubscribers,
    }),
    { headers: cors }
  );
});
