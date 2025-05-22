'use client';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRef } from 'react';

/**
 * ClientOnlySupabaseProvider
 * Wraps children with Supabase SessionContextProvider using a client-side Supabase client.
 * Use this to avoid marking the root layout as a client component.
 */
export default function ClientOnlySupabaseProvider({ children }: { children: React.ReactNode }) {
  // useRef ensures the client is not recreated on every render
  const supabaseClient = useRef(createClientComponentClient()).current;
  return (
    <SessionContextProvider supabaseClient={supabaseClient}>{children}</SessionContextProvider>
  );
}
