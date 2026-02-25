// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/products?search=${searchTerm}`;
    }
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
            <Link to="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
            <Link to="/contact" className="text-gray-700 hover:text-indigo-600">Contact</Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600">About</Link>
            {!user && (
              <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Sign Up
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="What are you looking for?"
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
            <Link to="/wishlist" className="text-gray-600 hover:text-indigo-600">
              <FiHeart size={20} />
            </Link>
            <Link to="/cart" className="text-gray-600 hover:text-indigo-600 relative">
              <FiShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </Link>
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600">
                  <FiUser size={20} />
                  <span className="text-sm">{user.prenom}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">Mon profil</Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">Mes commandes</Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
                Login
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
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button type="submit" className="absolute right-2 top-2">
                  <FiSearch />
                </button>
              </div>
            </form>
            <div className="space-y-2">
              <Link to="/" className="block py-2 text-gray-700 hover:text-indigo-600">Home</Link>
              <Link to="/contact" className="block py-2 text-gray-700 hover:text-indigo-600">Contact</Link>
              <Link to="/about" className="block py-2 text-gray-700 hover:text-indigo-600">About</Link>
              <Link to="/wishlist" className="block py-2 text-gray-700 hover:text-indigo-600">Wishlist</Link>
              <Link to="/cart" className="block py-2 text-gray-700 hover:text-indigo-600">Cart</Link>
              {user ? (
                <>
                  <Link to="/profile" className="block py-2 text-gray-700 hover:text-indigo-600">Profile</Link>
                  <button onClick={logout} className="block py-2 text-red-600 hover:text-red-800">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block py-2 text-indigo-600">Login</Link>
                  <Link to="/register" className="block py-2 text-indigo-600">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;