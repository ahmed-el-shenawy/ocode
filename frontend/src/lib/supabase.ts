import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL environment variable. " +
      "Set it in .env.local or your deployment environment."
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. " +
      "Set it in .env.local or your deployment environment."
  );
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
