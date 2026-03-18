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

  const RAZORPAY_KEY_ID = getSecret('RAZORPAY_KEY_ID');
  const RAZORPAY_KEY_SECRET = getSecret('RAZORPAY_KEY_SECRET');
  const RAZORPAY_PLAN_ID = getSecret('RAZORPAY_PLAN_ID');

  const missing: string[] = [];
  if (!RAZORPAY_KEY_ID) missing.push('RAZORPAY_KEY_ID');
  if (!RAZORPAY_KEY_SECRET) missing.push('RAZORPAY_KEY_SECRET');
  if (!RAZORPAY_PLAN_ID) missing.push('RAZORPAY_PLAN_ID');
  if (missing.length > 0) {
    console.error('[create-subscription] Missing secrets:', missing.join(', '));
    return new Response(
      JSON.stringify({
        error: 'Payment is temporarily unavailable. Please try again later or contact support.',
        admin_hint: `Missing secret(s): ${missing.join(', ')}`,
      }),
      {
        status: 503,
        headers: { ...cors, 'Content-Type': 'application/json' },
      }
    );
  }

  const configErrors: string[] = [];
  if (!RAZORPAY_KEY_ID.startsWith('rzp_live_') && !RAZORPAY_KEY_ID.startsWith('rzp_test_')) {
    configErrors.push('RAZORPAY_KEY_ID must start with rzp_live_ or rzp_test_');
  }
  if (!RAZORPAY_PLAN_ID.startsWith('plan_')) {
    configErrors.push('RAZORPAY_PLAN_ID must start with plan_ (current value looks like a variable name, not a plan ID)');
  }
  if (RAZORPAY_KEY_SECRET.startsWith('rzp_') || RAZORPAY_KEY_SECRET === RAZORPAY_KEY_ID) {
    configErrors.push('RAZORPAY_KEY_SECRET looks like a Key ID — it should be the secret, not the key');
  }
  if (configErrors.length > 0) {
    console.error('[create-subscription] Config errors:', configErrors.join('; '));
    return new Response(
      JSON.stringify({
        error: 'Payment is temporarily unavailable. Please try again later or contact support.',
        admin_hint: configErrors.join('; '),
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
  let createRes: Response;
  try {
    createRes = await fetch('https://api.razorpay.com/v1/subscriptions', {
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
      `key=${RAZORPAY_KEY_ID.slice(0, 12)}…`,
      `plan=${RAZORPAY_PLAN_ID.slice(0, 12)}…`,
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
      JSON.stringify({
        error: userMsg,
        admin_hint: `razorpay_status=${createRes.status}, description=${razorpayDesc}`,
      }),
      {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({ subscription_id: data.id }),
    { headers: { ...cors, 'Content-Type': 'application/json' } }
  );
});
