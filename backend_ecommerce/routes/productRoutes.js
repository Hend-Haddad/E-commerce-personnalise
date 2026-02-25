// backend/src/routes/productRoutes.js
import express from "express";
import { uploadMultiple } from "../middleware/upload.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  reactivateProduct,
  permanentDeleteProduct,
  updateStock
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Routes publiques
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Routes admin uniquement - avec upload multiple d'images
router.post("/", protect, authorize("admin"), uploadMultiple, createProduct);
router.put("/:id", protect, authorize("admin"), uploadMultiple, updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);
router.put("/:id/reactivate", protect, authorize("admin"), reactivateProduct);
router.delete("/:id/permanent", protect, authorize("admin"), permanentDeleteProduct);
router.put("/:id/stock", protect, authorize("admin"), updateStock);

export default router;