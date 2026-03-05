// src/pages/client/OrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiPackage, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiTruck,
  FiEye,
  FiArrowLeft,
  FiCalendar,
  FiCreditCard
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import ClientNavbar from '../../components/client/ClientNavbar';
import Footer from '../../components/common/Footer';
import { orderService } from '../../services/orderService';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, en_attente, livrée, annulée

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getUserOrders();
      console.log('📦 Commandes reçues:', response);
      
      if (response?.success) {
        setOrders(response.orders || []);
      } else {
        setOrders([]);
        toast.error('Erreur lors du chargement des commandes');
      }
    } catch (error) {
      console.error('❌ Erreur chargement commandes:', error);
      toast.error('Erreur lors du chargement des commandes');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les commandes selon le statut
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.statut === filter;
  });

  // Fonction pour obtenir la classe CSS du statut
  const getStatusBadge = (status) => {
    const statusConfig = {
      'en_attente': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FiClock, label: 'En attente' },
      'confirmée': { bg: 'bg-blue-100', text: 'text-blue-800', icon: FiCheckCircle, label: 'Confirmée' },
      'en_préparation': { bg: 'bg-purple-100', text: 'text-purple-800', icon: FiPackage, label: 'En préparation' },
      'expédiée': { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: FiTruck, label: 'Expédiée' },
      'livrée': { bg: 'bg-green-100', text: 'text-green-800', icon: FiCheckCircle, label: 'Livrée' },
      'annulée': { bg: 'bg-red-100', text: 'text-red-800', icon: FiXCircle, label: 'Annulée' }
    };
    return statusConfig[status] || statusConfig['en_attente'];
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ClientNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/client')}
              className="mr-4 text-gray-600 hover:text-indigo-600"
            >
              <FiArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Mes Commandes</h1>
          </div>
          
          {/* Filtres */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter('en_attente')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'en_attente' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setFilter('livrée')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'livrée' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Livrées
            </button>
          </div>
        </div>

        {/* Liste des commandes */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FiPackage className="mx-auto text-gray-300 text-6xl mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Aucune commande trouvée
            </h2>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? "Vous n'avez pas encore passé de commande"
                : "Aucune commande avec ce statut"}
            </p>
            <Link
              to="/client"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusBadge = getStatusBadge(order.status); 
              const StatusIcon = statusBadge.icon;
              
              return (
                <div
                  key={order._id || order.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  {/* En-tête de la commande */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                        <FiPackage className="text-indigo-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">N° de commande</p>
                          <p className="font-semibold text-gray-800">
                            {order.numéro_de_commande || order.order_number}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiCalendar className="mr-1" />
                          {formatDate(order.créé_à || order.created_at)}
                        </div>
                        
                        <div className={`flex items-center px-3 py-1 rounded-full ${statusBadge.bg}`}>
                          <StatusIcon className={`mr-1 ${statusBadge.text}`} size={16} />
                          <span className={`text-sm font-medium ${statusBadge.text}`}>
                            {statusBadge.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Articles de la commande */}
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      {(order.articles || order.items || []).slice(0, 2).map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image_produit || item.product_image || '/default-product.jpg'}
                              alt={item.nom_produit || item.product_name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = '/default-product.jpg'; }}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {item.nom_produit || item.product_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantité: {item.quantite || item.quantity} × $
                              {item.prix_au_moment || item.price_at_time}
                            </p>
                          </div>
                          <p className="font-semibold text-indigo-600">
                            ${((item.prix_au_moment || item.price_at_time) * (item.quantite || item.quantity)).toFixed(2)}
                          </p>
                        </div>
                      ))}
                      
                      {(order.articles || order.items || []).length > 2 && (
                        <p className="text-sm text-gray-500 text-center">
                          + {(order.articles || order.items).length - 2} autre(s) article(s)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pied de la commande */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-6 mb-2 sm:mb-0">
                        <div>
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="text-xl font-bold text-indigo-600">
                            ${order.total?.toFixed(2)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Paiement</p>
                          <p className="flex items-center text-sm text-gray-700">
                            <FiCreditCard className="mr-1" />
                            {order.mode_de_paiement === 'livraison' 
                              ? 'À la livraison' 
                              : order.mode_de_paiement || 'Non spécifié'}
                          </p>
                        </div>
                      </div>
                      
                      <Link
                        to={`/client/orders/${order._id || order.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        <FiEye className="mr-2" size={16} />
                        Détails de la commande
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrdersPage;