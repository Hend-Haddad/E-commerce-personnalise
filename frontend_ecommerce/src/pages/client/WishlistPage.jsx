// src/pages/client/WishlistPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import ClientNavbar from '../../components/client/ClientNavbar';

import toast from 'react-hot-toast';

const WishlistPage = () => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      nom: 'Smartphone XYZ Pro',
      prix: 599,
      oldPrice: 799,
      image: '/images/product1.jpg',
      enStock: true,
      categorie: 'Électronique'
    },
    {
      id: 2,
      nom: 'Casque Audio Sans Fil',
      prix: 89,
      oldPrice: 129,
      image: '/images/product2.jpg',
      enStock: true,
      categorie: 'Audio'
    },
    {
      id: 3,
      nom: 'Montre Connectée Sport',
      prix: 199,
      oldPrice: 249,
      image: '/images/product3.jpg',
      enStock: false,
      categorie: 'Accessoires'
    },
    {
      id: 4,
      nom: 'Sac à Dos Urbain',
      prix: 45,
      oldPrice: 65,
      image: '/images/product4.jpg',
      enStock: true,
      categorie: 'Mode'
    }
  ]);

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
    toast.success('Produit retiré de la liste de souhaits');
  };

  const addToCart = (item) => {
    if (!item.enStock) {
      toast.error('Ce produit est actuellement en rupture de stock');
      return;
    }
    toast.success(`${item.nom} ajouté au panier`);
    // Logique d'ajout au panier
  };

  const clearWishlist = () => {
    if (wishlistItems.length === 0) {
      toast.error('Votre liste de souhaits est déjà vide');
      return;
    }
    setWishlistItems([]);
    toast.success('Liste de souhaits vidée');
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default-product.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNavbar />
      
      <div className="flex">
       
        
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Ma Liste de Souhaits</h1>
              <p className="text-gray-600 mt-2">
                {wishlistItems.length} produit(s) dans votre liste
              </p>
            </div>
            
            {wishlistItems.length > 0 && (
              <button
                onClick={clearWishlist}
                className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
              >
                <FiTrash2 className="mr-2" />
                Vider la liste
              </button>
            )}
          </div>

          {/* Liste des produits */}
          {wishlistItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="flex justify-center mb-4">
                <FiHeart className="text-gray-300 text-6xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Votre liste de souhaits est vide
              </h2>
              <p className="text-gray-500 mb-6">
                Explorez nos produits et ajoutez vos favoris à votre liste
              </p>
              <Link
                to="/products"
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Découvrir nos produits
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                  {/* Image */}
                  <Link to={`/product/${item.id}`} className="block relative bg-gray-100 h-48">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.nom}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {!item.enStock && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Rupture de stock
                      </span>
                    )}
                  </Link>

                  {/* Infos produit */}
                  <div className="p-4">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="font-semibold text-gray-800 mb-2 hover:text-indigo-600">
                        {item.nom}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-gray-500 mb-2">{item.categorie}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-indigo-600">
                          {item.prix} DT
                        </span>
                        {item.oldPrice && (
                          <span className="ml-2 text-sm text-gray-400 line-through">
                            {item.oldPrice} DT
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => addToCart(item)}
                        disabled={!item.enStock}
                        className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition ${
                          item.enStock
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <FiShoppingCart className="mr-2" />
                        Ajouter
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                        title="Retirer de la liste"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default WishlistPage; // ← TRÈS IMPORTANT