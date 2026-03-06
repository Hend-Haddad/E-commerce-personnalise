// src/pages/admin/ClientDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiShoppingBag,
  FiDollarSign,
  FiEdit,
  FiUserCheck,
  FiUserX,
  FiPackage
} from 'react-icons/fi';
import { adminClientService } from '../../services/adminClientService';
import toast from 'react-hot-toast';

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    try {
      setLoading(true);
      const data = await adminClientService.getClientById(id);
      setClient(data.client);
      setOrders(data.orders || []);
      setStats(data.stats || {});
      setFormData({
        nom: data.client.nom,
        prenom: data.client.prenom,
        telephone: data.client.telephone || '',
        adresse: data.client.adresse || '',
        actif: data.client.actif
      });
    } catch (error) {
      console.error('❌ Erreur chargement client:', error);
      toast.error('Erreur lors du chargement du client');
      navigate('/admin/clients');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const result = await adminClientService.updateClient(id, formData);
      if (result?.success) {
        toast.success('Client mis à jour avec succès');
        setIsEditing(false);
        loadClient();
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleToggleStatus = async () => {
    try {
      const result = await adminClientService.toggleClientStatus(id, !client.actif);
      if (result?.success) {
        toast.success(`Client ${!client.actif ? 'activé' : 'désactivé'}`);
        loadClient();
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      toast.error('Erreur lors du changement de statut');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'TND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!client) return null;

  return (
    <div>
      {/* En-tête */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/clients')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {client.prenom} {client.nom}
            </h1>
            
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FiEdit className="mr-2" />
            Modifier
          </button>

          <button
            onClick={handleToggleStatus}
            className={`flex items-center px-4 py-2 rounded-lg text-white ${
              client.actif 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {client.actif ? (
              <>
                <FiUserX className="mr-2" />
                Désactiver
              </>
            ) : (
              <>
                <FiUserCheck className="mr-2" />
                Activer
              </>
            )}
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total commandes</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.total_commandes || 0}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <FiShoppingBag className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total dépensé</p>
              <p className="text-2xl font-bold text-green-600">
                {formatPrice(stats.total_depense || 0)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiDollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dernier achat</p>
              <p className="text-lg font-semibold text-gray-800">
                {stats.dernier_achat ? formatDate(stats.dernier_achat) : 'Jamais'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiCalendar className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire d'édition ou informations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {isEditing ? 'Modifier les informations' : 'Informations client'}
            </h2>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <textarea
                    value={formData.adresse}
                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <FiUser className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Nom complet</p>
                    <p className="font-medium">{client.prenom} {client.nom}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FiMail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a href={`mailto:${client.email}`} className="font-medium text-indigo-600 hover:underline">
                      {client.email}
                    </a>
                  </div>
                </div>

                {client.telephone && (
                  <div className="flex items-center">
                    <FiPhone className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Téléphone</p>
                      <a href={`tel:${client.telephone}`} className="font-medium">
                        {client.telephone}
                      </a>
                    </div>
                  </div>
                )}

                {client.adresse && (
                  <div className="flex items-start">
                    <FiMapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Adresse</p>
                      <p className="font-medium">{client.adresse}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Inscription</p>
                    <p className="font-medium">{formatDate(client.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-5 h-5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Statut</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      client.actif 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {client.actif ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dernières commandes */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiPackage className="mr-2 text-indigo-600" />
              Dernières commandes
            </h2>

            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucune commande</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Link
                    key={order._id}
                    to={`/admin/orders/${order._id}`}
                    className="block p-3 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-indigo-600">{order.order_number}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'livrée' ? 'bg-green-100 text-green-800' :
                        order.status === 'annulée' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-indigo-600 mt-2">
                      {formatPrice(order.total)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;