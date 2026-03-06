// backend/src/routes/adminClientRoutes.js
import express from 'express';
import {
  getAllClients,
  getClientById,
  updateClient,
  toggleClientStatus,
  deleteClient
} from '../controllers/adminClientController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes nécessitent authentification admin
router.use(protect);
router.use(authorize('admin'));

// Routes principales
router.get('/', getAllClients);
router.get('/:id', getClientById);
router.put('/:id', updateClient);
router.patch('/:id/toggle', toggleClientStatus);
router.delete('/:id', deleteClient);

export default router;