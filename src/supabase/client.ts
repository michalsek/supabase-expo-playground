import { createClient } from "@supabase/supabase-js";

import Env from "../api/Env";
import { supabaseStorage } from "../auth/storage";

export const supabase = createClient(Env.SUPABASE_URL, Env.SUPABASE_PUBLIC_KEY, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: false,
    persistSession: true,
    storage: supabaseStorage,
  },
});

export default supabase;
