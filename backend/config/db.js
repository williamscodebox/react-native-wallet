import { createClient } from "@supabase/supabase-js";

import dotenv from "dotenv";

dotenv.config();

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_URL
);
