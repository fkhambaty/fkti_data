// Create Razorpay subscription and return subscription_id for Checkout.
// Set secrets: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_PLAN_ID
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID') || '';
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET') || '';
const RAZORPAY_PLAN_ID = Deno.env.get('RAZORPAY_PLAN_ID') || '';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

  if (!RAZORPAY_KEY_SECRET || !RAZORPAY_PLAN_ID) {
    return new Response(JSON.stringify({ error: 'Server config missing' }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
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
    return new Response(JSON.stringify({ error: data.error?.description || 'Razorpay error' }), {
      status: 400,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({ subscription_id: data.id }),
    { headers: { ...cors, 'Content-Type': 'application/json' } }
  );
});
