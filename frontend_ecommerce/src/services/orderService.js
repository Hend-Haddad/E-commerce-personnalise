// src/services/orderService.js
import api from './api';

export const orderService = {
  // Récupérer les commandes de l'utilisateur connecté
  getUserOrders: async () => {
    try {
      console.log('📡 Récupération des commandes utilisateur');
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getUserOrders:', error);
      throw error;
    }
  },

  // Récupérer une commande spécifique
  getOrderById: async (orderId) => {
    try {
      console.log('📡 Récupération commande:', orderId);
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getOrderById:', error);
      throw error;
    }
  },

  // Annuler une commande
  cancelOrder: async (orderId) => {
    try {
      console.log('📡 Annulation commande:', orderId);
      const response = await api.put(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur cancelOrder:', error);
      throw error;
    }
  }
};