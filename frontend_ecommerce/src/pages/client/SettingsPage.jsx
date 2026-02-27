// src/pages/client/SettingsPage.jsx
import React, { useState } from 'react';
import { FiBell, FiLock, FiEye, FiEyeOff, FiSave } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import ClientNavbar from '../../components/client/ClientNavbar';

import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      orderUpdates: true,
      promotions: false,
      newsletter: true
    },
    privacy: {
      showProfile: true,
      showEmail: false
    },
    password: {
      current: '',
      new: '',
      confirm: ''
    }
  });

  const handleNotificationChange = (key) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handlePrivacyChange = (key) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key]
      }
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      password: {
        ...prev.password,
        [name]: value
      }
    }));
  };

  const handleSaveNotifications = () => {
    // Logique de sauvegarde des notifications
    toast.success('Préférences de notification mises à jour');
  };

  const handleSavePrivacy = () => {
    // Logique de sauvegarde de la confidentialité
    toast.success('Paramètres de confidentialité mis à jour');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    
    // Validation
    if (!settings.password.current) {
      toast.error('Veuillez entrer votre mot de passe actuel');
      return;
    }
    
    if (settings.password.new.length < 6) {
      toast.error('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    if (settings.password.new !== settings.password.confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    // Logique de changement de mot de passe
    toast.success('Mot de passe modifié avec succès');
    
    // Réinitialiser les champs
    setSettings(prev => ({
      ...prev,
      password: { current: '', new: '', confirm: '' }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNavbar />
      
      <div className="flex">
       
        
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Paramètres</h1>

          <div className="space-y-6">
            {/* Section Notifications */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FiBell className="mr-2 text-indigo-600" />
                Notifications
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Notifications par email</p>
                    <p className="text-sm text-gray-500">Recevoir des emails pour les mises à jour</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={() => handleNotificationChange('email')}
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Mises à jour des commandes</p>
                    <p className="text-sm text-gray-500">Notifications pour le suivi des commandes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.orderUpdates}
                    onChange={() => handleNotificationChange('orderUpdates')}
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Offres promotionnelles</p>
                    <p className="text-sm text-gray-500">Recevoir des offres spéciales</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.promotions}
                    onChange={() => handleNotificationChange('promotions')}
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Newsletter</p>
                    <p className="text-sm text-gray-500">Recevoir la newsletter mensuelle</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.newsletter}
                    onChange={() => handleNotificationChange('newsletter')}
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </label>
              </div>

              <button
                onClick={handleSaveNotifications}
                className="mt-4 flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <FiSave className="mr-2" />
                Enregistrer les préférences
              </button>
            </div>

            {/* Section Confidentialité */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FiLock className="mr-2 text-indigo-600" />
                Confidentialité
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Profil public</p>
                    <p className="text-sm text-gray-500">Permettre aux autres utilisateurs de voir votre profil</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showProfile}
                    onChange={() => handlePrivacyChange('showProfile')}
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Afficher l'email</p>
                    <p className="text-sm text-gray-500">Rendre votre email visible sur votre profil</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showEmail}
                    onChange={() => handlePrivacyChange('showEmail')}
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </label>
              </div>

              <button
                onClick={handleSavePrivacy}
                className="mt-4 flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <FiSave className="mr-2" />
                Enregistrer les paramètres
              </button>
            </div>

            {/* Section Changement de mot de passe */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FiLock className="mr-2 text-indigo-600" />
                Changer le mot de passe
              </h2>
              
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="current"
                      value={settings.password.current}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-gray-400"
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="new"
                    value={settings.password.new}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirm"
                    value={settings.password.confirm}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  <FiSave className="mr-2" />
                  Changer le mot de passe
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage; // ← TRÈS IMPORTANT