import express from "express";
import AnswerTransactions from "../controller/AnswerTransactions.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/getTransaction", protect, AnswerTransactions);

export default router;