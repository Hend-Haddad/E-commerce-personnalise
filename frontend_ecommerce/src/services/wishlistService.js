// src/services/wishlistService.js
import api from './api';

export const wishlistService = {
  // Pour utilisateurs connectés
  getWishlist: async () => {
    try {
      const response = await api.get('/wishlist');
      return response.data;
    } catch (error) {
      console.error('❌ getWishlist error:', error);
      throw error;
    }
  },

  addToWishlist: async (productId) => {
    try {
      const response = await api.post('/wishlist', { productId });
      return response.data;
    } catch (error) {
      console.error('❌ addToWishlist error:', error);
      throw error;
    }
  },

  removeFromWishlist: async (productId) => {
    try {
      const response = await api.delete(`/wishlist/${productId}`);
      return response.data;
    } catch (error) {
      console.error('❌ removeFromWishlist error:', error);
      throw error;
    }
  }
};