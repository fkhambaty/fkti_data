/**
 * Send Email Auth Hook — sends all Supabase Auth emails (signup confirmation, password
 * reset, etc.) via Resend. Configure this as the "Send Email" hook in Dashboard > Auth > Hooks.
 *
 * Requires: RESEND_API_KEY, SEND_EMAIL_HOOK_SECRET. Deploy with --no-verify-jwt.
 */
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';

function getSecret(name: string): string {
  const v = Deno.env.get(name);
  return (typeof v === 'string' ? v.trim() : '') || '';
}

const FROM = 'Data For Dummies <noreply@datafordummies.in>';
const SITE_NAME = 'Data For Dummies';

function buildVerifyUrl(
  supabaseUrl: string,
  tokenHash: string,
  type: string,
  redirectTo: string
): string {
  const base = supabaseUrl.replace(/\/$/, '');
  const url = `${base}/auth/v1/verify?token=${encodeURIComponent(tokenHash)}&type=${encodeURIComponent(type)}`;
  return redirectTo ? `${url}&redirect_to=${encodeURIComponent(redirectTo)}` : url;
}

async function sendResend(
  apiKey: string,
  to: string,
  subject: string,
  html: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!res.ok) {
      return { ok: false, error: data.message || res.statusText };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: { message: 'Method not allowed' } }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const RESEND_API_KEY = getSecret('RESEND_API_KEY');
  const SEND_EMAIL_HOOK_SECRET = getSecret('SEND_EMAIL_HOOK_SECRET');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';

  if (!RESEND_API_KEY || !SEND_EMAIL_HOOK_SECRET || !SUPABASE_URL) {
    console.error('[send-email] Missing RESEND_API_KEY, SEND_EMAIL_HOOK_SECRET, or SUPABASE_URL');
    return new Response(
      JSON.stringify({ error: { message: 'Server configuration error', http_code: 500 } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers.entries());
  const hookSecret = SEND_EMAIL_HOOK_SECRET.replace(/^v1,whsec_/, '');

  let user: { email?: string };
  let email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
    token_new?: string;
    token_hash_new?: string;
  };

  try {
    const wh = new Webhook(hookSecret);
    const parsed = wh.verify(payload, headers) as { user: typeof user; email_data: typeof email_data };
    user = parsed.user;
    email_data = parsed.email_data;
  } catch (e) {
    console.error('[send-email] Webhook verification failed:', e);
    return new Response(
      JSON.stringify({ error: { message: 'Invalid webhook signature', http_code: 401 } }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const email = user?.email;
  if (!email) {
    return new Response(JSON.stringify({ error: { message: 'No email in payload' } }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' } },
    );
  }

  const { token_hash, redirect_to, email_action_type, site_url } = email_data;
  const confirmUrl = buildVerifyUrl(SUPABASE_URL, token_hash, email_action_type, redirect_to || '');

  const actionType = email_action_type || 'signup';
  let subject: string;
  let html: string;

  if (actionType === 'signup') {
    subject = `Welcome to ${SITE_NAME}! — confirm your email`;
    html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1d1d1f;">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="font-size:26px;margin:0 0 8px;">Welcome! 👋</h1>
          <p style="color:#6e6e73;font-size:16px;margin:0;">You signed up for ${SITE_NAME}. Confirm your email to start learning.</p>
        </div>
        <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:16px;padding:24px;color:#fff;text-align:center;margin-bottom:24px;">
          <p style="font-size:14px;margin:0 0 12px;opacity:0.95;">Click the button below to verify your email:</p>
          <a href="${confirmUrl}" style="display:inline-block;padding:14px 32px;background:#fff;color:#6366f1;text-decoration:none;border-radius:12px;font-weight:700;font-size:16px;">Confirm my email</a>
        </div>
        <p style="font-size:14px;color:#64748b;line-height:1.6;">Or copy and paste this link into your browser:</p>
        <p style="font-size:13px;word-break:break-all;color:#6366f1;"><a href="${confirmUrl}" style="color:#6366f1;">${confirmUrl}</a></p>
        <p style="font-size:13px;color:#9ca3af;margin-top:24px;">If you didn't create an account, you can ignore this email.</p>
        <p style="font-size:13px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:16px;margin-top:32px;">
          Questions? <a href="mailto:fktiindia@gmail.com" style="color:#6366f1;">fktiindia@gmail.com</a>
        </p>
      </div>`;
  } else if (actionType === 'recovery') {
    subject = `Reset your ${SITE_NAME} password`;
    html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1d1d1f;">
        <h1 style="font-size:24px;margin:0 0 16px;">Reset your password</h1>
        <p style="font-size:15px;color:#374151;line-height:1.7;">Click the button below to set a new password:</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${confirmUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;text-decoration:none;border-radius:12px;font-weight:700;font-size:16px;">Reset password</a>
        </div>
        <p style="font-size:13px;color:#64748b;">Or open this link: <a href="${confirmUrl}" style="color:#6366f1;">${confirmUrl}</a></p>
        <p style="font-size:13px;color:#9ca3af;margin-top:24px;">If you didn't request this, you can ignore this email.</p>
        <p style="font-size:13px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:16px;margin-top:32px;">
          Questions? <a href="mailto:fktiindia@gmail.com" style="color:#6366f1;">fktiindia@gmail.com</a>
        </p>
      </div>`;
  } else {
    subject = `Action required — ${SITE_NAME}`;
    html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1d1d1f;">
        <h1 style="font-size:24px;margin:0 0 16px;">Action required</h1>
        <p style="font-size:15px;color:#374151;line-height:1.7;">Click the link below to continue:</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${confirmUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;text-decoration:none;border-radius:12px;font-weight:700;font-size:16px;">Continue</a>
        </div>
        <p style="font-size:13px;color:#64748b;"><a href="${confirmUrl}" style="color:#6366f1;">${confirmUrl}</a></p>
        <p style="font-size:13px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:16px;margin-top:32px;">
          Questions? <a href="mailto:fktiindia@gmail.com" style="color:#6366f1;">fktiindia@gmail.com</a>
        </p>
      </div>`;
  }

  const result = await sendResend(RESEND_API_KEY, email, subject, html);
  if (!result.ok) {
    console.error('[send-email] Resend failed:', result.error);
    return new Response(
      JSON.stringify({
        error: {
          message: result.error || 'Failed to send email',
          http_code: 503,
        },
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
