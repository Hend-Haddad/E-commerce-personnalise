// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getProfile } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Optionnel : vérifier que le token est toujours valide
          // const response = await getProfile(token);
          // setUser(response.user);
          
          // Ou simplement utiliser les données stockées
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('❌ Erreur chargement profil:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = (userData, token) => {
    console.log('🔐 Login - userData:', userData);
    console.log('🔐 Login - role:', userData.role);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    console.log('🔓 Déconnexion');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    console.log('🔄 Mise à jour utilisateur:', updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};