// Razorpay webhook: verify signature and update profiles.subscription_status to 'pro'.
// Set secret: RAZORPAY_WEBHOOK_SECRET (from Razorpay Dashboard > Webhooks)
// Subscribe to: subscription.charged, subscription.activated, payment.captured (as needed)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RAZORPAY_WEBHOOK_SECRET = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
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
    new TextEncoder().encode(body)
  );
  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hex === signature;
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

  let payload: {
    event?: string;
    payload?: {
      subscription?: { entity?: { id?: string; notes?: Record<string, string> } };
      payment?: { entity?: { notes?: { user_id?: string } } };
    };
  };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const subEntity = payload.payload?.subscription?.entity;
  const paymentEntity = payload.payload?.payment?.entity;
  const userId =
    paymentEntity?.notes?.user_id ||
    subEntity?.notes?.user_id;

  if (!userId) {
    return new Response('OK', { status: 200 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const subId = payload.payload?.subscription?.entity?.id || null;

  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);

  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'pro',
      subscription_end_date: endDate.toISOString(),
      razorpay_subscription_id: subId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Profile update error:', error);
    return new Response('DB error', { status: 500 });
  }

  return new Response('OK', { status: 200 });
});
