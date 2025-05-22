import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from "next/headers";

export const createClient = async () => {
  // Use cookies for session context
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
};
