// src/pages/client/OrdersPage.jsx
import React from 'react';
import ClientNavbar from '../../components/client/ClientNavbar';


const OrdersPage = () => {
  // Données simulées des commandes
  const orders = [
    { id: '#CMD001', date: '2026-02-24', total: 125.50, status: 'Livrée', items: 3 },
    { id: '#CMD002', date: '2026-02-23', total: 89.90, status: 'En cours', items: 2 },
    { id: '#CMD003', date: '2026-02-22', total: 245.00, status: 'Payée', items: 4 },
    { id: '#CMD004', date: '2026-02-20', total: 67.30, status: 'Livrée', items: 1 },
    { id: '#CMD005', date: '2026-02-18', total: 189.99, status: 'Livrée', items: 3 },
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
    <div className="min-h-screen bg-gray-50">
      
        
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Mes Commandes</h1>

          {/* Liste des commandes */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Articles</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.items} articles</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.total} DT</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-indigo-600 hover:text-indigo-800">
                          Détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Affichage de 1 à 5 sur 15 commandes
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  Précédent
                </button>
                <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
   
  );
};

export default OrdersPage; // ← Vérifiez que cette ligne est bien présente