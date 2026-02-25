// src/components/admin/AdminRoute.jsx (version simplifiée)
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';


const AdminRoute = ({ children }) => {
  const context = useContext(AuthContext);
  
  if (!context) {
    return <div>Erreur: Contexte non trouvé</div>;
  }

  const { user, loading } = context;
  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Chargement..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;