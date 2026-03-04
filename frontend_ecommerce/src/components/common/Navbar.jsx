// src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiSearch, 
  FiHeart, 
  FiShoppingCart, 
  FiUser, 
  FiMenu, 
  FiX 
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            SmartShop
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600">
              Accueil
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-indigo-600">
              Produits
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-indigo-600">
              Contact
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600">
              À propos
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Rechercher un produit..."
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
          <div className="hidden md:flex items-center space-x-4">
            {/* 🔴 Wishlist Icon - UNIQUEMENT pour utilisateurs connectés */}
            {user && (
              <Link to="/client/wishlist" className="text-gray-600 hover:text-indigo-600 relative">
                <FiHeart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}
            
            {/* 🛒 Cart Icon - VISIBLE POUR TOUS (visiteurs et connectés) */}
            <Link to="/cart" className="text-gray-600 hover:text-indigo-600 relative">
              <FiShoppingCart size={20} />
              {cart.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cart.itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
                >
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                    {user?.prenom?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm hidden lg:block">{user.prenom}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Mon profil
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Mes commandes
                    </Link>
                    <Link
                      to="/client/wishlist"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center justify-between"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <span>Mes favoris</span>
                      {wishlistCount > 0 && (
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Se connecter
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-indigo-600"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button type="submit" className="absolute right-3 top-2.5">
                  <FiSearch className="text-gray-400" />
                </button>
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link
                to="/"
                className="block py-2 text-gray-700 hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/products"
                className="block py-2 text-gray-700 hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Produits
              </Link>
              <Link
                to="/contact"
                className="block py-2 text-gray-700 hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/about"
                className="block py-2 text-gray-700 hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                À propos
              </Link>

              {/* Mobile Icons with counters */}
              <div className="flex items-center space-x-4 py-2 border-t border-gray-200 mt-2 pt-2">
                {/* Wishlist mobile - UNIQUEMENT pour utilisateurs connectés */}
                {user && (
                  <Link
                    to="/client/wishlist"
                    className="flex items-center text-gray-600 hover:text-indigo-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="relative">
                      <FiHeart size={20} />
                      {wishlistCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </div>
                    <span className="ml-2">Favoris</span>
                  </Link>
                )}
                
                {/* 🛒 Cart mobile - VISIBLE POUR TOUS */}
                <Link
                  to="/cart"
                  className="flex items-center text-gray-600 hover:text-indigo-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="relative">
                    <FiShoppingCart size={20} />
                    {cart.itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {cart.itemCount}
                      </span>
                    )}
                  </div>
                  <span className="ml-2">Panier</span>
                </Link>
              </div>

              {/* Mobile Auth Links */}
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="block py-2 text-gray-700 hover:text-indigo-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profil
                  </Link>
                  <Link
                    to="/orders"
                    className="block py-2 text-gray-700 hover:text-indigo-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Commandes
                  </Link>
                  <Link
                    to="/client/wishlist"
                    className="block py-2 text-gray-700 hover:text-indigo-600 flex items-center justify-between"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Favoris</span>
                    {wishlistCount > 0 && (
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-red-600 hover:text-red-800"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <div className="flex space-x-4 pt-2">
                  <Link
                    to="/login"
                    className="flex-1 bg-indigo-600 text-white text-center py-2 rounded-lg hover:bg-indigo-700 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 border border-indigo-600 text-indigo-600 text-center py-2 rounded-lg hover:bg-indigo-50 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;