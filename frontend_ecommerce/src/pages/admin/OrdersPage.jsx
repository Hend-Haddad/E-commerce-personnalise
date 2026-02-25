// src/pages/admin/OrdersPage.jsx
import React, { useState } from 'react';
import { FiSearch, FiEye } from 'react-icons/fi';

const OrdersPage = () => {
  const [orders] = useState([
    { id: '#1234', client: 'Jean Dupont', total: 125.50, date: '2026-02-22', statut: 'livrée' },
    { id: '#1235', client: 'Sophie Martin', total: 89.90, date: '2026-02-22', statut: 'en cours' },
    { id: '#1236', client: 'Pierre Durand', total: 245.00, date: '2026-02-21', statut: 'payée' },
  ]);

  const getStatusColor = (statut) => {
    switch(statut) {
      case 'livrée': return 'bg-green-100 text-green-800';
      case 'en cours': return 'bg-yellow-100 text-yellow-800';
      case 'payée': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestion des Commandes</h1>

      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une commande..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{order.client}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.total} DT</td>
                <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.statut)}`}>
                    {order.statut}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900">
                    <FiEye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;