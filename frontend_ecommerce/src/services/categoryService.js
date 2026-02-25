// src/services/categoryService.js
import api from './api';

export const categoryService = {
  // Récupérer toutes les catégories
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getAllCategories:', error);
      throw error;
    }
  },

  // Récupérer une catégorie par ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getCategoryById:', error);
      throw error;
    }
  },

  // Créer une catégorie avec image
  createCategory: async (categoryData) => {
    try {
      const formData = new FormData();
      
      // Ajouter tous les champs
      Object.keys(categoryData).forEach(key => {
        if (key === 'image' && categoryData[key] instanceof File) {
          formData.append('image', categoryData[key]);
        } else if (categoryData[key] !== null && categoryData[key] !== undefined) {
          formData.append(key, categoryData[key]);
        }
      });

      console.log('📡 Création catégorie avec image:', Object.fromEntries(formData));

      const response = await api.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur createCategory:', error);
      throw error;
    }
  },

  // Mettre à jour une catégorie avec image
  updateCategory: async (id, categoryData) => {
    try {
      const formData = new FormData();
      
      Object.keys(categoryData).forEach(key => {
        if (key === 'image' && categoryData[key] instanceof File) {
          formData.append('image', categoryData[key]);
        } else if (categoryData[key] !== null && categoryData[key] !== undefined) {
          formData.append(key, categoryData[key]);
        }
      });

      console.log('📡 Mise à jour catégorie ID:', id);
      console.log('📦 Données:', Object.fromEntries(formData));

      const response = await api.put(`/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur updateCategory:', error);
      throw error;
    }
  },

  // Désactiver une catégorie
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur deleteCategory:', error);
      throw error;
    }
  },

  // Supprimer définitivement
  permanentDeleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}/permanent`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur permanentDeleteCategory:', error);
      throw error;
    }
  }
};