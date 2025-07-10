import express from "express";
import dotenv from "dotenv";
import { supabase } from "./config/db.js";
import { getSumForUser } from "./data/summary.js";
import { limiter } from "./middleware/limiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

async function connectToDB() {
  try {
    const { error } = await supabase.from("transactions").select("*").limit(1);
    if (error) throw error;

    console.log("✅ Connected to database successfully!");
  } catch (error) {
    console.log("❌ Error connecting to database:", error);
    process.exit(1); // status code 1 means failure, 0 means success
  }
}

// Middleware
app.use(express.json());

// Custom simple middleware
// app.use((req, res, next) => {
//   console.log(`🔍 Request received: ${req.method} ${req.url}`);
//   next();
// });

app.use("/api/", limiter); // apply to all /api routes

app.post("/api/transactions", async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || amount === undefined || !category || !user_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          title: title,
          amount: amount,
          category: category,
          user_id: user_id,
          created_at: new Date(),
        },
      ])
      .select();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return res.status(500).json({ error: "Failed to create transaction" });
    }

    res.status(201).json({ message: "Transaction created", data });
  } catch (error) {
    console.log("❌ Error creating transaction:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/transactions/:userId", async (req, res) => {
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
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isNaN(parseInt(id)) || !id) {
      return res
        .status(400)
        .json({ error: "Missing or invalid transaction ID" });
    }

    const { data, error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)
      .select(); // optional: return deleted record

    if (error) {
      console.error("❌ Supabase delete error:", error);
      return res
        .status(500)
        .json({ error: "Failed to delete the transaction" });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({
      message: "🗑️ Transaction deleted successfully",
      deleted: data,
    });
  } catch (error) {
    console.log("❌ Error deleting the transaction:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category } = req.body;

    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid transaction ID" });
    }
    if (!title || amount === undefined || !category) {
      return res
        .status(400)
        .json({ error: "All fields (title, amount, category) are required" });
    }

    const { data, error } = await supabase
      .from("transactions")
      .update({ title, amount, category })
      .eq("id", id)
      .select(); // optional: returns updated row(s)

    if (error) {
      console.error("❌ Supabase update error:", error);
      return res
        .status(500)
        .json({ error: "Failed to update the transaction" });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({
      message: "✅ Transaction updated successfully",
      updated: data[0],
    });
  } catch (error) {
    console.log("❌ Error updating the transaction:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/transactions/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || typeof userId !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid userId parameter" });
    }

    const sum = await getSumForUser(userId);

    if (sum === null) {
      return res
        .status(500)
        .json({ error: "Failed to calculate transaction summary" });
    }

    res.status(200).json({
      message: "✅ Summary retrieved successfully",
      userId,
      balance: sum[0],
      income: sum[1],
      expenses: sum[2],
    });
  } catch (error) {
    console.log("❌ Error getting the summary:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Server is alive!");
});

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
