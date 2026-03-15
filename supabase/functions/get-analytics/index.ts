// Return analytics data for admin dashboard. Auth is by passcode only (no Supabase Auth).
// Optional: set ADMIN_PASSCODE in Edge Function secrets for a fixed passcode; otherwise passcode = today's date ddmmyyyy (IST).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

function getExpectedPasscode(): string {
  const adminPasscode = Deno.env.get('ADMIN_PASSCODE');
  if (adminPasscode) return adminPasscode;
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const dd = String(ist.getDate()).padStart(2, '0');
  const mm = String(ist.getMonth() + 1).padStart(2, '0');
  const yyyy = ist.getFullYear();
  return dd + mm + yyyy;
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

  const [pvRes, evRes, visRes] = await Promise.all([
    sb.from('page_views').select('*').gte('created_at', since).order('created_at', { ascending: false }).limit(5000),
    sb.from('analytics_events').select('*').gte('created_at', since).order('created_at', { ascending: false }).limit(3000),
    sb.from('site_visitors').select('*').order('last_seen', { ascending: false }).limit(1000),
  ]);

  return new Response(
    JSON.stringify({
      page_views: pvRes.data || [],
      analytics_events: evRes.data || [],
      site_visitors: visRes.data || [],
    }),
    { headers: cors }
  );
});
