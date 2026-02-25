// src/services/api.js
import axios from 'axios';

// URL de base de l'API (backend)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Création d'une instance axios avec configuration de base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes timeout
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📡 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Erreur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs globales
api.interceptors.response.use(
  (response) => {
    console.log(`📥 Réponse reçue:`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Erreur de réponse:', error.response?.data || error.message);
    
    // Gestion des erreurs d'authentification (401)
    if (error.response?.status === 401) {
      console.log('🔓 Token expiré ou invalide, redirection vers login...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Ne rediriger que si on n'est pas déjà sur la page de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;