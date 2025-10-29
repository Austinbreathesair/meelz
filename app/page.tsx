import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

export default async function Index() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  
  // If user is authenticated, go to pantry
  if (data.user) {
    redirect('/pantry');
  }
  
  // Otherwise, show landing page
  redirect('/landing');
}
