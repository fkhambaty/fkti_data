// Create Razorpay subscription and return subscription_id for Checkout.
// Supports weekly (RAZORPAY_PLAN_ID) and monthly (RAZORPAY_MONTHLY_PLAN_ID) plans.
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

  const RAZORPAY_KEY_ID = getSecret('RAZORPAY_KEY_ID');
  const RAZORPAY_KEY_SECRET = getSecret('RAZORPAY_KEY_SECRET');
  const WEEKLY_PLAN_ID = getSecret('RAZORPAY_PLAN_ID');
  const MONTHLY_PLAN_ID = getSecret('RAZORPAY_MONTHLY_PLAN_ID');

  const missing: string[] = [];
  if (!RAZORPAY_KEY_ID) missing.push('RAZORPAY_KEY_ID');
  if (!RAZORPAY_KEY_SECRET) missing.push('RAZORPAY_KEY_SECRET');
  if (!WEEKLY_PLAN_ID && !MONTHLY_PLAN_ID) missing.push('RAZORPAY_PLAN_ID or RAZORPAY_MONTHLY_PLAN_ID');
  if (missing.length > 0) {
    console.error('[create-subscription] Missing secrets:', missing.join(', '));
    return new Response(
      JSON.stringify({
        error: 'Payment is temporarily unavailable. Please try again later or contact support.',
        admin_hint: `Missing secret(s): ${missing.join(', ')}`,
      }),
      { status: 503, headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  }

  let body: { user_id?: string; plan?: string; email?: string } = {};
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

  const planChoice = (body.plan || 'weekly').toLowerCase();
  let planId: string;
  let totalCount: number;

  if (planChoice === 'monthly') {
    if (!MONTHLY_PLAN_ID) {
      return new Response(JSON.stringify({ error: 'Monthly plan not configured. Please contact support.' }), {
        status: 503, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }
    planId = MONTHLY_PLAN_ID;
    totalCount = 12;
  } else {
    if (!WEEKLY_PLAN_ID) {
      return new Response(JSON.stringify({ error: 'Weekly plan not configured. Please contact support.' }), {
        status: 503, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }
    planId = WEEKLY_PLAN_ID;
    totalCount = 52;
  }

  const basic = btoa(RAZORPAY_KEY_ID + ':' + RAZORPAY_KEY_SECRET);
  let createRes: Response;
  try {
    createRes = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + basic,
      },
      body: JSON.stringify({
        plan_id: planId,
        total_count: totalCount,
        quantity: 1,
        customer_notify: 1,
        notes: { user_id: userId, plan: planChoice, email: body.email || '' },
      }),
    });
  } catch (fetchErr) {
    console.error('[create-subscription] Razorpay fetch failed:', fetchErr);
    return new Response(
      JSON.stringify({ error: 'Could not reach the payment provider. Please try again.' }),
      { status: 502, headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  }

  const data = await createRes.json();
  if (!createRes.ok) {
    const razorpayDesc =
      data.error?.description ||
      (typeof data.error === 'string' ? data.error : null) ||
      'Payment provider error';

    console.error(
      `[create-subscription] Razorpay ${createRes.status}: ${razorpayDesc}`,
      `plan=${planId.slice(0, 12)}…`,
    );

    let userMsg: string;
    if (createRes.status === 401) {
      userMsg = 'Payment setup issue — our team has been notified. Please try again later or contact support.';
    } else if (createRes.status === 400 && razorpayDesc.toLowerCase().includes('plan')) {
      userMsg = 'Subscription plan is not available right now. Please contact support.';
    } else {
      userMsg = 'Could not start your subscription. Please try again or contact support.';
    }

    return new Response(
      JSON.stringify({ error: userMsg, admin_hint: `razorpay_status=${createRes.status}, description=${razorpayDesc}` }),
      { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({
      subscription_id: data.id,
      key_id: RAZORPAY_KEY_ID,
      plan: planChoice,
    }),
    { headers: { ...cors, 'Content-Type': 'application/json' } }
  );
});
