// src/pages/WishlistPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiHeart, 
  FiShoppingCart, 
  FiX,
  FiArrowLeft,
  FiLogIn,
  FiTrash2
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import Navbar from '../../components/common/Navbar';
import ClientNavbar from '../../components/client/ClientNavbar';
import Footer from '../../components/common/Footer';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    wishlist, 
    loading, 
    removeFromWishlist, 
    clearWishlist,
    getWishlistItems,
    itemCount 
  } = useWishlist();
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [addingToCart, setAddingToCart] = useState({});

  // Charger les articles au montage et quand wishlist change
  useEffect(() => {
    loadWishlistItems();
  }, [wishlist]);

  const loadWishlistItems = () => {
    if (user) {
      // Utilisateur connecté - format depuis le backend
      setItems(wishlist?.items || []);
    } else {
      // Visiteur - format depuis localStorage
      const wishlistItems = getWishlistItems();
      setItems(wishlistItems);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default-product.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Gérer les deux formats de produit
    const productId = product._id || product.productId || product.product?._id;
    const productName = product.nom || product.product?.nom || 'Produit';
    
    if (!productId) {
      console.error('❌ ID produit manquant:', product);
      toast.error('Erreur: ID produit manquant');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    try {
      const result = await addToCart(productId, 1);
      if (result?.success) {
        toast.success(`${productName} ajouté au panier`);
      }
    } catch (error) {
      console.error('❌ Erreur ajout panier:', error);
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveFromWishlist = async (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Gérer les deux formats
    const productId = item._id || item.productId || item.product?._id;
    const productName = item.nom || item.product?.nom || 'Produit';
    
    if (!productId) {
      console.error('❌ ID produit manquant:', item);
      toast.error('Erreur: ID produit manquant');
      return;
    }

    const result = await removeFromWishlist(productId, productName);
    if (result?.success) {
      // Mettre à jour la liste locale
      if (!user) {
        loadWishlistItems();
      }
    }
  };

  const handleClearWishlist = async () => {
    if (items.length === 0) return;
    
    const message = user 
      ? 'Voulez-vous vraiment vider votre liste de favoris ?'
      : 'Voulez-vous vraiment vider votre liste de favoris temporaires ?';
    
    if (window.confirm(message)) {
      await clearWishlist();
      if (!user) {
        setItems([]);
      }
    }
  };

  const handleGoBack = () => {
    if (user) {
      navigate('/client');
    } else {
      navigate('/');
    }
  };

  // Extraire les informations du produit selon le format
  const extractProductInfo = (item) => {
    if (user) {
      // Format utilisateur connecté: { product: { ... } }
      const product = item.product || item;
      return {
        id: product._id,
        nom: product.nom || 'Produit',
        prix: product.prix || 0,
        image: product.images?.[0],
        stock: product.quantite_stock || 0
      };
    } else {
      // Format visiteur: stocké directement dans localStorage
      return {
        id: item.productId || item._id,
        nom: item.nom || item.product?.nom || 'Produit',
        prix: item.prix || item.product?.prix || 0,
        image: item.image || item.product?.images?.[0],
        stock: item.quantite_stock || item.product?.quantite_stock || 0
      };
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar conditionnelle */}
      {user ? <ClientNavbar /> : <Navbar />}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={handleGoBack}
              className="mr-4 text-gray-600 hover:text-indigo-600"
            >
              <FiArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Mes Favoris</h1>
            {!user && (
              <span className="ml-4 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                Favoris temporaires
              </span>
            )}
          </div>
          
          {items.length > 0 && (
            <button
              onClick={handleClearWishlist}
              className="text-red-600 hover:text-red-800 text-sm flex items-center"
            >
              <FiTrash2 className="mr-1" size={16} />
              Vider la liste
            </button>
          )}
        </div>

        {/* Message pour les visiteurs non connectés */}
        {!user && items.length > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <FiLogIn className="text-blue-600 mt-0.5 mr-3" size={20} />
              <div>
                <p className="text-blue-800 font-medium">Favoris temporaires</p>
                <p className="text-blue-600 text-sm">
                  <Link to="/login" className="underline font-medium">Connectez-vous</Link> pour sauvegarder vos favoris et les retrouver sur tous vos appareils.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Message pour les utilisateurs connectés sans favoris */}
        {user && items.length === 0 && (
          <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-gray-600">
              Vous n'avez pas encore de favoris. 
              <Link to="/client" className="text-indigo-600 hover:underline ml-1">
                Découvrir des produits
              </Link>
            </p>
          </div>
        )}

        {/* Liste des favoris */}
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FiHeart className="mx-auto text-gray-300 text-6xl mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Votre liste de favoris est vide
            </h2>
            <p className="text-gray-500 mb-6">
              Découvrez nos produits et ajoutez-les à vos favoris
            </p>
            <Link
              to={user ? "/client" : "/products"}
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, index) => {
              const product = extractProductInfo(item);
              const productId = product.id;
              const productName = product.nom;
              const productPrice = product.prix;
              const productImage = product.image;
              const productStock = product.stock;
              
              // Clé unique pour chaque élément
              const itemKey = productId || `wishlist-item-${index}`;
              
              return (
                <div
                  key={itemKey}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group relative"
                >
                  <Link to={`/product/${productId}`}>
                    <div className="relative bg-gray-100 h-48 overflow-hidden">
                      <img
                        src={getImageUrl(productImage)}
                        alt={productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.target.src = '/default-product.jpg';
                        }}
                      />
                      
                      {/* Bouton supprimer */}
                      <button
                        onClick={(e) => handleRemoveFromWishlist(item, e)}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition z-10"
                        title="Retirer des favoris"
                      >
                        <FiX size={16} />
                      </button>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 hover:text-indigo-600 line-clamp-2">
                        {productName}
                      </h3>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl font-bold text-indigo-600">
                          ${typeof productPrice === 'number' ? productPrice.toFixed(2) : '0.00'}
                        </span>
                      </div>

                      {/* Stock indicator */}
                      {productStock === 0 ? (
                        <p className="text-xs text-red-500 mb-2">Rupture de stock</p>
                      ) : productStock < 5 ? (
                        <p className="text-xs text-orange-500 mb-2">
                          Plus que {productStock} en stock
                        </p>
                      ) : null}

                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={productStock === 0 || addingToCart[productId]}
                        className={`w-full flex items-center justify-center px-3 py-2 rounded-lg transition ${
                          productStock > 0
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {addingToCart[productId] ? (
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <>
                            <FiShoppingCart className="mr-2" size={16} />
                            Ajouter au panier
                          </>
                        )}
                      </button>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Résumé pour les visiteurs */}
        {!user && items.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Vous avez {items.length} article{items.length > 1 ? 's' : ''} dans vos favoris temporaires.</p>
            <p className="mt-1">
              <Link to="/login" className="text-indigo-600 hover:underline">
                Connectez-vous
              </Link> pour les sauvegarder définitivement.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;