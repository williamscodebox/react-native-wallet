import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./config/db.js";
import { limiter } from "./middleware/limiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Custom simple middleware
// app.use((req, res, next) => {
//   console.log(`🔍 Request received: ${req.method} ${req.url}`);
//   next();
// });

app.use("/api/", limiter); // apply to all /api routes
app.use("/api/transactions/", transactionsRoute);

app.get("/", (req, res) => {
  res.send("✅ Server is alive!");
});

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
