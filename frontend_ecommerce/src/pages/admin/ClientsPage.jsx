// src/pages/admin/ClientsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUsers, 
  FiUserCheck, 
  FiUserX, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCalendar,
  FiEye
} from 'react-icons/fi';
import { adminClientService } from '../../services/adminClientService';
import PageHeader from '../../components/admin/PageHeader';
import StatsCard from '../../components/admin/StatsCard';
import SearchFilter from '../../components/admin/SearchFilter';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';

const ClientsPage = () => {
  const [allClients, setAllClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [paginatedClients, setPaginatedClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({ search: '', actif: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [refresh, setRefresh] = useState(0);
  
  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1
  });

  useEffect(() => {
    loadAllClients();
  }, [refresh]);

  useEffect(() => {
    applyFilters();
  }, [filters.search, filters.actif, allClients]);

  useEffect(() => {
    applyPagination();
  }, [filteredClients, pagination.currentPage, pagination.itemsPerPage]);

  const loadAllClients = async () => {
    try {
      setLoading(true);
      console.log('👥 Chargement de tous les clients...');
      
      const data = await adminClientService.getAllClients();
      console.log('✅ Clients reçus:', data);
      
      setAllClients(data.clients || []);
      setStats(data.stats || {});
      
    } catch (error) {
      console.error('❌ Erreur chargement clients:', error);
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allClients];

    if (filters.search) {
      filtered = filtered.filter(client => 
        client.nom?.toLowerCase().includes(filters.search.toLowerCase()) ||
        client.prenom?.toLowerCase().includes(filters.search.toLowerCase()) ||
        client.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        client.telephone?.includes(filters.search)
      );
    }

    if (filters.actif === 'true') {
      filtered = filtered.filter(client => client.actif === true);
    } else if (filters.actif === 'false') {
      filtered = filtered.filter(client => client.actif === false);
    }

    setFilteredClients(filtered);
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
    setPaginatedClients(filteredClients.slice(start, end));
  };

  const handleToggleStatus = async (clientId, currentStatus) => {
    try {
      const result = await adminClientService.toggleClientStatus(clientId, !currentStatus);
      if (result?.success) {
        toast.success(`Client ${!currentStatus ? 'activé' : 'désactivé'}`);
        loadAllClients();
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      toast.error('Erreur lors du changement de statut');
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Options de filtres
  const filterOptions = [
    {
      value: filters.actif,
      onChange: (value) => setFilters(prev => ({ ...prev, actif: value })),
      options: [
        { value: '', label: 'Tous les clients' },
        { value: 'true', label: 'Clients actifs' },
        { value: 'false', label: 'Clients inactifs' }
      ]
    }
  ];

  // Définition des colonnes pour DataTable
  const columns = [
    {
      header: 'Client',
      accessor: 'client',
      render: (client) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
            {client.prenom?.charAt(0)}{client.nom?.charAt(0)}
          </div>
          <div className="ml-4">
            <p className="font-medium text-gray-900">
              {client.prenom} {client.nom}
            </p>
          </div>
        </div>
      )
    },
    {
      header: 'Contact',
      accessor: 'contact',
      render: (client) => (
        <div className="space-y-1">
          <p className="text-sm text-gray-900 flex items-center">
            <FiMail className="mr-2 text-gray-400" size={14} />
            {client.email}
          </p>
          {client.telephone && (
            <p className="text-sm text-gray-900 flex items-center">
              <FiPhone className="mr-2 text-gray-400" size={14} />
              {client.telephone}
            </p>
          )}
        </div>
      )
    },
    {
      header: 'Adresse',
      accessor: 'adresse',
      render: (client) => (
        <p className="text-sm text-gray-900 flex items-center">
          <FiMapPin className="mr-2 text-gray-400 flex-shrink-0" size={14} />
          <span className="line-clamp-2">{client.adresse || 'Non renseignée'}</span>
        </p>
      )
    },
    {
      header: 'Inscription',
      accessor: 'date',
      render: (client) => (
        <span className="text-sm text-gray-500">{formatDate(client.created_at)}</span>
      )
    },
    {
      header: 'Statut',
      accessor: 'statut',
      render: (client) => (
        <StatusBadge status={client.actif} type="user" />
      )
    }
  ];

  if (loading && allClients.length === 0) {
    return <LoadingSpinner fullScreen text="Chargement des clients..." />;
  }

  return (
    <div>
      <PageHeader
        title="Gestion des clients"
        resultCount={filteredClients.length}
        onRefresh={() => setRefresh(prev => prev + 1)}
        loading={loading}
      />

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total clients" value={stats.total || 0} icon={FiUsers} color="indigo" />
        <StatsCard title="Clients actifs" value={stats.actifs || 0} icon={FiUserCheck} color="green" />
        <StatsCard title="Clients inactifs" value={stats.inactifs || 0} icon={FiUserX} color="red" />
        <StatsCard title="Nouveaux (30 jours)" value={stats.nouveaux || 0} icon={FiCalendar} color="purple" />
      </div>

      {/* Filtres */}
      <SearchFilter
        searchValue={filters.search}
        onSearchChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
        onSearchSubmit={(e) => e.preventDefault()}
        filters={filterOptions}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        placeholder="Rechercher par nom, email ou téléphone..."
        resultCount={filteredClients.length}
        resultLabel="client(s)"
      />

      {/* Tableau */}
      <DataTable
        columns={columns}
        data={paginatedClients}
        loading={loading}
        emptyMessage="Aucun client trouvé"
        onView={(client) => window.location.href = `/admin/clients/${client._id}`}
        actions={true}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={filteredClients.length}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ClientsPage;