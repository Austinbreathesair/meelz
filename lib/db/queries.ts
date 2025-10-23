import { createClient } from '@/lib/supabaseClient';

export async function getUserPantry(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from('pantry_item').select('*').eq('user_id', userId);
  if (error) throw error;
  return data;
}

