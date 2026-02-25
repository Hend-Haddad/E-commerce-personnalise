// src/services/productService.js
import api from './api';

export const productService = {
  // Récupérer tous les produits
  getAllProducts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `/products?${queryParams}` : '/products';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getAllProducts:', error);
      throw error;
    }
  },

  // Récupérer un produit par ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getProductById:', error);
      throw error;
    }
  },

  // Créer un produit avec plusieurs images
  createProduct: async (productData) => {
    try {
      const formData = new FormData();
      
      // Ajouter tous les champs texte
      Object.keys(productData).forEach(key => {
        if (key !== 'images' && productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });

      // Ajouter les images (plusieurs fichiers)
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((image, index) => {
          if (image instanceof File) {
            formData.append('images', image);
          }
        });
      }

      console.log('📡 Création produit avec', productData.images?.length || 0, 'images');

      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur createProduct:', error);
      throw error;
    }
  },

  // Mettre à jour un produit avec plusieurs images
  updateProduct: async (id, productData) => {
    try {
      const formData = new FormData();
      
      // Ajouter tous les champs texte
      Object.keys(productData).forEach(key => {
        if (key !== 'images' && key !== 'imagesToKeep' && productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });

      // Ajouter la liste des images à conserver
      if (productData.imagesToKeep && productData.imagesToKeep.length > 0) {
        formData.append('imagesToKeep', JSON.stringify(productData.imagesToKeep));
      }

      // Ajouter les nouvelles images
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((image, index) => {
          if (image instanceof File) {
            formData.append('images', image);
          }
        });
      }

      console.log('📡 Mise à jour produit ID:', id);
      console.log('📦 Images à conserver:', productData.imagesToKeep?.length || 0);
      console.log('📸 Nouvelles images:', productData.images?.length || 0);

      const response = await api.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur updateProduct:', error);
      throw error;
    }
  },

  // Désactiver un produit
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur deleteProduct:', error);
      throw error;
    }
  },

  // Réactiver un produit
  reactivateProduct: async (id) => {
    try {
      const response = await api.put(`/products/${id}/reactivate`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur reactivateProduct:', error);
      throw error;
    }
  },

  // Mettre à jour le stock
  updateStock: async (id, quantite_stock) => {
    try {
      const response = await api.put(`/products/${id}/stock`, { quantite_stock });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur updateStock:', error);
      throw error;
    }
  }
};