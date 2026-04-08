import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Admin client with service role key for server-side operations
// This bypasses RLS and should only be used in API routes
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
