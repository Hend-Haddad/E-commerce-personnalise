// backend/src/routes/orderRoutes.js
import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes de commandes nécessitent une authentification
router.use(protect);  // Applique protect à toutes les routes ci-dessous

// Routes
router.post('/', createOrder);              // Créer une commande
router.get('/', getUserOrders);              // Liste des commandes
router.get('/:id', getOrderById);            // Détail d'une commande
router.put('/:id/cancel', cancelOrder);      // Annuler une commande

export default router;