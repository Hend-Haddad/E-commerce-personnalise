import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import ClientNavbar from '../components/client/ClientNavbar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, loading, updateQuantity, removeFromCart, clearCart, checkout } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    adresse: '',
    ville: '',
    code_postal: '',
    telephone: '',
    notes: ''
  });

  // Logs détaillés pour voir l'état
  console.log('🛒 CartPage - user connecté:', user ? `OUI (${user.id})` : 'NON');
  console.log('🛒 CartPage - cart reçu:', cart);
  console.log('🛒 CartPage - items dans cart:', cart?.items);
  console.log('🛒 CartPage - itemCount:', cart?.itemCount);
  console.log('🛒 CartPage - loading:', loading);

  // Vérification du token
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    console.log('🔍 Vérification localStorage:');
    console.log('   - Token présent:', !!token);
    console.log('   - User stocké:', storedUser ? JSON.parse(storedUser) : 'non');
    
    if (token && user) {
      console.log('✅ Utilisateur authentifié avec ID:', user.id);
    }
  }, [user]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default-product.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    console.log('🔄 Changement quantité - item:', itemId, 'nouvelle quantité:', newQuantity);
    await updateQuantity(itemId, newQuantity);
  };

  const handleRemove = async (itemId) => {
    console.log('🗑️ Suppression item:', itemId);
    await removeFromCart(itemId);
  };

  const handleClearCart = async () => {
    if (cart?.items?.length === 0) return;
    if (window.confirm('Voulez-vous vraiment vider votre panier ?')) {
      console.log('🧹 Vidage du panier');
      await clearCart();
    }
  };

  const handleCheckoutClick = () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour passer commande');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    setShowCheckoutForm(true);
  };


const handleCheckoutSubmit = async (e) => {
  e.preventDefault();
  
  if (!checkoutData.adresse || !checkoutData.ville || !checkoutData.telephone) {
    toast.error('Veuillez remplir tous les champs obligatoires');
    return;
  }

  setCheckoutLoading(true);
  try {
    console.log('💰 Tentative de checkout avec données:', checkoutData);
    
    const result = await checkout({
      cartId: cart.id,
      shipping_address: {
        adresse: checkoutData.adresse,
        ville: checkoutData.ville,
        code_postal: checkoutData.code_postal,
        telephone: checkoutData.telephone
      },
      notes: checkoutData.notes
      // ✅ PLUS BESOIN DE payment_method
    });

    if (result?.success) {
      toast.success('Commande créée avec succès (paiement à la livraison) !');
      setTimeout(() => navigate('/client/orders'), 2000);
    } else {
      toast.error(result?.message || 'Erreur lors de la création de la commande');
    }
  } catch (error) {
    console.error('❌ Erreur checkout:', error);
    toast.error('Erreur lors de la création de la commande');
  } finally {
    setCheckoutLoading(false);
    setShowCheckoutForm(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {user ? <ClientNavbar /> : <Navbar />}
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // Sécuriser l'accès aux propriétés du panier
  const items = cart?.items || [];
  const itemCount = cart?.itemCount || 0;
  const subtotal = cart?.total || 0;
  const shipping = subtotal > 140 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? <ClientNavbar /> : <Navbar />}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 text-gray-600 hover:text-indigo-600"
          >
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Mon Panier</h1>
          {!user && (
            <span className="ml-4 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
              Panier temporaire
            </span>
          )}
          {user && items.length === 0 && (
            <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              Connecté en tant que {user.email}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FiShoppingBag className="mx-auto text-gray-300 text-6xl mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Votre panier est vide
            </h2>
            <p className="text-gray-500 mb-6">
              {user 
                ? "Vous n'avez pas encore ajouté de produits à votre panier"
                : "Découvrez nos produits et ajoutez-les à votre panier"
              }
            </p>
            <Link
              to={user ? "/client" : "/"}
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Continuer mes achats
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Liste des articles */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id || item._id}
                    className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4"
                  >
                    {/* Image */}
                    <Link
                      to={`/product/${item.product?._id || item.produit?._id}`}
                      className="sm:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                    >
                      <img
                        src={getImageUrl(item.product?.images?.[0] || item.produit?.images?.[0])}
                        alt={item.product?.nom || item.produit?.nom}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/default-product.jpg';
                        }}
                      />
                    </Link>

                    {/* Infos */}
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product?._id || item.produit?._id}`}
                        className="text-lg font-semibold text-gray-800 hover:text-indigo-600"
                      >
                        {item.product?.nom || item.produit?.nom}
                      </Link>
                      
                      <p className="text-sm text-gray-500 mt-1">
                        Prix unitaire: ${item.price_unitaire || item.prix_unitaire}
                      </p>

                      {/* Stock warning */}
                      {(item.product?.quantite_stock < 5 || item.produit?.quantite_stock < 5) && (
                        <p className="text-xs text-orange-500 mt-1">
                          Plus que {item.product?.quantite_stock || item.produit?.quantite_stock} en stock
                        </p>
                      )}
                    </div>

                    {/* Quantité et prix */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.id || item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <FiMinus size={16} />
                        </button>
                        <span className="w-10 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id || item._id, item.quantity + 1)}
                          disabled={item.quantity >= (item.product?.quantite_stock || item.produit?.quantite_stock || 10)}
                          className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-indigo-600">
                          ${((item.price_unitaire || item.prix_unitaire) * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemove(item.id || item._id)}
                          className="text-red-500 hover:text-red-700 text-sm mt-1 flex items-center"
                        >
                          <FiTrash2 size={14} className="mr-1" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Bouton vider le panier */}
                {items.length > 0 && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleClearCart}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center"
                    >
                      <FiTrash2 className="mr-1" />
                      Vider le panier
                    </button>
                  </div>
                )}
              </div>

              {/* Résumé de la commande */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Résumé de la commande
                  </h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Sous-total ({itemCount} article{itemCount > 1 ? 's' : ''})</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Livraison</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-600">Gratuite</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-gray-500">
                        Livraison gratuite à partir de $140
                      </p>
                    )}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between font-bold text-gray-800">
                        <span>Total</span>
                        <span className="text-xl text-indigo-600">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!showCheckoutForm ? (
                    <button
                      onClick={handleCheckoutClick}
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
                    >
                      {user ? 'Passer la commande' : 'Se connecter pour commander'}
                    </button>
                  ) : (
                    <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                      <h3 className="font-semibold text-gray-700">Adresse de livraison</h3>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Adresse *</label>
                        <input
                          type="text"
                          value={checkoutData.adresse}
                          onChange={(e) => setCheckoutData({...checkoutData, adresse: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Ville *</label>
                          <input
                            type="text"
                            value={checkoutData.ville}
                            onChange={(e) => setCheckoutData({...checkoutData, ville: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Code postal</label>
                          <input
                            type="text"
                            value={checkoutData.code_postal}
                            onChange={(e) => setCheckoutData({...checkoutData, code_postal: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Téléphone *</label>
                        <input
                          type="tel"
                          value={checkoutData.telephone}
                          onChange={(e) => setCheckoutData({...checkoutData, telephone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Notes (optionnel)</label>
                        <textarea
                          value={checkoutData.notes}
                          onChange={(e) => setCheckoutData({...checkoutData, notes: e.target.value})}
                          rows="2"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Instructions spéciales..."
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setShowCheckoutForm(false)}
                          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={checkoutLoading}
                          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
                        >
                          {checkoutLoading ? 'Traitement...' : 'Confirmer'}
                        </button>
                      </div>
                    </form>
                  )}

                  {!user && (
                    <p className="text-xs text-center text-gray-500 mt-3">
                      <Link to="/login" className="text-indigo-600 hover:underline">
                        Connectez-vous
                      </Link>{' '}
                      pour sauvegarder votre panier et passer commande
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;