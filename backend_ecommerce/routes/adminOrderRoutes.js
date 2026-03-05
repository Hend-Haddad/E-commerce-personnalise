// backend/src/routes/adminOrderRoutes.js
import express from 'express';
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats
} from '../controllers/adminOrderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes nécessitent authentification admin
router.use(protect);
router.use(authorize('admin'));

// Routes principales
router.get('/', getAllOrders);
router.get('/stats', getOrderStats);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

export default router;