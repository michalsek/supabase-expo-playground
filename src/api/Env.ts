function requireEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const Env = {
  SUPABASE_URL: requireEnv(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    "EXPO_PUBLIC_SUPABASE_URL",
  ),
  SUPABASE_PUBLIC_KEY: requireEnv(
    process.env.EXPO_PUBLIC_SUPABASE_PUBLIC_KEY,
    "EXPO_PUBLIC_SUPABASE_PUBLIC_KEY",
  ),
  SUPABASE_PRIVATE_KEY: process.env.EXPO_PUBLIC_SUPABASE_PRIVATE_KEY,
};

export default Env;
