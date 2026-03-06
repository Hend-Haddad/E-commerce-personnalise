// src/pages/admin/CategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiFolder } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { categoryService } from '../../services/categoryService';
import PageHeader from '../../components/admin/PageHeader';
import SearchFilter from '../../components/admin/SearchFilter';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CategoryModal from './CategoryModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const CategoriesPage = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [paginatedCategories, setPaginatedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [refresh, setRefresh] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1
  });

  useEffect(() => {
    loadAllCategories();
  }, [refresh]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, allCategories]);

  useEffect(() => {
    applyPagination();
  }, [filteredCategories, pagination.currentPage, pagination.itemsPerPage]);

  const loadAllCategories = async () => {
    try {
      setLoading(true);
      console.log('📡 Chargement des catégories...');
      
      const data = await categoryService.getAllCategories();
      console.log('✅ Catégories chargées:', data);
      
      const categories = data.categories || [];
      setAllCategories(categories);
      
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
      toast.error('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allCategories];

    if (searchTerm) {
      filtered = filtered.filter(cat => 
        cat.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
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
    setPaginatedCategories(filteredCategories.slice(start, end));
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      if (modalMode === 'add') {
        await categoryService.createCategory(categoryData);
        toast.success('Catégorie créée avec succès');
      } else {
        await categoryService.updateCategory(selectedCategory._id, categoryData);
        toast.success('Catégorie mise à jour avec succès');
      }
      
      setModalOpen(false);
      setRefresh(prev => prev + 1);
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await categoryService.deleteCategory(selectedCategory._id);
      toast.success('Catégorie désactivée avec succès');
      setDeleteModalOpen(false);
      setRefresh(prev => prev + 1);
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
      toast.error('Erreur lors de la suppression');
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
      year: 'numeric'
    });
  };

  const getImageUrl = (category) => {
    if (!category.image || category.image === 'default-category.jpg') {
      return '/default-category.jpg';
    }
    if (category.image.startsWith('http')) {
      return category.image;
    }
    return `http://localhost:5000${category.image}`;
  };

  // Définition des colonnes pour DataTable
  const columns = [
    {
      header: 'Image',
      accessor: 'image',
      render: (category) => (
        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <img
            src={getImageUrl(category)}
            alt={category.nom}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = '/default-category.jpg'; }}
          />
        </div>
      )
    },
    {
      header: 'Nom',
      accessor: 'nom',
      render: (category) => (
        <div className="text-sm font-medium text-gray-900">{category.nom}</div>
      )
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (category) => (
        <div className="text-sm text-gray-500 max-w-xs truncate">
          {category.description}
        </div>
      )
    },
    {
      header: 'Slug',
      accessor: 'slug',
      render: (category) => (
        <div className="text-sm text-gray-500">{category.slug}</div>
      )
    },
    {
      header: 'Date d\'ajout',
      accessor: 'date',
      render: (category) => (
        <span className="text-sm text-gray-500">
          {formatDate(category.date_ajout)}
        </span>
      )
    }
  ];

  if (loading && allCategories.length === 0) {
    return <LoadingSpinner fullScreen text="Chargement des catégories..." />;
  }

  return (
    <div>
      <PageHeader
        title="Gestion des Catégories"
        subtitle="Gérez les catégories de produits de votre boutique"
        resultCount={filteredCategories.length}
        onRefresh={() => setRefresh(prev => prev + 1)}
        onAdd={handleAddCategory}
        addLabel="Nouvelle catégorie"
        loading={loading}
      />

      {/* Search */}
      <SearchFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={(e) => e.preventDefault()}
        placeholder="Rechercher une catégorie..."
        resultCount={filteredCategories.length}
        resultLabel="catégorie(s)"
      />

      {/* Tableau */}
      <DataTable
        columns={columns}
        data={paginatedCategories}
        loading={loading}
        emptyMessage="Aucune catégorie trouvée"
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={filteredCategories.length}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Modals */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCategory}
        category={selectedCategory}
        mode={modalMode}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedCategory?.nom}
        itemType="catégorie"
      />
    </div>
  );
};

export default CategoriesPage;