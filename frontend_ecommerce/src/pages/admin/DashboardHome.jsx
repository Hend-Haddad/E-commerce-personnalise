// src/pages/admin/DashboardHome.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiPackage, 
  FiUsers, 
  FiShoppingBag, 
  FiFolder,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalProducts: 245,
    totalCategories: 12,
    totalClients: 1850,
    totalOrders: 324,
    revenue: 45890,
    pendingOrders: 23,
    deliveredOrders: 287,
    cancelledOrders: 14
  });

  const recentOrders = [
    { id: '#CMD001', client: 'Jean Dupont', total: 125.50, date: '2026-02-23', status: 'Livrée' },
    { id: '#CMD002', client: 'Sophie Martin', total: 89.90, date: '2026-02-23', status: 'En cours' },
    { id: '#CMD003', client: 'Pierre Durand', total: 245.00, date: '2026-02-22', status: 'Payée' },
    { id: '#CMD004', client: 'Marie Lambert', total: 67.30, date: '2026-02-22', status: 'Livrée' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Livrée': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-yellow-100 text-yellow-800';
      case 'Payée': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Produits</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
              <p className="text-xs text-green-500 mt-1">+12% vs mois dernier</p>
            </div>
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center">
              <FiPackage className="text-indigo-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Clients</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalClients}</p>
              <p className="text-xs text-green-500 mt-1">+8% vs mois dernier</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <FiUsers className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Commandes</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
              <p className="text-xs text-green-500 mt-1">+5% vs mois dernier</p>
            </div>
            <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
              <FiShoppingBag className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Revenus</p>
              <p className="text-3xl font-bold text-gray-800">{stats.revenue} DT</p>
              <p className="text-xs text-green-500 mt-1">+15% vs mois dernier</p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <FiDollarSign className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats secondaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Commandes en attente</h3>
            <FiClock className="text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.pendingOrders}</p>
          <p className="text-sm text-gray-500 mt-2">Nécessitent votre attention</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Commandes livrées</h3>
            <FiCheckCircle className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.deliveredOrders}</p>
          <p className="text-sm text-gray-500 mt-2">Ce mois-ci</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Commandes annulées</h3>
            <FiXCircle className="text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.cancelledOrders}</p>
          <p className="text-sm text-gray-500 mt-2">Ce mois-ci</p>
        </div>
      </div>

      {/* Graphique et tableaux */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique simplifié */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Aperçu des ventes</h3>
          <div className="h-64 flex items-end space-x-2">
            {[40, 65, 45, 80, 55, 70, 60].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-indigo-200 rounded-t-lg" style={{ height: `${height}%` }}>
                  <div className="w-full bg-indigo-600 rounded-t-lg" style={{ height: `${height * 0.7}%` }}></div>
                </div>
                <span className="text-xs text-gray-500 mt-2">J-{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Commandes récentes */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Commandes récentes</h3>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium text-sm">{order.client}</p>
                  <p className="text-xs text-gray-500">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{order.total} DT</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/admin/orders" className="block text-center text-indigo-600 text-sm mt-4 hover:underline">
            Voir toutes les commandes →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;