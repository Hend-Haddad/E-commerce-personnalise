// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiFolder, FiPackage, FiUsers, FiShoppingBag, FiSettings } from 'react-icons/fi';

const AdminSidebar = () => {
  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/categories', icon: FiFolder, label: 'Catégories' },
    { path: '/admin/products', icon: FiPackage, label: 'Produits' },
    { path: '/admin/clients', icon: FiUsers, label: 'Clients' },
    { path: '/admin/orders', icon: FiShoppingBag, label: 'Commandes' },
    { path: '/admin/settings', icon: FiSettings, label: 'Paramètres' },
  ];

  return (
    <aside className="w-64 bg-white shadow-md h-[calc(100vh-4rem)] sticky top-16">
      <nav className="p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mb-1 rounded-lg transition ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="mr-3" size={18} />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;