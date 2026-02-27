// src/pages/client/ClientHome.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiFilter, FiGrid, FiList, FiSearch, FiX } from 'react-icons/fi';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import ClientNavbar from '../../components/client/ClientNavbar';
import Footer from '../../components/common/Footer';
import ProductCard from '../../ui/ProductCard';

const ClientHome = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filtres actifs (ceux qui sont vraiment appliqués)
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  // Filtres temporaires (ceux qu'on modifie dans la sidebar avant d'appliquer)
  const [tempFilters, setTempFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  // IMPORTANT : synchronisation bidirectionnelle
  // Quand filters change (ex: depuis navbar), on met aussi à jour tempFilters
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  // Appliquer les filtres dès que filters ou products changent
  useEffect(() => {
    applyFilters();
    console.log('🔍 Filtres appliqués :', filters);
  }, [filters, products]);

  const loadData = async () => {
    try {
      console.log('📡 Chargement des données...');
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories()
      ]);
      
      setProducts(productsData.products || []);
      setFilteredProducts(productsData.products || []);
      setCategories(categoriesData.categories || []);
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    if (!products.length) return;

    let filtered = [...products];

    // Filtre catégorie
    if (filters.category) {
      filtered = filtered.filter(p => p.categorie_id?._id === filters.category);
    }

    // Filtre prix min
    if (filters.minPrice) {
      filtered = filtered.filter(p => Number(p.prix) >= Number(filters.minPrice));
    }

    // Filtre prix max
    if (filters.maxPrice) {
      filtered = filtered.filter(p => Number(p.prix) <= Number(filters.maxPrice));
    }

    // Filtre recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.nom.toLowerCase().includes(searchLower) ||
        (p.description || '').toLowerCase().includes(searchLower)
      );
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  // Appelée depuis le Navbar quand on clique sur une catégorie
  const handleCategorySelect = (categoryId) => {
    console.log('Catégorie choisie depuis navbar →', categoryId);

    const newFilters = {
      ...filters,
      category: categoryId
    };

    setFilters(newFilters);
    // Pas besoin de setTempFilters ici car le useEffect le fait automatiquement
  };

  const handleFilterChange = (key, value) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyTempFilters = () => {
    setFilters(tempFilters);
    setShowMobileFilters(false);
  };

  const clearFilters = () => {
    const empty = { category: '', minPrice: '', maxPrice: '', search: '' };
    setTempFilters(empty);
    setFilters(empty);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: tempFilters.search }));
  };

  const handleSearchFromNavbar = (term) => {
    setTempFilters(prev => ({ ...prev, search: term }));
    setFilters(prev => ({ ...prev, search: term }));
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const getCategoryImageUrl = (imagePath) => {
    if (!imagePath || imagePath === 'default-category.jpg') return '/default-category.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const selectedCategoryName = filters.category
    ? categories.find(c => c._id === filters.category)?.nom || 'Catégorie inconnue'
    : 'Toutes les catégories';

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNavbar
        onSearch={handleSearchFromNavbar}
        onCategorySelect={handleCategorySelect}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Titre + breadcrumb */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {selectedCategoryName}
          </h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
            <button onClick={() => navigate('/client')} className="hover:text-indigo-600">
              Accueil
            </button>
            <span>/</span>
            <span className="text-gray-700 font-medium">{selectedCategoryName}</span>
          </div>
        </div>

        {/* Badge filtre actif */}
        {filters.category && (
          <div className="mb-6 p-4 bg-indigo-50 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="font-medium text-indigo-800">
                Catégorie : {selectedCategoryName}
              </span>
            </div>
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, category: '' }));
                setTempFilters(prev => ({ ...prev, category: '' }));
              }}
              className="text-indigo-700 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100 transition"
            >
              <FiX size={20} />
            </button>
          </div>
        )}

        {/* En-tête produits + boutons vue/filtres */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Produits</h2>
            <p className="text-sm text-gray-600">
              {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Bascule vue grille/liste */}
            <div className="hidden sm:flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                <FiList size={18} />
              </button>
            </div>

            {/* Bouton filtres mobile */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition"
            >
              <FiFilter size={18} />
              Filtres
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR FILTRES (desktop) */}
          <aside className="hidden lg:block lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Filtres</h2>

              {/* Recherche */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={tempFilters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Nom ou description..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                    <FiSearch size={18} />
                  </button>
                </form>
              </div>

              {/* Catégories */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">Catégories</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={!tempFilters.category}
                      onChange={() => handleFilterChange('category', '')}
                      className="mr-3 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-700">Toutes les catégories</span>
                  </label>

                  {categories.map(category => (
                    <label
                      key={category._id}
                      className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category._id}
                        checked={tempFilters.category === category._id}
                        onChange={() => handleFilterChange('category', category._id)}
                        className="mr-3 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex items-center gap-2">
                        {category.image && (
                          <img
                            src={getCategoryImageUrl(category.image)}
                            alt={category.nom}
                            className="w-6 h-6 object-cover rounded"
                            onError={e => { e.target.src = '/default-category.jpg'; }}
                          />
                        )}
                        <span className="text-gray-700">{category.nom}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Prix */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">Fourchette de prix</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      placeholder="Min"
                      value={tempFilters.minPrice}
                      onChange={e => handleFilterChange('minPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max"
                      value={tempFilters.maxPrice}
                      onChange={e => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Boutons appliquer / effacer */}
              <div className="flex gap-3">
                <button
                  onClick={applyTempFilters}
                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Appliquer
                </button>
                <button
                  onClick={clearFilters}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  Effacer
                </button>
              </div>
            </div>
          </aside>

          {/* GRILLE / LISTE DES PRODUITS */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-indigo-600"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                <p className="text-gray-600 text-lg mb-3">Aucun produit ne correspond à vos critères</p>
                <p className="text-gray-500 mb-6">Essayez de modifier ou supprimer certains filtres</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'flex flex-col gap-5'
              }>
                {filteredProducts.map(product => (
                  <div
                    key={product._id}
                    onClick={() => handleProductClick(product._id)}
                    className="cursor-pointer"
                  >
                    <ProductCard product={product} layout={viewMode} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClientHome;