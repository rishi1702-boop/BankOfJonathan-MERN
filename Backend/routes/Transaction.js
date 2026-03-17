import express from "express";
import { Sender, RequestMoney, ApproveRequest, DeclineRequest } from "../controller/Transactions.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/send', protect, Sender);
router.post('/request', protect, RequestMoney);
router.post('/approve', protect, ApproveRequest);
router.post('/decline', protect, DeclineRequest);

export default router;