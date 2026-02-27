// src/components/admin/AdminNavbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/admin" className="text-2xl font-bold text-indigo-600">
            Admin Panel
          </Link>

          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-indigo-600">
              <FiBell size={20} />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                {user?.prenom} {user?.nom}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600"
              title="Déconnexion"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;