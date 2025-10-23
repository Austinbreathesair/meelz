import { createClient } from '@/lib/supabaseClient';

export async function ensureOwner(
  recordTable: string,
  recordId: string,
  ownerColumn = 'user_id'
): Promise<boolean> {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) return false;

  // Loosen typing here to avoid Postgrest builder generics friction during typecheck.
  const qb: any = (supabase as any)
    .from(recordTable as any)
    .select(ownerColumn)
    .eq('id', recordId)
    .limit(1);

  const { data, error }: { data?: any; error?: any } = await qb.maybeSingle();
  if (error || !data) return false;

  const value = (data as Record<string, unknown>)[ownerColumn];
  return typeof value === 'string' && value === user.id;
}
