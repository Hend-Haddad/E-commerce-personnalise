// backend/src/routes/categoryRoutes.js
import express from "express";
import upload, { uploadSingle, handleUploadError } from "../middleware/upload.js";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  permanentDeleteCategory
} from "../controllers/categoryController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Routes publiques
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Routes admin uniquement - avec upload d'image
router.post(
  "/", 
  protect, 
  authorize("admin"), 
  uploadSingle,
  handleUploadError,
  createCategory
);

router.put(
  "/:id", 
  protect, 
  authorize("admin"), 
  uploadSingle,
  handleUploadError,
  updateCategory
);

// ✅ DELETE route (soft delete)
router.delete("/:id", protect, authorize("admin"), deleteCategory);

// ✅ Permanent delete route
router.delete("/:id/permanent", protect, authorize("admin"), permanentDeleteCategory);

export default router;