/**
 * Send "Do not miss out on Pro bro!" reminder to subscribers whose subscription ends tomorrow.
 * Call daily via cron (e.g. 9:00 AM) so users get the email one day before expiry.
 * Requires: RESEND_API_KEY. Optional: ADMIN_PASSCODE for manual trigger auth.
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
        subject: 'Do not miss out on Pro bro! — your subscription renews tomorrow',
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1d1d1f;">
            <h1 style="font-size:24px;margin:0 0 16px;">Do not miss out on Pro bro! 🔔</h1>
            <p style="font-size:15px;color:#374151;line-height:1.7;">
              Your <strong>Pro</strong> subscription (${planLabel}) will automatically renew on <strong>${expiryDate}</strong>. You're all set — no action needed.
            </p>
            <div style="background:linear-gradient(135deg,#eef2ff,#e0e7ff);border:1px solid rgba(99,102,241,0.3);border-radius:12px;padding:16px;margin:20px 0;">
              <p style="margin:0;font-size:14px;color:#4338ca;">
                <strong>Pro bro benefits:</strong> All courses, projects, certifications, and datasets. Your payment method will be charged automatically so you don't lose access.
              </p>
            </div>
            <p style="font-size:15px;color:#374151;line-height:1.7;">
              Want to change payment or cancel? <a href="https://datafordummies.in/auth/profile.html" style="color:#4f46e5;font-weight:600;">Manage subscription</a>
            </p>
            <p style="font-size:13px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:16px;margin-top:32px;">
              Questions? <a href="mailto:fktiindia@gmail.com" style="color:#6366f1;">fktiindia@gmail.com</a>
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
      const body = (await req.json().catch(() => ({}))) as { passcode?: string };
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
  // GET allowed for cron (no body). If ADMIN_PASSCODE is set, cron can use POST with {"passcode":"..."}.

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Missing config' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Subscriptions expiring *tomorrow* (next calendar day) — email = "one day before"
  const now = new Date();
  const tomorrowStart = new Date(now);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  tomorrowStart.setHours(0, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setHours(23, 59, 59, 999);
  const tomorrowStartIso = tomorrowStart.toISOString();
  const tomorrowEndIso = tomorrowEnd.toISOString();

  const { data: expiring, error } = await sb
    .from('profiles')
    .select('id,email,subscription_plan,subscription_end_date')
    .eq('subscription_status', 'pro')
    .gte('subscription_end_date', tomorrowStartIso)
    .lte('subscription_end_date', tomorrowEndIso);

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
