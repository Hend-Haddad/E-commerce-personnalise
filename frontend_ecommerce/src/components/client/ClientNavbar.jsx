// src/components/client/ClientNavbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiSearch, 
  FiHeart, 
  FiShoppingCart, 
  FiUser, 
  FiLogOut, 
  FiSettings, 
  FiPackage,
  FiBell,
  FiChevronDown,
  FiLock // ← Nouvelle icône pour le mot de passe
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { categoryService } from '../../services/categoryService';
import ChangePasswordModal from '../client/ChangePasswordModal'; // ← Nouveau composant

const ClientNavbar = ({ onSearch, onCategorySelect }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false); // ← État pour le modal
  const menuRef = useRef(null);

  // Charger les catégories au montage
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('❌ Erreur chargement catégories:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
        setShowCategories(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleCategoryClick = (categoryId) => {
    console.log('🖱️ Clic sur catégorie dans navbar:', categoryId);
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
    setShowCategories(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/client');
  };

  const handleOpenPasswordModal = () => {
    setShowUserMenu(false); // Fermer le menu
    setShowPasswordModal(true); // Ouvrir le modal
  };

  const menuItems = [
    { path: '/client/profile', icon: FiUser, label: 'Mon profil' },
    { path: '/client/orders', icon: FiPackage, label: 'Mes commandes' },
    { path: '/client/wishlist', icon: FiHeart, label: 'Mes favoris' },
    { path: '/client/notifications', icon: FiBell, label: 'Mes notifications' },
    { path: '/client/settings', icon: FiSettings, label: 'Paramètres' },
  ];

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button onClick={handleHomeClick} className="text-2xl font-bold text-indigo-600">
              SmartShop
            </button>

            {/* Categories Dropdown avec données de la BD */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600"
              >
                <span>Categories</span>
                <FiChevronDown />
              </button>
              {showCategories && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-96 overflow-y-auto">
                  {/* Option "Toutes les catégories" */}
                  <button
                    onClick={() => handleCategoryClick('')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 font-medium border-b border-gray-100"
                  >
                    Toutes les catégories
                  </button>
                  
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <button
                        key={category._id}
                        onClick={() => handleCategoryClick(category._id)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center"
                      >
                        {category.image && category.image !== 'default-category.jpg' && (
                          <img 
                            src={category.image.startsWith('http') ? category.image : `http://localhost:5000${category.image}`}
                            alt={category.nom}
                            className="w-5 h-5 object-cover rounded mr-2"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        )}
                        {category.nom}
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-sm text-gray-500">Chargement...</p>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={handleHomeClick} className="text-gray-700 hover:text-indigo-600">Home</button>
              <Link to="/brand" className="text-gray-700 hover:text-indigo-600">Brand</Link>
              <Link to="/offers" className="text-gray-700 hover:text-indigo-600">Offers</Link>
              <Link to="/publications" className="text-gray-700 hover:text-indigo-600">Publication House</Link>
              <Link to="/vendors" className="text-gray-700 hover:text-indigo-600">All Vendors</Link>
              <Link to="/vendor-zone" className="text-gray-700 hover:text-indigo-600">Vendor Zone</Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                >
                  <FiSearch size={20} />
                </button>
              </form>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Link to="/client/wishlist" className="text-gray-600 hover:text-indigo-600 relative">
                <FiHeart size={20} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </Link>
              
              <Link to="/cart" className="text-gray-600 hover:text-indigo-600 relative">
                <FiShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  2
                </span>
              </Link>

              {/* User Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
                >
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                    {user?.prenom?.charAt(0) || 'U'}
                  </div>
                  <FiChevronDown size={16} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="font-semibold text-gray-800">{user?.prenom} {user?.nom}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    {menuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <item.icon className="mr-3" size={16} />
                        {item.label}
                      </Link>
                    ))}

                    {/* ✅ Nouvelle option : Changer le mot de passe */}
                    <button
                      onClick={handleOpenPasswordModal}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    >
                      <FiLock className="mr-3" size={16} />
                      Changer mon mot de passe
                    </button>

                    <hr className="my-2" />
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <FiLogOut className="mr-3" size={16} />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal de changement de mot de passe */}
      <ChangePasswordModal 
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
};

export default ClientNavbar;