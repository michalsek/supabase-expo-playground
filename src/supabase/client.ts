import { createClient } from "@supabase/supabase-js";

import Env from "../api/Env";

const client = createClient(Env.SUPABASE_URL, Env.SUPABASE_PUBLIC_KEY);

export default client;
