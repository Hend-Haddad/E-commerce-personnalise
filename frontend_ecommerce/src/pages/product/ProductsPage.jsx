// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { productService } from '../../services/productService';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { categoryService } from '../../services/categoryService';
import ProductCard from '../../ui/ProductCard';


const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'recent'
  });

  // Récupérer la catégorie sélectionnée depuis l'URL
  const selectedCategoryId = searchParams.get('category') || '';

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('❌ Erreur chargement catégories:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.categorie = filters.category;
      if (filters.minPrice) params.minPrix = filters.minPrice;
      if (filters.maxPrice) params.maxPrix = filters.maxPrice;
      if (filters.sort) params.sort = filters.sort;

      console.log('📡 Chargement produits avec filtres:', params);
      const data = await productService.getAllProducts(params);
      setProducts(data.products || []);
    } catch (error) {
      console.error('❌ Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    
    // Mettre à jour l'URL
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange({ target: { name: 'search', value: filters.search } });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'recent'
    });
    setSearchParams({});
  };

  // Trouver la catégorie sélectionnée
  const selectedCategory = categories.find(c => c._id === selectedCategoryId);

  // Fonction pour obtenir l'URL de l'image
  const getCategoryImageUrl = (imagePath) => {
    if (!imagePath || imagePath === 'default-category.jpg') {
      return '/default-category.jpg';
    }
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec catégorie sélectionnée */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {selectedCategory ? selectedCategory.nom : 'Tous nos produits'}
          </h1>
          {selectedCategory && (
            <p className="text-gray-600 mt-2">
              Découvrez tous nos produits dans la catégorie {selectedCategory.nom}
            </p>
          )}
        </div>

        {/* Barre de recherche et filtres pour mobile */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            <FiFilter />
            <span>{showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar des filtres */}
          <aside className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Filtres</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Réinitialiser
                </button>
              </div>

              {/* Recherche */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rechercher
                </label>
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    placeholder="Nom du produit..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <button type="submit" className="absolute right-2 top-2 text-gray-400 hover:text-indigo-600">
                    <FiSearch />
                  </button>
                </form>
              </div>

              {/* Catégories avec images */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégories
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => handleFilterChange({ target: { name: 'category', value: '' } })}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      !filters.category ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    Toutes les catégories
                  </button>
                  {categories.map(category => (
                    <button
                      key={category._id}
                      onClick={() => handleFilterChange({ target: { name: 'category', value: category._id } })}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition ${
                        filters.category === category._id ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      <img
                        src={getCategoryImageUrl(category.image)}
                        alt={category.nom}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <span className="text-sm">{category.nom}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prix min/max */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Tri */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trier par
                </label>
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="recent">Plus récents</option>
                  <option value="prix_asc">Prix croissant</option>
                  <option value="prix_desc">Prix décroissant</option>
                  <option value="nom_asc">Nom A-Z</option>
                  <option value="nom_desc">Nom Z-A</option>
                </select>
              </div>

              {/* Résumé des filtres actifs */}
              {(filters.search || filters.minPrice || filters.maxPrice || filters.category) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Filtres actifs:</p>
                  <div className="flex flex-wrap gap-2">
                    {filters.category && (
                      <span className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">
                        {categories.find(c => c._id === filters.category)?.nom || 'Catégorie'}
                      </span>
                    )}
                    {filters.search && (
                      <span className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">
                        "{filters.search}"
                      </span>
                    )}
                    {(filters.minPrice || filters.maxPrice) && (
                      <span className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">
                        {filters.minPrice || '0'} - {filters.maxPrice || '∞'} DT
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Liste des produits */}
          <div className="lg:w-3/4">
            {/* En-tête des résultats */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-600">
                {loading ? 'Chargement...' : `${products.length} produit(s) trouvé(s)`}
              </p>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="lg:hidden px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="recent">Plus récents</option>
                <option value="prix_asc">Prix croissant</option>
                <option value="prix_desc">Prix décroissant</option>
              </select>
            </div>

            {/* Grille de produits */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-2">Aucun produit trouvé</p>
                <button
                  onClick={clearFilters}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
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

export default ProductsPage;