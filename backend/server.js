import express from "express";
import dotenv from "dotenv";
import { supabase } from "./config/db.js";

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

app.get("/", (req, res) => {
  res.send("✅ Server is alive!");
});

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
