import express from "express";
import { getSystemStats, getAllUsersAdmin } from "../controller/AdminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictToAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Apply protect AND restrictToAdmin to all routes in this file
router.use(protect, restrictToAdmin);

router.get("/stats", getSystemStats);
router.get("/users", getAllUsersAdmin);

export default router;
