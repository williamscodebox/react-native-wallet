import { createClient } from "@supabase/supabase-js";

import dotenv from "dotenv";

dotenv.config();

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_KEY
);

export async function connectToDB() {
  try {
    const { error } = await supabase.from("transactions").select("*").limit(1);
    if (error) throw error;

    console.log("✅ Connected to database successfully!");
  } catch (error) {
    console.log("❌ Error connecting to database:", error);
    process.exit(1); // status code 1 means failure, 0 means success
  }
}
