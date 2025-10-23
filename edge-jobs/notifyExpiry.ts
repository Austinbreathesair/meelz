// Daily: find pantry items nearing expiry and trigger notifications
export async function run() {
  // In Supabase Edge Jobs, use SQL to find rows: expiry_date <= now() + 3 days
  // Insert into a notifications table or call a BFF route to send emails/push
  return { ok: true };
}

