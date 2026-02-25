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
    const response = await api.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}