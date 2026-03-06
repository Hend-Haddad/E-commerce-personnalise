// src/pages/admin/ProductsPageAdmin.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiEdit2, 
  FiTrash2, 
  FiPlus, 
  FiSearch, 
  FiRefreshCw,
  FiPackage,
  FiDollarSign,
  FiArchive,
  FiEye
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import ProductModal from './ProductModal';
import ProductViewModal from './ProductViewModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import PageHeader from '../../components/admin/PageHeader';
import StatsCard from '../../components/admin/StatsCard';
import SearchFilter from '../../components/admin/SearchFilter';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProductsPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('tous');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [refresh, setRefresh] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1
  });
  
  const [stats, setStats] = useState({
    total: 0,
    actifs: 0,
    stockTotal: 0,
    valeurStock: 0
  });

  useEffect(() => {
    loadAllData();
  }, [refresh]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategory, selectedStatus, allProducts]);

  useEffect(() => {
    applyPagination();
  }, [filteredProducts, pagination.currentPage, pagination.itemsPerPage]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      console.log('📦 Chargement de tous les produits...');
      
      const productsData = await productService.getAllProducts();
      console.log('✅ Produits reçus:', productsData);
      
      const allProds = productsData.products || [];
      setAllProducts(allProds);
      
      setStats({
        total: allProds.length,
        actifs: allProds.filter(p => p.actif).length,
        stockTotal: allProds.reduce((acc, p) => acc + (p.quantite_stock || 0), 0),
        valeurStock: allProds.reduce((acc, p) => acc + ((p.prix || 0) * (p.quantite_stock || 0)), 0)
      });

      const categoriesData = await categoryService.getAllCategories();
      setCategories(categoriesData.categories || []);

    } catch (error) {
      console.error('❌ Erreur chargement:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allProducts];

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(p => p.categorie_id?._id === selectedCategory);
    }

    if (selectedStatus === 'actif') {
      filtered = filtered.filter(p => p.actif);
    } else if (selectedStatus === 'inactif') {
      filtered = filtered.filter(p => !p.actif);
    }

    setFilteredProducts(filtered);
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
    setPaginatedProducts(filteredProducts.slice(start, end));
  };

  // ✅ TOUTES LES FONCTIONS HANDLE SONT DÉFINIES ICI
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (modalMode === 'add') {
        await productService.createProduct(productData);
        toast.success('Produit créé avec succès');
      } else {
        await productService.updateProduct(selectedProduct._id, productData);
        toast.success('Produit mis à jour avec succès');
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
      await productService.deleteProduct(selectedProduct._id);
      toast.success('Produit désactivé avec succès');
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

  const getDisplayImage = (product) => {
    if (product.image_principale && product.image_principale !== 'default-product.jpg') {
      return product.image_principale.startsWith('http') 
        ? product.image_principale 
        : `http://localhost:5000${product.image_principale}`;
    }
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      return firstImage.startsWith('http') ? firstImage : `http://localhost:5000${firstImage}`;
    }
    return '/default-product.jpg';
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Rupture', color: 'bg-red-100 text-red-800' };
    if (stock < 10) return { label: 'Stock faible', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'En stock', color: 'bg-green-100 text-green-800' };
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
      value: selectedCategory,
      onChange: setSelectedCategory,
      options: [
        { value: '', label: 'Toutes les catégories' },
        ...categories.map(cat => ({ value: cat._id, label: cat.nom }))
      ]
    },
    {
      value: selectedStatus,
      onChange: setSelectedStatus,
      options: [
        { value: 'tous', label: 'Tous' },
        { value: 'actif', label: 'Actifs' },
        { value: 'inactif', label: 'Inactifs' }
      ]
    }
  ];

  // Définition des colonnes pour DataTable
  const columns = [
    {
      header: 'Image',
      accessor: 'image',
      render: (product) => (
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <img
            src={getDisplayImage(product)}
            alt={product.nom}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = '/default-product.jpg'; }}
          />
        </div>
      )
    },
    {
      header: 'Produit',
      accessor: 'nom',
      render: (product) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{product.nom}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {product.description?.substring(0, 50)}...
          </div>
        </div>
      )
    },
    {
      header: 'Catégorie',
      accessor: 'categorie',
      render: (product) => (
        <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
          {product.categorie_id?.nom || 'Non catégorisé'}
        </span>
      )
    },
    {
      header: 'Prix',
      accessor: 'prix',
      render: (product) => (
        <div className="text-sm font-bold text-gray-900">{formatPrice(product.prix)}</div>
      )
    },
    {
      header: 'Stock',
      accessor: 'stock',
      render: (product) => {
        const status = getStockStatus(product.quantite_stock);
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${status.color}`}>
            {product.quantite_stock} {status.label}
          </span>
        );
      }
    },
    {
      header: 'Statut',
      accessor: 'statut',
      render: (product) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          product.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {product.actif ? 'Actif' : 'Inactif'}
        </span>
      )
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (product) => (
        <span className="text-sm text-gray-500">
          {new Date(product.created_at || product.date_ajout).toLocaleDateString('fr-FR')}
        </span>
      )
    }
  ];

  if (loading && allProducts.length === 0) {
    return <LoadingSpinner fullScreen text="Chargement des produits..." />;
  }

  return (
    <div>
      <PageHeader
        title="Gestion des Produits"
        subtitle="Gérez tous vos produits et leur stock"
        resultCount={filteredProducts.length}
        onRefresh={() => setRefresh(prev => prev + 1)}
        onAdd={handleAddProduct}  // ← ICI handleAddProduct est bien défini
        addLabel="Nouveau produit"
        loading={loading}
      />

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total produits" value={stats.total} icon={FiPackage} color="indigo" />
        <StatsCard title="Produits actifs" value={stats.actifs} icon={FiEye} color="green" />
        <StatsCard title="Stock total" value={stats.stockTotal} icon={FiArchive} color="blue" />
        <StatsCard title="Valeur du stock" value={formatPrice(stats.valeurStock)} icon={FiDollarSign} color="purple" />
      </div>

      {/* Filtres */}
      <SearchFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={(e) => e.preventDefault()}
        filters={filterOptions}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        placeholder="Rechercher par nom ou description..."
        resultCount={filteredProducts.length}
        resultLabel="produit(s)"
      />

      {/* Tableau */}
      <DataTable
        columns={columns}
        data={paginatedProducts}
        loading={loading}
        emptyMessage="Aucun produit trouvé"
        onView={handleViewProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={filteredProducts.length}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Modals */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
        mode={modalMode}
        categories={categories}
      />

      {viewModalOpen && selectedProduct && (
        <ProductViewModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          product={selectedProduct}
        />
      )}

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedProduct?.nom}
        itemType="produit"
      />
    </div>
  );
};

export default ProductsPage;