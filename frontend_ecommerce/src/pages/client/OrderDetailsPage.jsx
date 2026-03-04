// src/pages/client/OrderDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiPackage, 
  FiArrowLeft,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiCreditCard,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import ClientNavbar from '../../components/client/ClientNavbar';
import Footer from '../../components/common/Footer';
import { orderService } from '../../services/orderService';
import toast from 'react-hot-toast';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(id);
      
      if (response?.success) {
        setOrder(response.order);
      } else {
        toast.error('Commande non trouvée');
        navigate('/client/orders');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      toast.error('Erreur lors du chargement');
      navigate('/client/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Voulez-vous vraiment annuler cette commande ?')) {
      return;
    }

    setCancelling(true);
    try {
      const response = await orderService.cancelOrder(id);
      
      if (response?.success) {
        toast.success('Commande annulée avec succès');
        await loadOrderDetails(); // Recharger les détails
      } else {
        toast.error(response?.message || 'Erreur lors de l\'annulation');
      }
    } catch (error) {
      console.error('❌ Erreur annulation:', error);
      toast.error('Erreur lors de l\'annulation');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      'en_attente': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FiClock, label: 'En attente' },
      'confirmée': { bg: 'bg-blue-100', text: 'text-blue-800', icon: FiCheckCircle, label: 'Confirmée' },
      'en_préparation': { bg: 'bg-purple-100', text: 'text-purple-800', icon: FiPackage, label: 'En préparation' },
      'expédiée': { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: FiTruck, label: 'Expédiée' },
      'livrée': { bg: 'bg-green-100', text: 'text-green-800', icon: FiCheckCircle, label: 'Livrée' },
      'annulée': { bg: 'bg-red-100', text: 'text-red-800', icon: FiXCircle, label: 'Annulée' }
    };
    return config[status] || config['en_attente'];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (!order) return null;

  const statusBadge = getStatusBadge(order.statut);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/client/orders')}
              className="mr-4 text-gray-600 hover:text-indigo-600"
            >
              <FiArrowLeft size={24} />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Détails de la commande
            </h1>
          </div>
          
          {order.statut === 'en_attente' && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400"
            >
              {cancelling ? 'Annulation...' : 'Annuler la commande'}
            </button>
          )}
        </div>

        {/* Informations principales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne de gauche - Détails de la commande */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statut et numéro */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">N° de commande</p>
                  <p className="text-xl font-bold text-gray-800">
                    {order.numéro_de_commande || order.order_number}
                  </p>
                </div>
                <div className={`flex items-center px-4 py-2 rounded-full ${statusBadge.bg}`}>
                  <StatusIcon className={`mr-2 ${statusBadge.text}`} size={20} />
                  <span className={`font-medium ${statusBadge.text}`}>
                    {statusBadge.label}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Date de commande</p>
                  <p className="font-medium text-gray-800">
                    {formatDate(order.créé_à || order.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Mode de paiement</p>
                  <p className="font-medium text-gray-800 flex items-center">
                    <FiCreditCard className="mr-1" />
                    {order.mode_de_paiement === 'livraison' 
                      ? 'Paiement à la livraison' 
                      : order.mode_de_paiement || 'Non spécifié'}
                  </p>
                </div>
              </div>
            </div>

            {/* Articles commandés */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Articles commandés
              </h2>
              
              <div className="space-y-4">
                {(order.articles || order.items || []).map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image_produit || item.product_image || '/default-product.jpg'}
                        alt={item.nom_produit || item.product_name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/default-product.jpg'; }}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <Link 
                        to={`/product/${item.id_produit || item.product_id}`}
                        className="font-semibold text-gray-800 hover:text-indigo-600"
                      >
                        {item.nom_produit || item.product_name}
                      </Link>
                      <p className="text-sm text-gray-600">
                        Quantité: {item.quantite || item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Prix unitaire: ${(item.prix_au_moment || item.price_at_time).toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-indigo-600">
                        ${((item.prix_au_moment || item.price_at_time) * (item.quantite || item.quantity)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne de droite - Résumé et livraison */}
          <div className="space-y-6">
            {/* Résumé des montants */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Résumé
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>${order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frais de livraison</span>
                  <span>
                    {order.frais_de_livraison === 0 || order.shipping_cost === 0
                      ? <span className="text-green-600">Gratuit</span>
                      : `$${(order.frais_de_livraison || order.shipping_cost || 0).toFixed(2)}`
                    }
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-xl text-indigo-600">
                      ${order.total?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Adresse de livraison */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FiMapPin className="mr-2" />
                Adresse de livraison
              </h2>
              
              <div className="space-y-2 text-gray-700">
                <p className="font-medium">
                  {order.adresse_de_livraison?.adresse || order.shipping_address?.adresse}
                </p>
                <p>
                  {order.adresse_de_livraison?.ville || order.shipping_address?.ville}
                  {order.adresse_de_livraison?.code_postal && 
                    `, ${order.adresse_de_livraison.code_postal}`}
                </p>
                <p className="flex items-center">
                  <FiPhone className="mr-2 text-gray-400" size={14} />
                  {order.adresse_de_livraison?.telephone || order.shipping_address?.telephone}
                </p>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Notes
                </h2>
                <p className="text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetailsPage;