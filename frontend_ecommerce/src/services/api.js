import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// UN SEUL intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    console.log('='.repeat(50));
    console.log('🔍 INTERCEPTEUR AXIOS');
    console.log('📍 URL:', config.url);
    console.log('📍 Méthode:', config.method);
    console.log('📍 Token dans localStorage:', token ? 'PRÉSENT' : 'ABSENT');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Header Authorization ajouté');
      console.log('📍 Valeur:', config.headers.Authorization.substring(0, 30) + '...');
    } else {
      console.log('⚠️ Pas de token disponible');
    }
    
    console.log('📍 Headers complets:', config.headers);
    console.log('📍 Params:', config.params);
    console.log('='.repeat(50));
    
    return config;
  },
  (error) => {
    console.error('❌ Erreur intercepteur:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    console.log('📥 Réponse reçue:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ Erreur réponse:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export default api;