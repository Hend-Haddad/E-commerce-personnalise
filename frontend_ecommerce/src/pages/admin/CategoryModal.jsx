// src/components/admin/CategoryModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiUpload, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CategoryModal = ({ isOpen, onClose, onSave, category, mode }) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    image: null,
    imagePreview: null,
    actif: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && category) {
        console.log('📝 Modal édition - catégorie:', category);
        
        // Construire l'URL complète de l'image existante
        let imagePreview = null;
        if (category.image && category.image !== 'default-category.jpg') {
          imagePreview = category.image.startsWith('http') 
            ? category.image 
            : `http://localhost:5000${category.image}`;
        }

        setFormData({
          nom: category.nom || '',
          description: category.description || '',
          image: null,
          imagePreview: imagePreview,
          actif: category.actif !== undefined ? category.actif : true
        });
      } else {
        // Reset pour l'ajout
        setFormData({
          nom: '',
          description: '',
          image: null,
          imagePreview: null,
          actif: true
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
      }

      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        toast.error('Le fichier doit être une image');
        return;
      }

      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);

      // Effacer l'erreur d'image si elle existe
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    } else if (formData.nom.length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.length < 5) {
      newErrors.description = 'La description doit contenir au moins 5 caractères';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
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
        actif: formData.actif
      };

      // Ajouter l'image seulement si elle a été modifiée
      if (formData.image) {
        dataToSend.image = formData.image;
      }

      await onSave(dataToSend);
    } catch (error) {
      console.error('❌ Erreur modal:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'add' ? 'Nouvelle catégorie' : 'Modifier la catégorie'}
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
          {/* Upload d'image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de la catégorie
            </label>
            <div className="flex items-center space-x-4">
              {/* Prévisualisation */}
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                {formData.imagePreview ? (
                  <img 
                    src={formData.imagePreview} 
                    alt="Prévisualisation" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiImage className="text-gray-400 text-3xl" />
                )}
              </div>

              {/* Boutons d'upload */}
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  id="category-image"
                />
                <div className="flex space-x-2">
                  <label
                    htmlFor="category-image"
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
                  >
                    <FiUpload className="mr-2" />
                    {formData.imagePreview ? 'Changer' : 'Choisir'}
                  </label>
                  {formData.imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Formats acceptés : JPG, PNG, GIF, WEBP (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la catégorie <span className="text-red-600">*</span>
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
              placeholder="Ex: Électronique, Mode, Maison..."
            />
            {errors.nom && (
              <p className="mt-1 text-sm text-red-600">⚠️ {errors.nom}</p>
            )}
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
              placeholder="Décrivez cette catégorie..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">⚠️ {errors.description}</p>
            )}
          </div>

          {/* Checkbox actif – uniquement en édition */}
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
                Catégorie active
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
              {mode === 'add' ? 'Créer' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;