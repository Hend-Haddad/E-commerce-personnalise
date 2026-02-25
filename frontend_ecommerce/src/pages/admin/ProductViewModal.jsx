
import React from 'react';
import { 
  FiX, 
  FiPackage, 
  FiDollarSign, 
  FiArchive, 
  FiCalendar, 
  FiTag,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiImage
} from 'react-icons/fi';

const ProductViewModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'DTN',
      minimumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (date) => {
    if (!date) return 'Non disponible';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Construire l'URL complète de l'image
  const getImageUrl = () => {
    if (!product.image_url || product.image_url === 'default-product.jpg') {
      return '/default-product.jpg';
    }
    if (product.image_url.startsWith('http')) {
      return product.image_url;
    }
    // Si l'image est stockée localement
    return `http://localhost:5000${product.image_url}`;
  };

  const getStockStatus = () => {
    if (product.quantite_stock === 0) {
      return {
        label: 'Rupture de stock',
        color: 'text-red-600',
        bg: 'bg-red-100',
        icon: FiXCircle
      };
    }
    if (product.quantite_stock < 10) {
      return {
        label: 'Stock faible',
        color: 'text-yellow-600',
        bg: 'bg-yellow-100',
        icon: FiClock
      };
    }
    return {
      label: 'En stock',
      color: 'text-green-600',
      bg: 'bg-green-100',
      icon: FiCheckCircle
    };
  };

  const stockStatus = getStockStatus();
  const StockIcon = stockStatus.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl mx-4 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Détails du produit</h2>
            <p className="text-sm text-gray-500 mt-1">ID: {product._id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition p-2 hover:bg-gray-100 rounded-full"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Image et statut */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="md:w-1/3">
              <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center">
                {product.image_url ? (
                  <img
                    src={getImageUrl()}
                    alt={product.nom}
                    className="w-full h-48 object-contain rounded-lg"
                    
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <FiImage className="text-gray-400 text-4xl" />
                  </div>
                )}
              </div>
            </div>

            {/* Informations rapides */}
            <div className="md:w-2/3 space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-800 mb-2">Résumé</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-indigo-600">Nom</p>
                    <p className="font-medium text-gray-800">{product.nom}</p>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-600">Catégorie</p>
                    <p className="font-medium text-indigo-700">
                      {product.categorie_id?.nom || 'Non catégorisé'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-600">Prix</p>
                    <p className="font-bold text-green-600">{formatPrice(product.prix)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-600">Stock</p>
                    <div className={`flex items-center ${stockStatus.color}`}>
                      <StockIcon className="mr-1" size={16} />
                      <span className="font-medium">{product.quantite_stock} unités</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statut du stock détaillé */}
              <div className={`${stockStatus.bg} p-4 rounded-lg`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">État du stock</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                    {stockStatus.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
              <FiPackage className="mr-2 text-indigo-600" />
              Description
            </h3>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {product.description || 'Aucune description disponible'}
            </p>
          </div>

          {/* Informations détaillées */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                <FiCalendar className="mr-2 text-indigo-600" />
                Dates
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date d'ajout :</span>
                  <span className="text-sm font-medium text-gray-800">{formatDate(product.date_ajout)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Dernière modification :</span>
                  <span className="text-sm font-medium text-gray-800">{formatDate(product.date_modification)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                <FiTag className="mr-2 text-indigo-600" />
                Informations complémentaires
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Statut :</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.actif ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Slug :</span>
                  <span className="text-sm font-medium text-gray-800">{product.slug || 'Non défini'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;