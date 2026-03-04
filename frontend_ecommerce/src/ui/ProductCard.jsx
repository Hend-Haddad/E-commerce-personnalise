// src/ui/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

const ProductCard = ({ product, layout = 'grid' }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlistToggling, setWishlistToggling] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Vérifier si le produit est dans les favoris (uniquement si connecté)
  useEffect(() => {
    if (user && product?._id) {
      setIsWishlisted(isInWishlist(product._id));
    }
  }, [user, product._id, isInWishlist]);

  const getImageUrl = () => {
    if (!product.images || product.images.length === 0) {
      return '/default-product.jpg';
    }
    const image = product.images[0];
    if (image.startsWith('http')) return image;
    return `http://localhost:5000${image}`;
  };

  const calculateDiscount = () => {
    if (product.oldPrice && product.oldPrice > product.prix) {
      const discount = ((product.oldPrice - product.prix) / product.oldPrice * 100).toFixed(0);
      return `-${discount}%`;
    }
    return null;
  };

  const discount = calculateDiscount();

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  // 🛒 ADD TO CART - ACCESSIBLE À TOUS (visiteurs et connectés)
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    // Vérification du stock uniquement, pas de vérification de connexion
    if (product.quantite_stock === 0) {
      toast.error('Produit en rupture de stock');
      return;
    }

    setAddingToCart(true);
    try {
      console.log('🛒 Ajout au panier - produit:', product._id);
      const result = await addToCart(product._id, 1);
      
      if (result?.success) {
        toast.success('Produit ajouté au panier');
      } else {
        // Si l'utilisateur n'est pas connecté, le panier sera en session
        toast.success('Produit ajouté au panier (temporaire)');
      }
    } catch (error) {
      console.error('❌ Erreur ajout panier:', error);
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setAddingToCart(false);
    }
  };

  // ❤️ TOGGLE WISHLIST - UNIQUEMENT POUR UTILISATEURS CONNECTÉS
  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter aux favoris');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    setWishlistToggling(true);
    try {
      const result = await toggleWishlist(product, product._id);
      if (result?.success) {
        setIsWishlisted(!isWishlisted);
      }
    } catch (error) {
      console.error('❌ Erreur toggle favoris:', error);
      toast.error("Erreur lors de la modification des favoris");
    } finally {
      setWishlistToggling(false);
    }
  };

  // Vue grille (par défaut)
  if (layout === 'grid') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group relative cursor-pointer">
        <div onClick={handleCardClick}>
          {/* Discount Badge */}
          {discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
              {discount}
            </div>
          )}

          {/* Product Image */}
          <div className="relative bg-gray-100 h-48 overflow-hidden">
            <img
              src={getImageUrl()}
              alt={product.nom}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              onError={(e) => {
                e.target.src = '/default-product.jpg';
              }}
            />
            
            {/* Quick View Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <FiEye className="text-white text-2xl" />
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-2 hover:text-indigo-600 line-clamp-2">
              {product.nom}
            </h3>

            {/* Price */}
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl font-bold text-indigo-600">
                ${product.prix}
              </span>
              {product.oldPrice && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ${product.oldPrice}
                  </span>
                  <span className="text-xs text-green-600 font-semibold">
                    {discount}
                  </span>
                </>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-1 mb-3">
              <div className="flex text-yellow-400">
                {'★'.repeat(product.rating || 4)}
                {'☆'.repeat(5 - (product.rating || 4))}
              </div>
              <span className="text-xs text-gray-500">({product.reviews || 0})</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 pb-4" onClick={(e) => e.stopPropagation()}>
          {/* 🛒 ADD TO CART BUTTON - VISIBLE POUR TOUS */}
          <button
            onClick={handleAddToCart}
            disabled={product.quantite_stock === 0 || addingToCart}
            className={`w-full flex items-center justify-center px-3 py-2 rounded-lg transition ${
              product.quantite_stock > 0
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {addingToCart ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <FiShoppingCart className="mr-2" size={16} />
                Ajouter au panier
              </>
            )}
          </button>
          
          {/* ❤️ WISHLIST BUTTON - UNIQUEMENT POUR UTILISATEURS CONNECTÉS */}
          {user && (
            <button
              onClick={handleToggleWishlist}
              disabled={wishlistToggling}
              className={`absolute top-2 right-2 p-2 bg-white rounded-full shadow-md transition ${
                isWishlisted 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-600 hover:text-red-500'
              } ${wishlistToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isWishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              {wishlistToggling ? (
                <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full" />
              ) : (
                <FiHeart 
                  size={18} 
                  fill={isWishlisted ? 'currentColor' : 'none'} 
                />
              )}
            </button>
          )}
        </div>

        {/* Stock Status */}
        {product.quantite_stock === 0 && (
          <p className="absolute bottom-16 left-4 text-xs text-red-500 bg-white px-2 py-1 rounded">
            Rupture de stock
          </p>
        )}
        {product.quantite_stock > 0 && product.quantite_stock < 5 && (
          <p className="absolute bottom-16 left-4 text-xs text-orange-500 bg-white px-2 py-1 rounded">
            Plus que {product.quantite_stock} en stock
          </p>
        )}
      </div>
    );
  }

  // Vue liste
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition flex flex-col sm:flex-row">
      {/* Image */}
      <div 
        className="sm:w-48 h-48 bg-gray-100 cursor-pointer relative"
        onClick={handleCardClick}
      >
        <img
          src={getImageUrl()}
          alt={product.nom}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/default-product.jpg';
          }}
        />
        {discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discount}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 p-4">
        <h3 
          onClick={handleCardClick}
          className="font-semibold text-gray-800 hover:text-indigo-600 cursor-pointer mb-2"
        >
          {product.nom}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-2xl font-bold text-indigo-600">
            ${product.prix}
          </span>
          {product.oldPrice && (
            <>
              <span className="text-sm text-gray-400 line-through">
                ${product.oldPrice}
              </span>
              <span className="text-xs text-green-600 font-semibold">
                {discount}
              </span>
            </>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex text-yellow-400">
            {'★'.repeat(product.rating || 4)}
            {'☆'.repeat(5 - (product.rating || 4))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews || 0})</span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          {/* 🛒 ADD TO CART - VISIBLE POUR TOUS */}
          <button
            onClick={handleAddToCart}
            disabled={product.quantite_stock === 0 || addingToCart}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg transition ${
              product.quantite_stock > 0
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {addingToCart ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <FiShoppingCart className="mr-2" size={18} />
                Ajouter au panier
              </>
            )}
          </button>
          
          {/* ❤️ WISHLIST BUTTON - UNIQUEMENT POUR UTILISATEURS CONNECTÉS */}
          {user && (
            <button
              onClick={handleToggleWishlist}
              disabled={wishlistToggling}
              className={`p-2 border rounded-lg transition ${
                isWishlisted
                  ? 'border-red-500 text-red-500 bg-red-50'
                  : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
              } ${wishlistToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {wishlistToggling ? (
                <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full" />
              ) : (
                <FiHeart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
              )}
            </button>
          )}
        </div>

        {/* Stock Status */}
        {product.quantite_stock === 0 && (
          <p className="mt-2 text-xs text-red-500">Rupture de stock</p>
        )}
        {product.quantite_stock > 0 && product.quantite_stock < 5 && (
          <p className="mt-2 text-xs text-orange-500">
            Plus que {product.quantite_stock} en stock
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;