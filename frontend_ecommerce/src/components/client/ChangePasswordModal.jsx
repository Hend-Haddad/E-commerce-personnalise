// src/components/client/ChangePasswordModal.jsx
import React, { useState } from 'react';
import { FiX, FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { validatePassword } from '../../utils/validators'; // ← Import du validateur

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: vérification, 2: nouveau mot de passe
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateCurrentPassword = () => {
    const newErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Le mot de passe actuel est requis';
    }
    return newErrors;
  };

  const validateNewPassword = () => {
    const newErrors = {};
    
    // ✅ Utilisation du validateur de mot de passe
    if (!formData.newPassword) {
      newErrors.newPassword = 'Le nouveau mot de passe est requis';
    } else {
      const passwordValidation = validatePassword(formData.newPassword, {
        minLength: 8,
        requireUppercase: true,
        requireNumber: true,
        requireSpecial: false
      });
      
      if (!passwordValidation.isValid) {
        newErrors.newPassword = passwordValidation.message;
      }
    }

    // Validation de la confirmation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmation est requise';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    return newErrors;
  };

  const handleVerifyCurrentPassword = async () => {
    const newErrors = validateCurrentPassword();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Veuillez entrer votre mot de passe actuel');
      return;
    }

    setLoading(true);
    try {
      console.log('📡 Envoi requête vérification...');
      
      const response = await api.post('/auth/verify-password', {
        currentPassword: formData.currentPassword
      });

      console.log('📥 Réponse reçue:', response.data);

      if (response.data.valid) {
        setStep(2);
        toast.success('Mot de passe vérifié avec succès');
      } else {
        setErrors({ currentPassword: 'Mot de passe incorrect' });
        toast.error('Mot de passe actuel incorrect');
      }
    } catch (error) {
      console.error('❌ Erreur détaillée:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Erreur lors de la vérification');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    const newErrors = validateNewPassword();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Veuillez corriger les erreurs');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      toast.success('Mot de passe modifié avec succès');
      handleClose();
    } catch (error) {
      console.error('❌ Erreur changement:', error);
      toast.error(error.response?.data?.message || 'Erreur lors du changement');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    onClose();
  };

  // Fonction pour vérifier si un critère de mot de passe est rempli
  const checkPasswordCriteria = {
    minLength: formData.newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.newPassword),
    hasNumber: /[0-9]/.test(formData.newPassword)
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {step === 1 ? 'Vérification' : 'Changer le mot de passe'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800 transition"
            disabled={loading}
          >
            <FiX size={28} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-12 h-1 mx-2 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
          <span className="text-sm text-gray-500">
            {step === 1 ? 'Vérification' : 'Nouveau mot de passe'}
          </span>
        </div>

        {step === 1 ? (
          /* Étape 1 : Vérification du mot de passe actuel */
          <div className="space-y-5">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiLock className="text-indigo-600 text-2xl" />
              </div>
              <p className="text-gray-600">
                Pour des raisons de sécurité, veuillez entrer votre mot de passe actuel
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe actuel <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition ${
                    errors.currentPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Entrez votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-indigo-600"
                >
                  {showPassword.current ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
              )}
            </div>

            <button
              onClick={handleVerifyCurrentPassword}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400 font-medium flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Vérification...
                </>
              ) : (
                'Vérifier'
              )}
            </button>
          </div>
        ) : (
          /* Étape 2 : Nouveau mot de passe */
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition ${
                    errors.newPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Au moins 8 caractères"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-indigo-600"
                >
                  {showPassword.new ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition ${
                    errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Confirmez le mot de passe"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-indigo-600"
                >
                  {showPassword.confirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Password requirements avec validateur */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Le mot de passe doit contenir :</p>
              <ul className="space-y-1">
                <li className="flex items-center text-xs">
                  <FiCheckCircle className={`mr-2 ${checkPasswordCriteria.minLength ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={checkPasswordCriteria.minLength ? 'text-gray-700' : 'text-gray-400'}>
                    Au moins 8 caractères
                  </span>
                </li>
                <li className="flex items-center text-xs">
                  <FiCheckCircle className={`mr-2 ${checkPasswordCriteria.hasUppercase ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={checkPasswordCriteria.hasUppercase ? 'text-gray-700' : 'text-gray-400'}>
                    Au moins une majuscule
                  </span>
                </li>
                <li className="flex items-center text-xs">
                  <FiCheckCircle className={`mr-2 ${checkPasswordCriteria.hasNumber ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={checkPasswordCriteria.hasNumber ? 'text-gray-700' : 'text-gray-400'}>
                    Au moins un chiffre
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
                disabled={loading}
              >
                Retour
              </button>
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400 font-medium flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Changement...
                  </>
                ) : (
                  'Changer'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;