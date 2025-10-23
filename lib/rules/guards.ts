import { createClient } from '@/lib/supabaseClient';

export async function ensureOwner(recordTable: string, recordId: string, ownerColumn = 'user_id') {
  const supabase = createClient();
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) return false;
  const { data } = await supabase.from(recordTable).select(ownerColumn).eq('id', recordId).maybeSingle();
  if (!data) return false;
  const rec = data as Record<string, unknown>;
  return String(rec[ownerColumn as string]) === user.id;
}
