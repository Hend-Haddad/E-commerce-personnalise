// src/pages/admin/OrderDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiArrowLeft,
  FiPackage,
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiPrinter
} from 'react-icons/fi';
import { adminOrderService } from '../../services/adminOrderService';
import toast from 'react-hot-toast';

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await adminOrderService.getOrderById(id);
      setOrder(data.order);
    } catch (error) {
      console.error('❌ Erreur chargement commande:', error);
      toast.error('Erreur lors du chargement de la commande');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const result = await adminOrderService.updateOrderStatus(id, newStatus);
      if (result?.success) {
        toast.success(`Statut mis à jour : ${getStatusLabel(newStatus)}`);
        loadOrder(); // Recharger
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
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

  const getStatusLabel = (status) => {
    const labels = {
      'en_attente': 'En attente',
      'confirmée': 'Confirmée',
      'en_préparation': 'En préparation',
      'expédiée': 'Expédiée',
      'livrée': 'Livrée',
      'annulée': 'Annulée'
    };
    return labels[status] || status;
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'TND'
    }).format(price);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default-product.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!order) return null;

  const statusBadge = getStatusBadge(order.status);
  const StatusIcon = statusBadge.icon;

  const nextStatuses = {
    'en_attente': ['confirmée', 'annulée'],
    'confirmée': ['en_préparation', 'annulée'],
    'en_préparation': ['expédiée', 'annulée'],
    'expédiée': ['livrée', 'annulée'],
    'livrée': [],
    'annulée': []
  }[order.status] || [];

  return (
    <div>
      {/* En-tête */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/orders')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Commande {order.order_number}
            </h1>
            <p className="text-gray-500">
              Créée le {formatDate(order.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.print()}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FiPrinter className="mr-2" />
            Imprimer
          </button>

          <div className={`flex items-center px-4 py-2 rounded-lg ${statusBadge.bg}`}>
            <StatusIcon className={`mr-2 ${statusBadge.text}`} size={20} />
            <span className={`font-medium ${statusBadge.text}`}>
              {statusBadge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      {nextStatuses.length > 0 && (
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <h2 className="text-sm font-medium text-gray-700 mb-3">Mettre à jour le statut</h2>
          <div className="flex flex-wrap gap-3">
            {nextStatuses.map(status => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={updating}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
              >
                {updating ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                ) : null}
                Marquer comme {getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne de gauche - Détails de la commande */}
        <div className="lg:col-span-2 space-y-6">
          {/* Articles commandés */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiPackage className="mr-2 text-indigo-600" />
              Articles commandés
            </h2>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-0">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getImageUrl(item.product_image)}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/default-product.jpg'; }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {item.product_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantité: {item.quantity} × {formatPrice(item.price_at_time)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-indigo-600">
                      {formatPrice(item.price_at_time * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totaux */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Sous-total</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Frais de livraison</span>
                <span>
                  {order.shipping_cost === 0 ? 'Gratuit' : formatPrice(order.shipping_cost)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 text-lg mt-2 pt-2 border-t">
                <span>Total</span>
                <span className="text-indigo-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne de droite - Informations client et livraison */}
        <div className="space-y-6">
          {/* Informations client */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiUser className="mr-2 text-indigo-600" />
              Client
            </h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nom complet</p>
                <p className="font-medium">
                  {order.user_id?.prenom} {order.user_id?.nom}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 flex items-center">
                  <FiMail className="mr-1" size={14} />
                  Email
                </p>
                <a href={`mailto:${order.user_id?.email}`} className="font-medium text-indigo-600 hover:underline">
                  {order.user_id?.email}
                </a>
              </div>
              
              {order.user_id?.telephone && (
                <div>
                  <p className="text-sm text-gray-600 flex items-center">
                    <FiPhone className="mr-1" size={14} />
                    Téléphone
                  </p>
                  <a href={`tel:${order.user_id.telephone}`} className="font-medium">
                    {order.user_id.telephone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Adresse de livraison */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiMapPin className="mr-2 text-indigo-600" />
              Adresse de livraison
            </h2>
            
            <div className="space-y-2">
              <p className="font-medium">{order.shipping_address.adresse}</p>
              <p>
                {order.shipping_address.ville}
                {order.shipping_address.code_postal && `, ${order.shipping_address.code_postal}`}
              </p>
              <p className="flex items-center">
                <FiPhone className="mr-2 text-gray-400" size={14} />
                {order.shipping_address.telephone}
              </p>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 flex items-center">
                  <FiCalendar className="mr-1" size={14} />
                  Date de commande
                </p>
                <p className="font-medium">{formatDate(order.created_at)}</p>
              </div>
              
              {order.delivered_at && (
                <div>
                  <p className="text-sm text-gray-600 flex items-center">
                    <FiCheckCircle className="mr-1" size={14} />
                    Date de livraison
                  </p>
                  <p className="font-medium">{formatDate(order.delivered_at)}</p>
                </div>
              )}
              
              {order.notes && (
                <div>
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg mt-1">
                    {order.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;