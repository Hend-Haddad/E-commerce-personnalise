import api from './api';

export const register = async (userData) => {
  try {
   console.log('📤 Données envoyées:', userData) // Pour déboguer
    const response = await api.post('/auth/register', userData)
    console.log('📥 Réponse reçue:', response.data)
    return response.data
  } catch (error) {
    throw error
  }
}

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials)
    return response.data
  } catch (error) {
    throw error
  }
}



export const getProfile = async (token) => {
  try {
    console.log('📡 Récupération du profil avec token');
    const response = await api.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('📥 Profil reçu:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur profil:', error.response?.data || error.message);
    throw error;
  }
};

// ✅ NOUVEAU : Mettre à jour le profil
export const updateProfile = async (profileData) => {
  try {
    console.log('📡 Mise à jour du profil avec:', profileData);
    const response = await api.put('/auth/profile', profileData);
    console.log('📥 Réponse mise à jour:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur updateProfile:', error.response?.data || error.message);
    throw error;
  }
};