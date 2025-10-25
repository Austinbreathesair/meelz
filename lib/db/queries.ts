import { createServerSupabaseClient } from '@/lib/supabaseServer';

export async function getUserPantry(userId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from('pantry_item').select('*').eq('user_id', userId);
  if (error) throw error;
  return data;
}
