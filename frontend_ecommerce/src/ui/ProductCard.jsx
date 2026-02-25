// src/components/ui/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiEye, FiShoppingCart } from 'react-icons/fi';

import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const ProductCard = ({ product }) => {
  const { user } = useAuth();

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

  return (
    <div className="group relative">
      {/* Discount Badge */}
      {discount && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
          {discount}
        </div>
      )}

      {/* Product Image - Lien vers la page de détails */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-3 aspect-square">
        <Link to={`/product/${product._id}`}>
          <img
            src={getImageUrl()}
            alt={product.nom}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={(e) => {
              e.target.src = '/default-product.jpg';
            }}
          />
        </Link>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition">
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-indigo-50 text-gray-600 hover:text-indigo-600">
            <FiHeart size={16} />
          </button>
          <Link 
            to={`/product/${product._id}`}
            className="p-2 bg-white rounded-full shadow-md hover:bg-indigo-50 text-gray-600 hover:text-indigo-600"
          >
            <FiEye size={16} />
          </Link>
        </div>

        {/* Add to Cart Overlay */}
        <button
          onClick={() => {
            if (!user) {
              toast.error('Veuillez vous connecter pour ajouter au panier');
              return;
            }
            // Logique d'ajout au panier
            toast.success('Produit ajouté au panier');
          }}
          className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white py-2 text-center opacity-0 group-hover:opacity-100 transition"
        >
          <FiShoppingCart className="inline mr-2" />
          Add To Cart
        </button>
      </div>

      {/* Product Info - Lien vers la page de détails */}
      <Link to={`/product/${product._id}`}>
        <h3 className="font-semibold text-gray-800 mb-1 hover:text-indigo-600">
          {product.nom}
        </h3>
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-lg font-bold text-indigo-600">
            ${product.prix}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.oldPrice}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <div className="flex text-yellow-400">
            {'★'.repeat(product.rating || 4)}
            {'☆'.repeat(5 - (product.rating || 4))}
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviews || 0})
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;