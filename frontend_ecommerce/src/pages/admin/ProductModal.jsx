// src/components/admin/ProductModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiUpload, FiImage, FiTrash2, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductModal = ({ isOpen, onClose, onSave, product, mode, categories }) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    categorie_id: '',
    quantite_stock: '',
    images: [], // Fichiers à uploader
    existingImages: [], // Images existantes (pour édition)
    image_principale: '',
    actif: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && product) {
        // Construire les URLs complètes des images existantes
        const existingImages = (product.images || []).map(img => 
          img.startsWith('http') ? img : `http://localhost:5000${img}`
        );

        setFormData({
          nom: product.nom || '',
          description: product.description || '',
          prix: product.prix || '',
          categorie_id: product.categorie_id?._id || product.categorie_id || '',
          quantite_stock: product.quantite_stock || '',
          images: [],
          existingImages: existingImages,
          image_principale: product.image_principale ? 
            (product.image_principale.startsWith('http') ? product.image_principale : `http://localhost:5000${product.image_principale}`)
            : (existingImages[0] || ''),
          actif: product.actif !== undefined ? product.actif : true
        });
      } else {
        setFormData({
          nom: '',
          description: '',
          prix: '',
          categorie_id: '',
          quantite_stock: '',
          images: [],
          existingImages: [],
          image_principale: '',
          actif: true
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Vérifier la taille et le type de chaque fichier
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} ne doit pas dépasser 5MB`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} doit être une image`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...validFiles]
      }));
    }

    // Reset input
    e.target.value = '';
  };

  const handleRemoveNewImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveExistingImage = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(img => img !== imageUrl),
      image_principale: prev.image_principale === imageUrl ? '' : prev.image_principale
    }));
  };

  const setAsMainImage = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      image_principale: imageUrl
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.prix) newErrors.prix = 'Le prix est requis';
    else if (isNaN(formData.prix) || formData.prix <= 0) newErrors.prix = 'Le prix doit être un nombre positif';
    if (!formData.categorie_id) newErrors.categorie_id = 'La catégorie est requise';
    if (!formData.quantite_stock && formData.quantite_stock !== 0) {
      newErrors.quantite_stock = 'La quantité est requise';
    } else if (isNaN(formData.quantite_stock) || formData.quantite_stock < 0) {
      newErrors.quantite_stock = 'La quantité doit être un nombre positif ou nul';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Veuillez corriger les erreurs');
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        nom: formData.nom,
        description: formData.description,
        prix: formData.prix,
        categorie_id: formData.categorie_id,
        quantite_stock: formData.quantite_stock,
        actif: formData.actif,
        images: formData.images
      };

      // Pour l'édition, ajouter les images existantes à conserver
      if (mode === 'edit') {
        // Convertir les URLs des images existantes en chemins relatifs
        const imagesToKeep = formData.existingImages.map(url => {
          if (url.includes('localhost:5000')) {
            return url.replace('http://localhost:5000', '');
          }
          return url;
        });
        dataToSend.imagesToKeep = imagesToKeep;
      }

      await onSave(dataToSend);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl mx-4 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'add' ? 'Nouveau produit' : 'Modifier le produit'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
            disabled={loading}
          >
            <FiX size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Upload d'images multiple */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images du produit
            </label>
            
            {/* Images existantes (pour édition) */}
            {formData.existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Images actuelles :</p>
                <div className="grid grid-cols-4 gap-3">
                  {formData.existingImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className={`aspect-square rounded-lg overflow-hidden border-2 ${
                        formData.image_principale === img ? 'border-indigo-600' : 'border-gray-200'
                      }`}>
                        <img
                          src={img}
                          alt={`Produit ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                        {formData.image_principale !== img && (
                          <button
                            type="button"
                            onClick={() => setAsMainImage(img)}
                            className="p-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            title="Définir comme image principale"
                          >
                            <FiStar size={14} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(img)}
                          className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                          title="Supprimer"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                      {formData.image_principale === img && (
                        <div className="absolute top-1 left-1 bg-indigo-600 text-white p-1 rounded text-xs">
                          Principale
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nouvelles images à uploader */}
            {formData.images.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Nouvelles images :</p>
                <div className="grid grid-cols-4 gap-3">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-green-400">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Nouvelle ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bouton d'upload */}
            <div className="flex items-center space-x-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className="hidden"
                id="product-images"
              />
              <label
                htmlFor="product-images"
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
              >
                <FiUpload className="mr-2" />
                Choisir des images
              </label>
              <p className="text-xs text-gray-500">
                Formats: JPG, PNG, GIF, WEBP (max 5MB par image)
              </p>
            </div>
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du produit <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition disabled:opacity-60 ${
                errors.nom ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ex: Smartphone XYZ Pro"
            />
            {errors.nom && <p className="mt-1 text-sm text-red-600">⚠️ {errors.nom}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              disabled={loading}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition disabled:opacity-60 ${
                errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Description détaillée du produit..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">⚠️ {errors.description}</p>}
          </div>

          {/* Prix et Catégorie */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (DT) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                name="prix"
                value={formData.prix}
                onChange={handleChange}
                disabled={loading}
                min="0"
                step="0.01"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition disabled:opacity-60 ${
                  errors.prix ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="99.99"
              />
              {errors.prix && <p className="mt-1 text-sm text-red-600">⚠️ {errors.prix}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie <span className="text-red-600">*</span>
              </label>
              <select
                name="categorie_id"
                value={formData.categorie_id}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition disabled:opacity-60 ${
                  errors.categorie_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.nom}</option>
                ))}
              </select>
              {errors.categorie_id && <p className="mt-1 text-sm text-red-600">⚠️ {errors.categorie_id}</p>}
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantité en stock <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              name="quantite_stock"
              value={formData.quantite_stock}
              onChange={handleChange}
              disabled={loading}
              min="0"
              step="1"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition disabled:opacity-60 ${
                errors.quantite_stock ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="100"
            />
            {errors.quantite_stock && <p className="mt-1 text-sm text-red-600">⚠️ {errors.quantite_stock}</p>}
          </div>

          {/* Checkbox actif */}
          {mode === 'edit' && (
            <div className="flex items-center">
              <input
                type="checkbox"
                name="actif"
                checked={formData.actif}
                onChange={handleChange}
                disabled={loading}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-3 text-sm text-gray-700 font-medium">
                Produit actif (visible dans la boutique)
              </span>
            </div>
          )}

          {/* Boutons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition disabled:opacity-60 flex items-center gap-2"
            >
              {loading && (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              )}
              {mode === 'add' ? 'Créer le produit' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;