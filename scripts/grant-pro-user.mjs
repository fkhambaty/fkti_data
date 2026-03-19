#!/usr/bin/env node
/**
 * One-off: Grant Pro to a user by auth user ID (e.g. after payment callback failed).
 * Usage: SUPABASE_SERVICE_ROLE_KEY=your_service_role_key node scripts/grant-pro-user.mjs <user_id>
 * Example: SUPABASE_SERVICE_ROLE_KEY=eyJ... node scripts/grant-pro-user.mjs c6971780-462d-488f-b8d5-97c544df5528
 */
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gfskxboxvzuwozknfulo.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const userId = process.argv[2] || 'c6971780-462d-488f-b8d5-97c544df5528';

if (!SERVICE_ROLE_KEY) {
  console.error('Set SUPABASE_SERVICE_ROLE_KEY in the environment (Supabase Dashboard → Project Settings → API → service_role secret).');
  process.exit(1);
}

const endDate = new Date();
endDate.setDate(endDate.getDate() + 7);

async function main() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=id,subscription_status,subscription_end_date`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('Fetch failed:', res.status, data);
    process.exit(1);
  }
  if (!data || data.length === 0) {
    console.log('No profile found for user', userId, '- inserting profile as Pro.');
    const ins = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        id: userId,
        subscription_status: 'pro',
        subscription_end_date: endDate.toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });
    if (!ins.ok) {
      const err = await ins.text();
      console.error('Insert failed:', ins.status, err);
      process.exit(1);
    }
    console.log('Profile created with Pro. subscription_end_date:', endDate.toISOString());
    return;
  }
  const row = data[0];
  const isPro = row.subscription_status === 'pro';
  const end = row.subscription_end_date ? new Date(row.subscription_end_date) : null;
  const active = isPro && end && end >= new Date();
  if (active) {
    console.log('User', userId, 'is already Pro (subscription_end_date:', row.subscription_end_date, '). No change.');
    return;
  }
  const patch = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
    method: 'PATCH',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subscription_status: 'pro',
      subscription_end_date: endDate.toISOString(),
      updated_at: new Date().toISOString(),
    }),
  });
  if (!patch.ok) {
    console.error('Update failed:', patch.status, await patch.text());
    process.exit(1);
  }
  console.log('User', userId, 'updated to Pro. subscription_end_date:', endDate.toISOString());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
