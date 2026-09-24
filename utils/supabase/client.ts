import { createClient } from '@supabase/supabase-js';
import { projectId, publicSupabaseKey } from './info';

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicSupabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  },
);
