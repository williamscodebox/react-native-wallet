import { supabase } from "../config/db.js";

export async function getSumForUser(userId) {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", userId);

    if (error) {
      console.error("❌ Error fetching data:", error);
      return null;
    }

    const sum = data.reduce((total, row) => total + (row.amount || 0), 0);

    console.log(`🧮 Sum of amount for user ${userId}: ${sum}`);
    return sum;
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return null;
  }
}
