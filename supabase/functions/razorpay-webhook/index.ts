// Razorpay webhook: verify signature, update profiles, handle recurring charges.
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RAZORPAY_WEBHOOK_SECRET = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') || '';
const RAZORPAY_KEY_ID = (Deno.env.get('RAZORPAY_KEY_ID') || '').trim();
const RAZORPAY_KEY_SECRET = (Deno.env.get('RAZORPAY_KEY_SECRET') || '').trim();
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  const hex = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
  return hex === signature;
}

async function getPlanPeriod(planId: string): Promise<string> {
  if (!planId || !RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) return 'weekly';
  try {
    const basic = btoa(RAZORPAY_KEY_ID + ':' + RAZORPAY_KEY_SECRET);
    const res = await fetch('https://api.razorpay.com/v1/plans/' + planId, {
      headers: { Authorization: 'Basic ' + basic },
    });
    if (res.ok) {
      const data = await res.json();
      return data.period === 'monthly' ? 'monthly' : 'weekly';
    }
  } catch (_) {}
  return 'weekly';
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('OK', { status: 200 });
  }

  const signature = req.headers.get('X-Razorpay-Signature') || '';
  const rawBody = await req.text();

  if (!RAZORPAY_WEBHOOK_SECRET || !(await verifySignature(rawBody, signature, RAZORPAY_WEBHOOK_SECRET))) {
    return new Response('Invalid signature', { status: 400 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const event = payload.event || '';
  console.log('[razorpay-webhook] Event:', event);

  const subEntity = payload.payload?.subscription?.entity;
  const paymentEntity = payload.payload?.payment?.entity;
  const userId = paymentEntity?.notes?.user_id || subEntity?.notes?.user_id;

  if (!userId) {
    return new Response('OK', { status: 200 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const subId = subEntity?.id || null;

  let planType = subEntity?.notes?.plan || '';
  if (!planType && subEntity?.plan_id) {
    planType = await getPlanPeriod(subEntity.plan_id);
  }
  if (!planType) planType = 'weekly';

  const endDate = new Date();
  if (planType === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setDate(endDate.getDate() + 7);
  }
  const now = new Date().toISOString();

  if (event === 'subscription.cancelled' || event === 'subscription.halted' || event === 'subscription.completed') {
    const { error } = await supabase
      .from('profiles')
      .update({ subscription_status: 'free', updated_at: now })
      .eq('id', userId);
    if (error) console.error('[razorpay-webhook] Cancel update error:', error);
    else console.log('[razorpay-webhook] Subscription ended for user:', userId, event);
    return new Response('OK', { status: 200 });
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      subscription_status: 'pro',
      subscription_end_date: endDate.toISOString(),
      razorpay_subscription_id: subId,
      subscription_plan: planType,
      updated_at: now,
    }, { onConflict: 'id' });

  if (error) {
    console.error('[razorpay-webhook] Profile upsert error:', error);
    return new Response('DB error', { status: 500 });
  }

  console.log(`[razorpay-webhook] Pro extended: user=${userId} plan=${planType} until=${endDate.toISOString()}`);
  return new Response('OK', { status: 200 });
});
