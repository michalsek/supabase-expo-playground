import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

import Env from "../api/Env";
import { supabaseStorage } from "../auth/storage";
import type { Database } from "../database/types";

export const supabase = createClient<Database>(
  Env.SUPABASE_URL,
  Env.SUPABASE_PUBLIC_KEY,
  {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
      storage: supabaseStorage,
    },
    realtime: {
      // Workers are not supported on mobile
      worker: Platform.OS === "web",
    },
  },
);

export default supabase;
