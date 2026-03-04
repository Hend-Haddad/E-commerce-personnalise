// src/services/cartService.js - VERSION CORRIGÉE
import api from './api';

export const cartService = {
  // Récupérer le panier
  getCart: async (user, sessionId) => {
    try {
      console.log('📡 SERVICE getCart - user:', user ? 'connecté' : 'visiteur');
      
      const params = {};
      
      // 🔴 CORRECTION : Si user est connecté, on ne met PAS sessionId dans params
      // Le token sera ajouté automatiquement par l'intercepteur
      if (!user && sessionId) {
        params.sessionId = sessionId;
        console.log('📡 Service - Utilisation sessionId pour visiteur:', sessionId);
      } else if (user) {
        console.log('📡 Service - Utilisateur connecté, utilisation du token');
      }
      
      const response = await api.get('/cart', { params });
      return response.data;
    } catch (error) {
      console.error('❌ SERVICE getCart error:', error);
      return { success: false, cart: { items: [], total: 0, itemCount: 0 } };
    }
  },

  // Ajouter au panier - VERSION CORRIGÉE
  addToCart: async (productId, quantity, user, sessionId) => {
    try {
      console.log('📡 SERVICE addToCart - Début');
      console.log('   - productId:', productId);
      console.log('   - user connecté:', user ? 'OUI' : 'NON');
      console.log('   - sessionId fournie:', sessionId);
      
      const params = {};
      
      // 🔴 CORRECTION CRITIQUE : Si user est connecté, on utilise le token, PAS sessionId
      if (!user && sessionId) {
        params.sessionId = sessionId;
        console.log('📡 Service - Mode VISITEUR avec sessionId:', sessionId);
      } else if (user) {
        console.log('📡 Service - Mode CONNECTÉ avec token');
        // NE PAS mettre sessionId dans params pour les connectés
      }
      
      console.log('📡 Service - params envoyés:', params);
      
      const response = await api.post('/cart', 
        { productId, quantity },
        { params }
      );
      
      console.log('📡 SERVICE addToCart - réponse:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ SERVICE addToCart error:', error);
      throw error;
    }
  },

  // Mettre à jour la quantité
  updateQuantity: async (itemId, quantity, user, sessionId) => {
    try {
      const params = {};
      if (!user && sessionId) {
        params.sessionId = sessionId;
      }
      
      const response = await api.put(`/cart/${itemId}`, 
        { quantity },
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('❌ updateQuantity error:', error);
      throw error;
    }
  },

  // Supprimer un article
  removeFromCart: async (itemId, user, sessionId) => {
    try {
      const params = {};
      if (!user && sessionId) {
        params.sessionId = sessionId;
      }
      
      const response = await api.delete(`/cart/${itemId}`, { params });
      return response.data;
    } catch (error) {
      console.error('❌ removeFromCart error:', error);
      throw error;
    }
  },

  // Vider le panier
  clearCart: async (user, sessionId) => {
    try {
      const params = {};
      if (!user && sessionId) {
        params.sessionId = sessionId;
      }
      
      const response = await api.delete('/cart', { params });
      return response.data;
    } catch (error) {
      console.error('❌ clearCart error:', error);
      throw error;
    }
  },

  // Passer commande
  checkout: async (cartId, orderData) => {
    try {
      const response = await api.post('/orders', {
        cartId,
        ...orderData
      });
      return response.data;
    } catch (error) {
      console.error('❌ checkout error:', error);
      throw error;
    }
  }
};