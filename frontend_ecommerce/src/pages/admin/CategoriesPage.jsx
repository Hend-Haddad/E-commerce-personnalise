// src/pages/admin/CategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { categoryService } from '../../services/categoryService';
import CategoryModal from './CategoryModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [refresh, setRefresh] = useState(0); // Pour forcer le rechargement

  // Charger les catégories
  useEffect(() => {
    loadCategories();
  }, [refresh]); // Se recharge quand refresh change

  // Filtrer les catégories
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(cat => 
        cat.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      console.log('📡 Chargement des catégories...');
      const data = await categoryService.getAllCategories();
      console.log('✅ Catégories chargées:', data);
      setCategories(data.categories || []);
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
      toast.error('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleEditCategory = (category) => {
    console.log('✏️ Édition catégorie:', category);
    setSelectedCategory(category);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeleteCategory = (category) => {
    console.log('🗑️ Suppression catégorie:', category);
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      console.log('💾 Sauvegarde catégorie:', categoryData);
      
      if (modalMode === 'add') {
        await categoryService.createCategory(categoryData);
        toast.success('Catégorie créée avec succès');
      } else {
        // Mode édition
        console.log('🔄 Mise à jour catégorie ID:', selectedCategory._id);
        await categoryService.updateCategory(selectedCategory._id, categoryData);
        toast.success('Catégorie mise à jour avec succès');
      }
      
      setModalOpen(false);
      setRefresh(prev => prev + 1); // Force le rechargement
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de la sauvegarde';
      toast.error(errorMessage);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      console.log('🗑️ Confirmation suppression:', selectedCategory._id);
      
      await categoryService.deleteCategory(selectedCategory._id);
      toast.success('Catégorie désactivée avec succès');
      
      setDeleteModalOpen(false);
      setRefresh(prev => prev + 1); // Force le rechargement
      
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Catégories</h1>
          <p className="text-gray-600 mt-1">Gérez les catégories de produits de votre boutique</p>
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
            onClick={handleAddCategory}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <FiPlus className="mr-2" />
            Nouvelle catégorie
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

    

{/* Tableau des catégories */}
<div className="bg-white rounded-lg shadow overflow-hidden">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Image
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Nom
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Description
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Slug
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Date d'ajout
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {loading ? (
        <tr>
          <td colSpan="7" className="px-6 py-8 text-center">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-500">Chargement...</span>
            </div>
          </td>
        </tr>
      ) : filteredCategories.length === 0 ? (
        <tr>
          <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
            Aucune catégorie trouvée
          </td>
        </tr>
      ) : (
        filteredCategories.map((category) => {
          // Fonction pour obtenir l'URL de l'image
          const getImageUrl = () => {
            if (!category.image || category.image === 'default-category.jpg') {
              return '/default-category.jpg';
            }
            if (category.image.startsWith('http')) {
              return category.image;
            }
            return `http://localhost:5000${category.image}`;
          };

          return (
            <tr key={category._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={getImageUrl()}
                    alt={category.nom}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-category.jpg';
                    }}
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {category.nom}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs truncate">
                  {category.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {category.slug}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(category.date_ajout)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3 p-2 hover:bg-indigo-50 rounded-lg transition"
                  title="Modifier"
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition"
                  title={category.actif ? 'Désactiver' : 'Supprimer'}
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

      {/* Modal d'ajout/édition */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCategory}
        category={selectedCategory}
        mode={modalMode}
      />

      {/* Modal de confirmation de suppression */}
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