#!/usr/bin/env bash
# Test the "Do not miss out on Pro bro!" renewal reminder.
# Usage:
#   ./scripts/test-renewal-reminder.sh
#   ADMIN_PASSCODE=secret ./scripts/test-renewal-reminder.sh
#
# Set FUNCTION_URL to your deployed send-renewal-reminders URL, e.g.:
#   https://gfskxboxvzuwozknfulo.supabase.co/functions/v1/send-renewal-reminders

FUNCTION_URL="${FUNCTION_URL:-https://gfskxboxvzuwozknfulo.supabase.co/functions/v1/send-renewal-reminders}"

if [ -n "$ADMIN_PASSCODE" ]; then
  echo "Calling renewal reminder (POST with passcode)..."
  curl -s -X POST "$FUNCTION_URL" \
    -H "Content-Type: application/json" \
    -d "{\"passcode\":\"$ADMIN_PASSCODE\"}" | jq .
else
  echo "Calling renewal reminder (GET, no auth)..."
  curl -s "$FUNCTION_URL" | jq .
fi
