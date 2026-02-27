import express from "express";
import { changePassword, getProfile, login, register, updateProfile, verifyPassword } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile); // ✅ NOUVELLE ROUTE
router.post("/verify-password", protect, verifyPassword);
router.put("/change-password", protect, changePassword);
export default router;