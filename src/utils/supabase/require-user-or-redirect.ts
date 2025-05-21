import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

/**
 * Checks for an authenticated user on the server. If not authenticated, redirects to /sign-in.
 * Usage: Call at the top of any protected server component/page.
 * @returns The authenticated user object (if present)
 */
export async function requireUserOrRedirect() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/sign-in');
  }
  return user;
} 