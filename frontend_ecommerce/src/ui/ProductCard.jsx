// src/components/client/ProductCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';

import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);

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
  // Rediriger vers la page produit
  navigate(`/product/${product._id}`);
};

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter aux favoris');
      return;
    }
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const addToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter au panier');
      return;
    }
    if (product.quantite_stock === 0) {
      toast.error('Produit en rupture de stock');
      return;
    }
    toast.success(`${product.nom} ajouté au panier`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden group relative cursor-pointer"
      onClick={handleCardClick}
    >
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
              {discount && (
                <span className="text-xs text-green-600 font-semibold">
                  {discount}
                </span>
              )}
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
        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={addToCart}
            disabled={product.quantite_stock === 0}
            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition ${
              product.quantite_stock > 0
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <FiShoppingCart className="mr-2" size={16} />
            Add to cart
          </button>
          
          <button
            onClick={toggleWishlist}
            className={`p-2 border rounded-lg transition ${
              isWishlisted
                ? 'border-red-500 text-red-500 bg-red-50'
                : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
            }`}
          >
            <FiHeart size={18} />
          </button>
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