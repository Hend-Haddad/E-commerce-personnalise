// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, login, logout, updateUser, loading } = context;

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isClient = () => {
    return user?.role === 'client';
  };

  return {
    user,
    login,
    logout,
    updateUser, // ← Nouvelle fonction
    loading,
    isAdmin,
    isClient,
    token: localStorage.getItem('token')
  };
};