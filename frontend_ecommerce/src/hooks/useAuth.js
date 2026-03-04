import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, login, logout, updateUser, loading } = context;  // ← Ajoutez updateUser ici

  console.log('👤 useAuth - user actuel:', user);

  return {
    user,
    login,
    logout,
    updateUser,  // ← Maintenant disponible
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isClient: user?.role === 'client',
    token: localStorage.getItem('token')
  };
};