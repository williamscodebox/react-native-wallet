import express from "express";
import dotenv from "dotenv";
import { supabase } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

async function connectToDB() {
  try {
    await supabase;

    console.log("✅ Connected to database successfully!");
  } catch (error) {
    console.log("❌ Error connecting to database:", error);
    process.exit(1); // status code 1 means failure, 0 means success
  }
}

app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Server is alive!");
});

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
