import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiLoader, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../services/authService';
import ClientNavbar from '../../components/client/ClientNavbar';
import Navbar from '../../components/common/Navbar';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();  // ← Maintenant updateUser existe
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

  const handleSave = async () => {
    if (!profileData.nom.trim() || !profileData.prenom.trim()) {
      toast.error('Le nom et le prénom sont requis');
      return;
    }

    setLoading(true);
    try {
      const response = await updateProfile({
        nom: profileData.nom,
        prenom: profileData.prenom,
        telephone: profileData.telephone,
        adresse: profileData.adresse
      });

      if (response.success) {
        // Mettre à jour l'utilisateur dans le contexte
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

  // Déterminer le navbar
  const NavbarComponent = !user ? Navbar : 
    (user.role === 'admin' ? ClientNavbar : ClientNavbar);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarComponent />
      
      <main className="max-w-3xl mx-auto p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition"
        >
          <FiArrowLeft className="mr-2" />
          Retour
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Mon Profil</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <FiEdit2 className="mr-2" />
                Modifier
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400"
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
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={profileData.prenom}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={profileData.nom}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                name="telephone"
                value={profileData.telephone}
                onChange={handleChange}
                disabled={!isEditing || loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <textarea
                name="adresse"
                value={profileData.adresse}
                onChange={handleChange}
                disabled={!isEditing || loading}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;