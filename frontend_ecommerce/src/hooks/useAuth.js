// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// ✅ Bien exporter la fonction
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, login, logout, loading } = context;

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return {
    user,
    login,
    logout,
    loading,
    isAdmin,
    token: localStorage.getItem('token')
  };
};