// src/services/adminClientService.js
import api from './api';

export const adminClientService = {
  getAllClients: async (params = {}) => {
    try {
      const { search = '', page = 1, limit = 20, actif } = params;
      const queryParams = new URLSearchParams();
      
      if (search) queryParams.append('search', search);
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (actif !== undefined && actif !== '') queryParams.append('actif', actif);
      
      const url = `/admin/clients${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      console.log('📡 Appel API:', url);
      
      const response = await api.get(url);
      console.log('✅ Réponse API:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getAllClients:', error);
      throw error;
    }
  },

  getClientById: async (clientId) => {
    try {
      const response = await api.get(`/admin/clients/${clientId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getClientById:', error);
      throw error;
    }
  },

  updateClient: async (clientId, data) => {
    try {
      const response = await api.put(`/admin/clients/${clientId}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur updateClient:', error);
      throw error;
    }
  },

  toggleClientStatus: async (clientId, actif) => {
    try {
      const response = await api.patch(`/admin/clients/${clientId}/toggle`, { actif });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur toggleClientStatus:', error);
      throw error;
    }
  },

  deleteClient: async (clientId, permanent = false) => {
    try {
      const response = await api.delete(`/admin/clients/${clientId}?permanent=${permanent}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur deleteClient:', error);
      throw error;
    }
  }
};