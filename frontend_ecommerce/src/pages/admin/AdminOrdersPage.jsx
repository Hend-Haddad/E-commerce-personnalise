// src/pages/admin/OrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPackage, 
  FiSearch, 
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiPackage as FiPackageIcon,
  FiAlertCircle,
  FiChevronDown
} from 'react-icons/fi';
import { adminOrderService } from '../../services/adminOrderService';
import toast from 'react-hot-toast';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });
  
  // Filtres
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [filters.status, filters.search, pagination.page]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      console.log('📦 Chargement des commandes...');
      const data = await adminOrderService.getAllOrders({
        status: filters.status,
        search: filters.search,
        page: pagination.page,
        limit: pagination.limit
      });
      
      console.log('✅ Commandes reçues:', data);
      setOrders(data.orders || []);
      setStats(data.stats || {});
      setPagination(data.pagination || pagination);
    } catch (error) {
      console.error('❌ Erreur chargement commandes:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      const result = await adminOrderService.updateOrderStatus(orderId, newStatus);
      
      if (result?.success) {
        toast.success(`Statut mis à jour : ${getStatusLabel(newStatus)}`);
        loadOrders(); // Recharger la liste
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour statut:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      'en_attente': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FiClock, label: 'En attente' },
      'confirmée': { bg: 'bg-blue-100', text: 'text-blue-800', icon: FiCheckCircle, label: 'Confirmée' },
      'en_préparation': { bg: 'bg-purple-100', text: 'text-purple-800', icon: FiPackageIcon, label: 'En préparation' },
      'expédiée': { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: FiTruck, label: 'Expédiée' },
      'livrée': { bg: 'bg-green-100', text: 'text-green-800', icon: FiCheckCircle, label: 'Livrée' },
      'annulée': { bg: 'bg-red-100', text: 'text-red-800', icon: FiXCircle, label: 'Annulée' }
    };
    return config[status] || config['en_attente'];
  };

  const getStatusLabel = (status) => {
    const labels = {
      'en_attente': 'En attente',
      'confirmée': 'Confirmée',
      'en_préparation': 'En préparation',
      'expédiée': 'Expédiée',
      'livrée': 'Livrée',
      'annulée': 'Annulée'
    };
    return labels[status] || status;
  };

  // ✅ Liste complète de tous les statuts possibles
  const allStatusOptions = [
    { value: 'en_attente', label: 'En attente', icon: FiClock, color: 'yellow' },
    { value: 'confirmée', label: 'Confirmée', icon: FiCheckCircle, color: 'blue' },
    { value: 'en_préparation', label: 'En préparation', icon: FiPackageIcon, color: 'purple' },
    { value: 'expédiée', label: 'Expédiée', icon: FiTruck, color: 'indigo' },
    { value: 'livrée', label: 'Livrée', icon: FiCheckCircle, color: 'green' },
    { value: 'annulée', label: 'Annulée', icon: FiXCircle, color: 'red' }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'TND'
    }).format(price);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    loadOrders();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const statusFilterOptions = [
    { value: '', label: 'Tous les statuts' },
    ...allStatusOptions
  ];

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête avec statistiques */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Gestion des commandes</h1>
        
        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {/* Total des commandes */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total || 0}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <FiPackage className="text-gray-600" size={20} />
              </div>
            </div>
          </div>

          {/* Statistiques par statut */}
          {allStatusOptions.map(({ value, label, icon: Icon, color }) => {
            const count = stats[value] || 0;
            const bgColor = `bg-${color}-100`;
            const textColor = `text-${color}-800`;
            
            return (
              <div key={value} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <div className={`p-3 rounded-full ${bgColor}`}>
                    <Icon className={textColor} size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par numéro ou email..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>
          </form>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FiFilter className="mr-2" />
              Filtres
            </button>

            <select
              value={filters.status}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, status: e.target.value }));
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {statusFilterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Articles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut actuel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Changer statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    <FiPackage className="mx-auto mb-3" size={48} />
                    <p className="text-lg font-medium">Aucune commande trouvée</p>
                    <p className="text-sm mt-1">Il n'y a pas encore de commandes dans la base de données.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statusBadge = getStatusBadge(order.status);
                  const StatusIcon = statusBadge.icon;
                  const isUpdating = updatingOrder === order._id;
                  
                  return (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-indigo-600">
                          {order.order_number}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.user_id?.prenom} {order.user_id?.nom}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.user_id?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                          {order.items?.length || 0} article(s)
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-indigo-600">
                          {formatPrice(order.total)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text} flex items-center`}>
                            <StatusIcon className="mr-1" size={12} />
                            {statusBadge.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* ✅ Liste déroulante pour changer le statut */}
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={isUpdating}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        >
                          {allStatusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        
                        {isUpdating && (
                          <div className="inline-block ml-2 animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition inline-flex items-center"
                          title="Voir détails"
                        >
                          <FiEye size={18} />
                          <span className="ml-1 text-sm">Détails</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Précédent
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{pagination.page}</span> sur{' '}
                  <span className="font-medium">{pagination.pages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FiChevronLeft size={16} />
                  </button>
                  {[...Array(pagination.pages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pagination.page === pageNum
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FiChevronRight size={16} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;