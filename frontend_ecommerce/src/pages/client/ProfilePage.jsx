// src/pages/client/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiLoader, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../services/authService';
import ClientNavbar from '../../components/client/ClientNavbar';
import AdminNavbar from '../../components/admin/AdminNavbar'; // Si vous avez un navbar admin
import Navbar from '../../components/common/Navbar';

import AdminSidebar from '../../components/admin/AdminSidebar';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    adresse: user?.adresse || ''
  });

  // Déterminer quel navbar afficher selon le rôle
  const getNavbar = () => {
    if (!user) return <Navbar />;
    if (user.role === 'admin') return <AdminNavbar />;
    if (user.role === 'client') return <ClientNavbar />;
    return <Navbar />;
  };

  // Déterminer quelle sidebar afficher selon le rôle
  const getSidebar = () => {
    if (!user) return null;
    if (user.role === 'admin') return <AdminSidebar />;
   
    return null;
  };

  // Titre de la page selon le rôle
  const getPageTitle = () => {
    if (!user) return "Profil";
    if (user.role === 'admin') return "Profil Administrateur";
    if (user.role === 'client') return "Mon Profil Client";
    return "Profil";
  };

  // Bouton de retour selon le rôle
  const handleGoBack = () => {
    if (!user) navigate('/');
    if (user?.role === 'admin') navigate('/admin');
    if (user?.role === 'client') navigate('/client');
  };

  useEffect(() => {
    if (user) {
      setProfileData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        adresse: user.adresse || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!profileData.nom.trim()) {
      toast.error('Le nom ne peut pas être vide');
      return false;
    }
    if (!profileData.prenom.trim()) {
      toast.error('Le prénom ne peut pas être vide');
      return false;
    }
    if (!profileData.telephone.trim()) {
      toast.error('Le téléphone ne peut pas être vide');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await updateProfile({
        nom: profileData.nom,
        prenom: profileData.prenom,
        telephone: profileData.telephone,
        adresse: profileData.adresse
      });

      if (response.success) {
        updateUser(response.user);
        toast.success('Profil mis à jour avec succès');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      nom: user?.nom || '',
      prenom: user?.prenom || '',
      email: user?.email || '',
      telephone: user?.telephone || '',
      adresse: user?.adresse || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar selon le rôle */}
      {getNavbar()}
      
      <div className="flex">
        {/* Sidebar selon le rôle (pour les utilisateurs connectés) */}
        {user && getSidebar()}
        
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            {/* Bouton retour */}
            <button
              onClick={handleGoBack}
              className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition"
            >
              <FiArrowLeft className="mr-2" />
              Retour
            </button>

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{getPageTitle()}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {user?.role === 'admin' ? 'Espace administrateur' : 'Espace client'}
                </p>
              </div>
              
              <div className="flex space-x-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    <FiEdit2 className="mr-2" />
                    Modifier
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      disabled={loading}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-green-400 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <FiLoader className="animate-spin mr-2" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-2" />
                          Enregistrer
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* Avatar avec badge de rôle */}
              <div className="flex justify-center mb-8 relative">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold">
                  {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                </div>
                {user && (
                  <span className={`absolute bottom-0 right-1/2 transform translate-x-12 px-2 py-1 text-xs rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role === 'admin' ? 'Admin' : 'Client'}
                  </span>
                )}
              </div>

              {/* Profile Fields */}
              <div className="space-y-6">
                {/* Nom complet */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      value={profileData.prenom}
                      onChange={handleChange}
                      disabled={!isEditing || loading}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                        isEditing 
                          ? 'bg-white border-gray-300' 
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={profileData.nom}
                      onChange={handleChange}
                      disabled={!isEditing || loading}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                        isEditing 
                          ? 'bg-white border-gray-300' 
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {/* Email (non modifiable) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiMail className="mr-2" /> Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled={true}
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    L'email ne peut pas être modifié
                  </p>
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiPhone className="mr-2" /> Téléphone <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={profileData.telephone}
                    onChange={handleChange}
                    disabled={!isEditing || loading}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      isEditing 
                        ? 'bg-white border-gray-300' 
                        : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                    }`}
                    placeholder="+216 00 000 000"
                  />
                </div>

                {/* Adresse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiMapPin className="mr-2" /> Adresse
                  </label>
                  <textarea
                    name="adresse"
                    value={profileData.adresse}
                    onChange={handleChange}
                    disabled={!isEditing || loading}
                    rows="3"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      isEditing 
                        ? 'bg-white border-gray-300' 
                        : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                    }`}
                    placeholder="Votre adresse complète"
                  />
                </div>

                {/* Date d'inscription */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Membre depuis le {new Date(user?.createdAt || Date.now()).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;