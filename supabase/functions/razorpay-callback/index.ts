/**
 * Razorpay payment callback: accepts POST after successful subscription payment,
 * verifies signature, updates profiles to Pro, redirects user to profile page.
 * Secrets: RAZORPAY_KEY_SECRET. SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY are auto-injected.
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

function getSecret(name: string): string {
  const v = Deno.env.get(name);
  return (typeof v === 'string' ? v.trim() : '') || '';
}

async function hmacSha256Hex(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(message)
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

serve(async (req) => {
  const url = new URL(req.url);
  const redirectBase = url.searchParams.get('redirect') || 'https://datafordummies.in';

  if (req.method === 'GET') {
    return Response.redirect(redirectBase + '/auth/profile.html?subscription=success', 302);
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const RAZORPAY_KEY_SECRET = getSecret('RAZORPAY_KEY_SECRET');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

  if (!RAZORPAY_KEY_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[razorpay-callback] Missing secrets or Supabase env');
    return Response.redirect(redirectBase + '/auth/profile.html?error=callback_config', 302);
  }

  let paymentId = '';
  let subscriptionId = '';
  let signature = '';

  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const body = await req.json();
    paymentId = body.razorpay_payment_id || '';
    subscriptionId = body.razorpay_subscription_id || body.razorpay_order_id || '';
    signature = body.razorpay_signature || '';
  } else {
    const text = await req.text();
    const params = new URLSearchParams(text);
    paymentId = params.get('razorpay_payment_id') || '';
    subscriptionId = params.get('razorpay_subscription_id') || params.get('razorpay_order_id') || '';
    signature = params.get('razorpay_signature') || '';
  }

  if (!paymentId || !subscriptionId || !signature) {
    console.error('[razorpay-callback] Missing payment_id, subscription_id or signature');
    return Response.redirect(redirectBase + '/auth/profile.html?subscription=success', 302);
  }

  const expectedSig = await hmacSha256Hex(paymentId + '|' + subscriptionId, RAZORPAY_KEY_SECRET);
  if (expectedSig !== signature) {
    console.error('[razorpay-callback] Invalid signature');
    return Response.redirect(redirectBase + '/auth/profile.html?error=invalid_signature', 302);
  }

  const RAZORPAY_KEY_ID = getSecret('RAZORPAY_KEY_ID');
  let userId: string | null = null;

  if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
    try {
      const basic = btoa(RAZORPAY_KEY_ID + ':' + RAZORPAY_KEY_SECRET);
      const subRes = await fetch('https://api.razorpay.com/v1/subscriptions/' + subscriptionId, {
        headers: { Authorization: 'Basic ' + basic },
      });
      if (subRes.ok) {
        const subData = await subRes.json();
        userId = subData.notes?.user_id || null;
      }
    } catch (e) {
      console.error('[razorpay-callback] Razorpay API error:', e);
    }
  }

  if (userId) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'pro',
        subscription_end_date: endDate.toISOString(),
        razorpay_subscription_id: subscriptionId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
    if (error) {
      console.error('[razorpay-callback] Profile update error:', error);
    }
  }

  return Response.redirect(redirectBase + '/auth/profile.html?subscription=success', 302);
});
