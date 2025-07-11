async function getTransactionsByUserId() {
  try {
    const { userId } = req.params;

    if (!userId || typeof userId !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid userId parameter" });
    }

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Supabase query error:", error);
      return res.status(500).json({ error: "Failed to fetch transactions" });
    }

    res.status(200).json({ transactions: data });
  } catch (error) {
    console.log("❌ Error getting the transactions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export { getTransactionsByUserId };
