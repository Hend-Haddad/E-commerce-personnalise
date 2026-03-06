// src/pages/admin/OrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPackage, 
  FiEye,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTruck
} from 'react-icons/fi';
import { adminOrderService } from '../../services/adminOrderService';
import PageHeader from '../../components/admin/PageHeader';
import StatsCard from '../../components/admin/StatsCard';
import SearchFilter from '../../components/admin/SearchFilter';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';

const AdminOrdersPage = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [paginatedOrders, setPaginatedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [refresh, setRefresh] = useState(0);
  
  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1
  });

  // Statuts possibles
  const allStatusOptions = [
    { value: 'en_attente', label: 'En attente', icon: FiClock, color: 'yellow' },
    { value: 'confirmée', label: 'Confirmée', icon: FiCheckCircle, color: 'blue' },
    { value: 'en_préparation', label: 'En préparation', icon: FiPackage, color: 'purple' },
    { value: 'expédiée', label: 'Expédiée', icon: FiTruck, color: 'indigo' },
    { value: 'livrée', label: 'Livrée', icon: FiCheckCircle, color: 'green' },
    { value: 'annulée', label: 'Annulée', icon: FiXCircle, color: 'red' }
  ];

  useEffect(() => {
    loadAllOrders();
  }, [refresh]);

  useEffect(() => {
    applyFilters();
  }, [filters.status, filters.search, allOrders]);

  useEffect(() => {
    applyPagination();
  }, [filteredOrders, pagination.currentPage, pagination.itemsPerPage]);

  const loadAllOrders = async () => {
    try {
      setLoading(true);
      console.log('📦 Chargement de toutes les commandes...');
      
      const data = await adminOrderService.getAllOrders();
      console.log('✅ Commandes reçues:', data);
      
      setAllOrders(data.orders || []);
      setStats(data.stats || {});
      
    } catch (error) {
      console.error('❌ Erreur chargement commandes:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allOrders];

    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    if (filters.search) {
      filtered = filtered.filter(order => 
        order.order_number?.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.user_id?.email?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / prev.itemsPerPage)
    }));
  };

  const applyPagination = () => {
    const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const end = start + pagination.itemsPerPage;
    setPaginatedOrders(filteredOrders.slice(start, end));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      const result = await adminOrderService.updateOrderStatus(orderId, newStatus);
      
      if (result?.success) {
        toast.success(`Statut mis à jour`);
        loadAllOrders();
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour statut:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // Options de filtres
  const filterOptions = [
    {
      value: filters.status,
      onChange: (value) => setFilters(prev => ({ ...prev, status: value })),
      options: [
        { value: '', label: 'Tous les statuts' },
        ...allStatusOptions.map(opt => ({ value: opt.value, label: opt.label }))
      ]
    }
  ];

  // Définition des colonnes pour DataTable
  const columns = [
    {
      header: 'N° Commande',
      accessor: 'order_number',
      render: (order) => (
        <span className="font-medium text-indigo-600">{order.order_number}</span>
      )
    },
    {
      header: 'Client',
      accessor: 'client',
      render: (order) => (
        <div>
          <p className="font-medium text-gray-900">
            {order.user_id?.prenom} {order.user_id?.nom}
          </p>
          <p className="text-sm text-gray-500">{order.user_id?.email}</p>
        </div>
      )
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (order) => (
        <span className="text-sm text-gray-500">{formatDate(order.created_at)}</span>
      )
    },
    {
      header: 'Articles',
      accessor: 'articles',
      render: (order) => (
        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
          {order.items?.length || 0} article(s)
        </span>
      )
    },
    {
      header: 'Total',
      accessor: 'total',
      render: (order) => (
        <span className="font-bold text-indigo-600">{formatPrice(order.total)}</span>
      )
    },
    {
      header: 'Statut',
      accessor: 'status',
      render: (order) => (
        <StatusBadge status={order.status} type="order" />
      )
    },
    {
      header: 'Changer statut',
      accessor: 'statusChange',
      render: (order) => {
        const isUpdating = updatingOrder === order._id;
        return (
          <div className="flex items-center">
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
              disabled={isUpdating}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {allStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {isUpdating && (
              <div className="ml-2 animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
            )}
          </div>
        );
      }
    }
  ];

  if (loading && allOrders.length === 0) {
    return <LoadingSpinner fullScreen text="Chargement des commandes..." />;
  }

  return (
    <div>
      <PageHeader
        title="Gestion des commandes"
        resultCount={filteredOrders.length}
        onRefresh={() => setRefresh(prev => prev + 1)}
        loading={loading}
      />

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        <StatsCard title="Total" value={stats.total || 0} icon={FiPackage} color="gray" />
        
        {allStatusOptions.map(({ value, label, icon, color }) => (
          <StatsCard
            key={value}
            title={label}
            value={stats[value] || 0}
            icon={icon}
            color={color}
          />
        ))}
      </div>

      {/* Filtres */}
      <SearchFilter
        searchValue={filters.search}
        onSearchChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
        onSearchSubmit={(e) => e.preventDefault()}
        filters={filterOptions}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        placeholder="Rechercher par numéro ou email..."
        resultCount={filteredOrders.length}
        resultLabel="commande(s)"
      />

      {/* Tableau */}
      <DataTable
        columns={columns}
        data={paginatedOrders}
        loading={loading}
        emptyMessage="Aucune commande trouvée"
        onView={(order) => window.location.href = `/admin/orders/${order._id}`}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={filteredOrders.length}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;