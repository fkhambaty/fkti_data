// Create Razorpay subscription and return subscription_id for Checkout.
// Required secrets (exact names, case-sensitive): RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_PLAN_ID
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getSecret(name: string): string {
  const v = Deno.env.get(name);
  return (typeof v === 'string' ? v.trim() : '') || '';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: cors });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  // Read secrets per request so the latest values are used after redeploy
  const RAZORPAY_KEY_ID = getSecret('RAZORPAY_KEY_ID');
  const RAZORPAY_KEY_SECRET = getSecret('RAZORPAY_KEY_SECRET');
  const RAZORPAY_PLAN_ID = getSecret('RAZORPAY_PLAN_ID');

  const missing: string[] = [];
  if (!RAZORPAY_KEY_ID) missing.push('RAZORPAY_KEY_ID');
  if (!RAZORPAY_KEY_SECRET) missing.push('RAZORPAY_KEY_SECRET');
  if (!RAZORPAY_PLAN_ID) missing.push('RAZORPAY_PLAN_ID');
  if (missing.length > 0) {
    return new Response(
      JSON.stringify({
        error: `Subscription not configured: missing secret(s) [${missing.join(', ')}]. Set them in Supabase Dashboard → Project Settings → Edge Functions → Secrets.`,
      }),
      {
        status: 503,
        headers: { ...cors, 'Content-Type': 'application/json' },
      }
    );
  }

  let body: { user_id?: string } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  const userId = body.user_id;
  if (!userId) {
    return new Response(JSON.stringify({ error: 'user_id required' }), {
      status: 400,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  const basic = btoa(RAZORPAY_KEY_ID + ':' + RAZORPAY_KEY_SECRET);
  const createRes = await fetch('https://api.razorpay.com/v1/subscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + basic,
    },
    body: JSON.stringify({
      plan_id: RAZORPAY_PLAN_ID,
      total_count: 12,
      quantity: 1,
      notes: { user_id: userId },
    }),
  });

  const data = await createRes.json();
  if (!createRes.ok) {
    const msg =
      data.error?.description ||
      (typeof data.error === 'string' ? data.error : null) ||
      'Payment provider error. Please try again.';
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({ subscription_id: data.id }),
    { headers: { ...cors, 'Content-Type': 'application/json' } }
  );
});
