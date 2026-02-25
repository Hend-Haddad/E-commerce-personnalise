// src/pages/admin/ProductsPage.jsx
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
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import ProductModal from './ProductModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
  const [stats, setStats] = useState({
    total: 0,
    actifs: 0,
    stockTotal: 0,
    valeurStock: 0
  });

  // Charger les produits et catégories
  useEffect(() => {
    loadData();
  }, [refresh]);

  // Filtrer les produits
  useEffect(() => {
    let filtered = [...products];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (selectedCategory) {
      filtered = filtered.filter(p => p.categorie_id?._id === selectedCategory);
    }

    // Filtre par statut
    if (selectedStatus === 'actif') {
      filtered = filtered.filter(p => p.actif);
    } else if (selectedStatus === 'inactif') {
      filtered = filtered.filter(p => !p.actif);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, selectedStatus, products]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Charger les produits
      const productsData = await productService.getAllProducts();
      setProducts(productsData.products || []);
      
      // Calculer les statistiques
      const actifs = productsData.products?.filter(p => p.actif) || [];
      const stockTotal = productsData.products?.reduce((acc, p) => acc + (p.quantite_stock || 0), 0) || 0;
      const valeurStock = productsData.products?.reduce((acc, p) => acc + ((p.prix || 0) * (p.quantite_stock || 0)), 0) || 0;
      
      setStats({
        total: productsData.products?.length || 0,
        actifs: actifs.length,
        stockTotal,
        valeurStock
      });

      // Charger les catégories pour le filtre
      const categoriesData = await categoryService.getAllCategories();
      setCategories(categoriesData.categories || []);

    } catch (error) {
      console.error('❌ Erreur chargement:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'DTN',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Rupture', color: 'bg-red-100 text-red-800' };
    if (stock < 10) return { label: 'Stock faible', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'En stock', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Produits</h1>
          <p className="text-gray-600 mt-1">Gérez tous vos produits et leur stock</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setRefresh(prev => prev + 1)}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            title="Rafraîchir"
          >
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button
            onClick={handleAddProduct}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <FiPlus className="mr-2" />
            Nouveau produit
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total produits</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <FiPackage className="text-indigo-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Produits actifs</p>
              <p className="text-2xl font-bold text-green-600">{stats.actifs}</p>
            </div>
            <FiEye className="text-green-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Stock total</p>
              <p className="text-2xl font-bold text-blue-600">{stats.stockTotal}</p>
            </div>
            <FiArchive className="text-blue-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Valeur du stock</p>
              <p className="text-2xl font-bold text-purple-600">{formatPrice(stats.valeurStock)}</p>
            </div>
            <FiDollarSign className="text-purple-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Nom ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Filtre par catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.nom}</option>
              ))}
            </select>
          </div>

          {/* Filtre par statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="tous">Tous</option>
              <option value="actif">Actifs</option>
              <option value="inactif">Inactifs</option>
            </select>
          </div>
        </div>
      </div>



{/* Tableau des produits */}
<div className="bg-white rounded-lg shadow overflow-hidden">
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {loading ? (
          <tr>
            <td colSpan="8" className="px-6 py-8 text-center">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-gray-500">Chargement...</span>
              </div>
            </td>
          </tr>
        ) : filteredProducts.length === 0 ? (
          <tr>
            <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
              Aucun produit trouvé
            </td>
          </tr>
        ) : (
          filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.quantite_stock);
            
            // ✅ Fonction pour obtenir l'image à afficher dans la liste
            const getDisplayImage = () => {
              // Priorité à l'image principale
              if (product.image_principale && product.image_principale !== 'default-product.jpg') {
                return product.image_principale.startsWith('http') 
                  ? product.image_principale 
                  : `http://localhost:5000${product.image_principale}`;
              }
              
              // Sinon, prendre la première image du tableau images
              if (product.images && product.images.length > 0) {
                const firstImage = product.images[0];
                return firstImage.startsWith('http') 
                  ? firstImage 
                  : `http://localhost:5000${firstImage}`;
              }
              
              // Sinon, image par défaut
              return '/default-product.jpg';
            };

            return (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={getDisplayImage()}
                      alt={product.nom}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('❌ Erreur chargement image:', product.image_principale);
                        e.target.onerror = null; // Évite la boucle infinie
                        e.target.src = '/default-product.jpg';
                      }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{product.nom}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {product.description?.substring(0, 50)}...
                  </div>
                  {/* Indicateur du nombre d'images */}
                  {product.images && product.images.length > 1 && (
                    <div className="text-xs text-indigo-600 mt-1">
                      +{product.images.length - 1} autres images
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                    {product.categorie_id?.nom || 'Non catégorisé'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">{formatPrice(product.prix)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
                    {product.quantite_stock} {stockStatus.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.actif ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(product.date_ajout).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewProduct(product)}
                    className="text-gray-600 hover:text-gray-900 mr-2 p-2 hover:bg-gray-100 rounded-lg transition"
                    title="Voir détails"
                  >
                    <FiEye size={18} />
                  </button>
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2 p-2 hover:bg-indigo-50 rounded-lg transition"
                    title="Modifier"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product)}
                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition"
                    title={product.actif ? 'Désactiver' : 'Supprimer'}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
    <div className="text-sm text-gray-500">
      Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredProducts.length}</span> sur <span className="font-medium">{products.length}</span> produits
    </div>
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

      {/* Modal d'ajout/édition */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
        mode={modalMode}
        categories={categories}
      />

      {/* Modal de consultation */}
      {viewModalOpen && selectedProduct && (
        <ProductViewModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          product={selectedProduct}
        />
      )}

      {/* Modal de confirmation de suppression */}
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