import express from "express";
import { register, login, getuserbyid, getusers } from "../controller/Usercontroller.js";
import validateRequest from "../middleware/validateRequest.js";
import { protect } from "../middleware/authMiddleware.js";
import { registerSchema, loginSchema } from "../validation/userValidation.js";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.get("/getUser", protect, getuserbyid);
router.get("/getUsers", protect, getusers);

router.get("/check", protect, (req, res) => {
  res.json({ loggedIn: true, data: { userid: req.user._id } });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.json({ success: true, message: "Logged out successfully" });
});

export default router;