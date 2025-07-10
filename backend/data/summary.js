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

    const income = data
      .filter((row) => row.amount > 0)
      .reduce((total, row) => total + (row.amount || 0), 0);

    const expenses = data
      .filter((row) => row.amount < 0)
      .reduce((total, row) => total + (row.amount || 0), 0);

    console.log(`🧮 Balance for user ${userId}: ${sum}`);
    console.log(`🧮 Income amount for user ${userId}: ${income}`);
    console.log(`🧮 Expense amount for user ${userId}: ${expenses}`);
    return [sum, income, expenses];
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return null;
  }
}
