import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getSummaryForUser,
  getTransactionsByUserId,
  updateTransaction,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.post("/", createTransaction);

router.get("/:userId", getTransactionsByUserId);

router.delete("/:id", deleteTransaction);

router.put("/:id", updateTransaction);

router.get("/summary/:userId", getSummaryForUser);

export default router;
