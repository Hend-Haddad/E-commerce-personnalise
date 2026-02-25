
import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome,
  FiPackage,
  FiUsers,
  FiShoppingBag,
  FiFolder,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
  FiSettings,
  FiBell,
  FiChevronDown,
  FiUserCheck,
  FiHelpCircle
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  // Fermer les menus quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/categories', icon: FiFolder, label: 'Catégories' },
    { path: '/admin/products', icon: FiPackage, label: 'Produits' },
    { path: '/admin/clients', icon: FiUsers, label: 'Clients' },
    { path: '/admin/orders', icon: FiShoppingBag, label: 'Commandes' },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (user?.nom && user?.prenom) {
      return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
    }
    return 'A';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-gradient-to-b from-indigo-900 to-indigo-800 text-white transition-all duration-300 fixed h-full z-30 shadow-2xl`}>
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-indigo-700">
          {sidebarOpen ? (
            <div>
              <h1 className="text-2xl font-bold">SmartShop</h1>
              <p className="text-xs text-indigo-300">ADMIN PANEL</p>
            </div>
          ) : (
            <h1 className="text-xl font-bold mx-auto">EC</h1>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-indigo-700 transition"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* User Info - Version simplifiée pour sidebar */}
        <div className="p-6 border-b border-indigo-700">
          {sidebarOpen ? (
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-xl font-bold">
                {getInitials()}
              </div>
              <div className="ml-4">
                <p className="font-semibold">{user?.prenom} {user?.nom}</p>
                <p className="text-sm text-indigo-300">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-600 text-xs rounded-full">
                  Administrateur
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-lg font-bold">
                {getInitials()}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-6 overflow-y-auto h-[calc(100vh-280px)]">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 transition ${
                isActive(item.path)
                  ? 'bg-indigo-700 border-l-4 border-white'
                  : 'text-indigo-100 hover:bg-indigo-700'
              }`}
            >
              <item.icon className={`${sidebarOpen ? 'mr-4' : 'mx-auto'}`} size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        {/* AppBar */}
        <header className="bg-white shadow-sm h-20 flex items-center px-8 sticky top-0 z-20">
          {/* Titre de la page */}
          <h1 className="text-2xl font-bold text-gray-800">
            {location.pathname === '/admin' && 'Tableau de bord'}
            {location.pathname === '/admin/categories' && 'Gestion des catégories'}
            {location.pathname === '/admin/products' && 'Gestion des produits'}
            {location.pathname === '/admin/clients' && 'Gestion des clients'}
            {location.pathname === '/admin/orders' && 'Gestion des commandes'}
          </h1>

          {/* Actions à droite */}
          <div className="ml-auto flex items-center space-x-4">
            {/* Date */}
            <span className="text-sm text-gray-600 hidden md:block">
              {new Date().toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition relative"
              >
                <FiBell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Dropdown Notifications */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-4 hover:bg-gray-50 border-b">
                      <p className="text-sm text-gray-800">Nouvelle commande #1234</p>
                      <p className="text-xs text-gray-500 mt-1">Il y a 5 minutes</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50 border-b">
                      <p className="text-sm text-gray-800">Client inscrit: Sophie Martin</p>
                      <p className="text-xs text-gray-500 mt-1">Il y a 15 minutes</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50">
                      <p className="text-sm text-gray-800">Stock faible: Smartphone XYZ</p>
                      <p className="text-xs text-gray-500 mt-1">Il y a 30 minutes</p>
                    </div>
                  </div>
                  <div className="p-3 border-t text-center">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800">
                      Voir toutes les notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2 transition"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                  {getInitials()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.prenom} {user?.nom}
                  </p>
                  <p className="text-xs text-gray-500">Administrateur</p>
                </div>
                <FiChevronDown className="text-gray-500" size={16} />
              </button>

              {/* Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  {/* Header */}
                  <div className="p-4 border-b bg-gradient-to-r from-indigo-50 to-indigo-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {getInitials()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user?.prenom} {user?.nom}</p>
                        <p className="text-xs text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <Link
                      to="/admin/profile"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <FiUser className="mr-3 text-indigo-600" size={18} />
                      <span>Mon profil</span>
                    </Link>

                    <Link
                      to="/admin/settings"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <FiSettings className="mr-3 text-indigo-600" size={18} />
                      <span>Paramètres</span>
                    </Link>

                    <Link
                      to="/admin/help"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <FiHelpCircle className="mr-3 text-indigo-600" size={18} />
                      <span>Aide & support</span>
                    </Link>

                    <div className="border-t my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <FiLogOut className="mr-3" size={18} />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;