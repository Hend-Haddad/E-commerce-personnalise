// src/services/adminOrderService.js
import api from './api';

export const adminOrderService = {
  // Récupérer toutes les commandes avec filtres
  getAllOrders: async (params = {}) => {
    try {
      const { status = '', page = 1, limit = 20, search = '' } = params;
      const queryParams = new URLSearchParams({
        status,
        page,
        limit,
        search
      }).toString();
      
      const response = await api.get(`/admin/orders?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getAllOrders:', error);
      throw error;
    }
  },

  // Récupérer une commande par ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getOrderById:', error);
      throw error;
    }
  },

  // Mettre à jour le statut d'une commande
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur updateOrderStatus:', error);
      throw error;
    }
  },

  // Obtenir les statistiques
  getOrderStats: async () => {
    try {
      const response = await api.get('/admin/orders/stats');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getOrderStats:', error);
      throw error;
    }
  }
};