/**
 * Razorpay payment callback: accepts POST after successful subscription payment,
 * verifies signature, updates profiles to Pro, sends welcome email, redirects user.
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
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sendWelcomeEmail(email: string, plan: string): Promise<void> {
  const RESEND_API_KEY = getSecret('RESEND_API_KEY');
  if (!RESEND_API_KEY || !email) return;

  const planLabel = plan === 'monthly' ? '₹349/month' : '₹99/week';
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Data For Dummies <noreply@datafordummies.in>',
        to: [email],
        subject: 'Welcome to Data For Dummies Pro! 🎉',
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1d1d1f;">
            <div style="text-align:center;margin-bottom:32px;">
              <h1 style="font-size:28px;margin:0 0 8px;">Welcome to Pro! 🚀</h1>
              <p style="color:#6e6e73;font-size:16px;margin:0;">You're now a Data For Dummies Pro member.</p>
            </div>
            <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:16px;padding:24px;color:#fff;text-align:center;margin-bottom:24px;">
              <p style="font-size:14px;margin:0 0 4px;opacity:0.9;">Your Plan</p>
              <p style="font-size:24px;font-weight:800;margin:0;">${planLabel} (auto-renewing)</p>
            </div>
            <h2 style="font-size:18px;margin:24px 0 12px;">What you now have access to:</h2>
            <ul style="font-size:15px;line-height:1.8;color:#374151;">
              <li>All courses — Python, SQL, Airflow, DBT, Data Science, LLM, and more</li>
              <li>Real-world projects and code walkthroughs</li>
              <li>Dataset downloads and pipeline exports</li>
              <li>Assignments and certifications</li>
              <li>Pro access on web and Android app</li>
            </ul>
            <div style="text-align:center;margin:32px 0;">
              <a href="https://datafordummies.in/learning-path.html" style="display:inline-block;padding:14px 32px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:12px;font-weight:700;font-size:16px;">Start Learning Now</a>
            </div>
            <p style="font-size:13px;color:#9ca3af;text-align:center;border-top:1px solid #e5e7eb;padding-top:16px;margin-top:32px;">
              Your subscription renews automatically. You can manage it from your profile page.<br/>
              Questions? Email us at <a href="mailto:fktiindia@gmail.com" style="color:#6366f1;">fktiindia@gmail.com</a>
            </p>
          </div>`,
      }),
    });
    console.log('[razorpay-callback] Welcome email sent to:', email);
  } catch (e) {
    console.error('[razorpay-callback] Welcome email failed:', e);
  }
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
  const RAZORPAY_KEY_ID = getSecret('RAZORPAY_KEY_ID');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

  if (!RAZORPAY_KEY_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[razorpay-callback] Missing secrets');
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
    console.error('[razorpay-callback] Missing fields');
    return Response.redirect(redirectBase + '/auth/profile.html?subscription=success', 302);
  }

  const expectedSig = await hmacSha256Hex(paymentId + '|' + subscriptionId, RAZORPAY_KEY_SECRET);
  if (expectedSig !== signature) {
    console.error('[razorpay-callback] Invalid signature');
    return Response.redirect(redirectBase + '/auth/profile.html?error=invalid_signature', 302);
  }

  let userId: string | null = null;
  let planType = 'weekly';
  let userEmail = '';

  if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
    try {
      const basic = btoa(RAZORPAY_KEY_ID + ':' + RAZORPAY_KEY_SECRET);
      const subRes = await fetch('https://api.razorpay.com/v1/subscriptions/' + subscriptionId, {
        headers: { Authorization: 'Basic ' + basic },
      });
      if (subRes.ok) {
        const subData = await subRes.json();
        userId = subData.notes?.user_id || null;
        planType = subData.notes?.plan || (subData.plan_id?.includes('month') ? 'monthly' : 'weekly');
        userEmail = subData.notes?.email || '';

        const planPeriod = subData.plan_id ? '' : '';
        if (!planType || planType === 'weekly') {
          try {
            const planRes = await fetch('https://api.razorpay.com/v1/plans/' + subData.plan_id, {
              headers: { Authorization: 'Basic ' + basic },
            });
            if (planRes.ok) {
              const planData = await planRes.json();
              if (planData.period === 'monthly') planType = 'monthly';
            }
          } catch (_) {}
        }
      }
    } catch (e) {
      console.error('[razorpay-callback] Razorpay API error:', e);
    }
  }

  if (userId) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const endDate = new Date();
    if (planType === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setDate(endDate.getDate() + 7);
    }
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        subscription_status: 'pro',
        subscription_end_date: endDate.toISOString(),
        razorpay_subscription_id: subscriptionId,
        subscription_plan: planType,
        updated_at: now,
      }, { onConflict: 'id' });

    if (error) {
      console.error('[razorpay-callback] Profile upsert error:', error);
    } else {
      console.log(`[razorpay-callback] Pro activated: user=${userId} plan=${planType}`);

      if (!userEmail) {
        try {
          const { data: profile } = await supabase.from('profiles').select('email').eq('id', userId).single();
          userEmail = profile?.email || '';
        } catch (_) {}
      }
      if (!userEmail) {
        try {
          const { data: { user } } = await supabase.auth.admin.getUserById(userId);
          userEmail = user?.email || '';
        } catch (_) {}
      }

      await sendWelcomeEmail(userEmail, planType);
    }
  }

  return Response.redirect(redirectBase + '/auth/profile.html?subscription=success', 302);
});
