/**
 * Send renewal reminder emails to subscribers whose subscription expires within 24 hours.
 * Intended to be called daily via cron (Supabase pg_cron or external scheduler).
 * Requires: RESEND_API_KEY, ADMIN_PASSCODE (for manual trigger auth).
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

function getSecret(name: string): string {
  const v = Deno.env.get(name);
  return (typeof v === 'string' ? v.trim() : '') || '';
}

async function sendReminderEmail(email: string, plan: string, expiresAt: string): Promise<boolean> {
  const RESEND_API_KEY = getSecret('RESEND_API_KEY');
  if (!RESEND_API_KEY || !email) return false;

  const planLabel = plan === 'monthly' ? '₹349/month' : '₹99/week';
  const expiryDate = new Date(expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Data For Dummies <noreply@datafordummies.in>',
        to: [email],
        subject: 'Your Data For Dummies Pro renews tomorrow',
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1d1d1f;">
            <h1 style="font-size:24px;margin:0 0 16px;">Heads up — your Pro renews tomorrow! 🔄</h1>
            <p style="font-size:15px;color:#374151;line-height:1.7;">
              Your <strong>Data For Dummies Pro</strong> subscription (${planLabel}) will automatically renew on <strong>${expiryDate}</strong>.
            </p>
            <div style="background:#fffbeb;border:1px solid #fbbf24;border-radius:12px;padding:16px;margin:20px 0;">
              <p style="margin:0;font-size:14px;color:#92400e;">
                <strong>No action needed</strong> — your payment method will be charged automatically and your Pro access continues uninterrupted.
              </p>
            </div>
            <p style="font-size:15px;color:#374151;line-height:1.7;">
              Want to make changes? You can manage your subscription from your <a href="https://datafordummies.in/auth/profile.html" style="color:#4f46e5;font-weight:600;">profile page</a>.
            </p>
            <p style="font-size:13px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:16px;margin-top:32px;">
              Questions? Email us at <a href="mailto:fktiindia@gmail.com" style="color:#6366f1;">fktiindia@gmail.com</a>
            </p>
          </div>`,
      }),
    });
    return res.ok;
  } catch (e) {
    console.error('[renewal-reminder] Email send failed:', e);
    return false;
  }
}

Deno.serve(async (req) => {
  const ADMIN_PASSCODE = getSecret('ADMIN_PASSCODE');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      if (ADMIN_PASSCODE && body.passcode !== ADMIN_PASSCODE) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Missing config' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const todayIso = now.toISOString();
  const tomorrowIso = tomorrow.toISOString();

  const { data: expiring, error } = await sb
    .from('profiles')
    .select('id,email,subscription_plan,subscription_end_date')
    .eq('subscription_status', 'pro')
    .gte('subscription_end_date', todayIso)
    .lte('subscription_end_date', tomorrowIso);

  if (error) {
    console.error('[renewal-reminder] Query error:', error);
    return new Response(JSON.stringify({ error: 'DB error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let sent = 0;
  let failed = 0;
  const results: any[] = [];

  for (const profile of (expiring || [])) {
    let email = profile.email;

    if (!email) {
      try {
        const { data: { user } } = await sb.auth.admin.getUserById(profile.id);
        email = user?.email || '';
      } catch (_) {}
    }

    if (!email) {
      results.push({ id: profile.id, status: 'skipped', reason: 'no email' });
      continue;
    }

    const ok = await sendReminderEmail(email, profile.subscription_plan || 'weekly', profile.subscription_end_date);
    if (ok) {
      sent++;
      results.push({ id: profile.id, email, status: 'sent' });
    } else {
      failed++;
      results.push({ id: profile.id, email, status: 'failed' });
    }
  }

  console.log(`[renewal-reminder] Processed ${(expiring || []).length} expiring. Sent: ${sent}, Failed: ${failed}`);

  return new Response(
    JSON.stringify({ total: (expiring || []).length, sent, failed, results }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
