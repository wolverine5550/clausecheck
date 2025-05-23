import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

/**
 * Creates a Supabase client instance for use in the browser.
 *
 * Uses environment variables for the Supabase URL and anon key.
 * This utility should be imported wherever you need to interact with Supabase from the client side.
 *
 * @returns {SupabaseClient} A configured Supabase client instance
 */
export const createClient = () =>
  createBrowserSupabaseClient(); 