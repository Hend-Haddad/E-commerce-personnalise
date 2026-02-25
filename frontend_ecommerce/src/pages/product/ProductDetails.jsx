// src/pages/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiMinus, FiPlus, FiTruck, FiRefreshCw, FiShield } from 'react-icons/fi';

import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { productService } from '../../services/productService';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ProductCard from '../../ui/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data.product);
      
      // Charger des produits similaires (même catégorie)
      if (data.product.categorie_id) {
        const related = await productService.getAllProducts({ 
          categorie: data.product.categorie_id._id,
          limit: 4 
        });
        setRelatedProducts(related.products.filter(p => p._id !== id).slice(0, 4));
      }
    } catch (error) {
      console.error('❌ Erreur chargement produit:', error);
      toast.error('Erreur lors du chargement du produit');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default-product.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter au panier');
      return;
    }
    toast.success(`${quantity} article(s) ajouté(s) au panier`);
  };

  const increaseQuantity = () => {
    if (quantity < (product?.quantite_stock || 10)) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-800">Produit non trouvé</h2>
          <Link to="/" className="text-indigo-600 mt-4 inline-block">Retour à l'accueil</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Fil d'Ariane */}
        <nav className="text-sm breadcrumbs mb-8">
          <ol className="flex items-center space-x-2">
            <li><Link to="/" className="text-gray-500 hover:text-indigo-600">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to={`/products?category=${product.categorie_id?._id}`} className="text-gray-500 hover:text-indigo-600">
              {product.categorie_id?.nom || 'Catégorie'}
            </Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-800 font-medium">{product.nom}</li>
          </ol>
        </nav>

        {/* Détails produit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Galerie d'images */}
          <div>
            {/* Image principale */}
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square">
              <img
                src={getImageUrl(product.images?.[selectedImage])}
                alt={product.nom}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Miniatures */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-gray-100 rounded-lg overflow-hidden aspect-square border-2 ${
                      selectedImage === index ? 'border-indigo-600' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${product.nom} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informations produit */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.nom}</h1>
            
            {/* Note et avis */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex text-yellow-400">
                {'★'.repeat(product.rating || 4)}
                {'☆'.repeat(5 - (product.rating || 4))}
              </div>
              <span className="text-gray-500">({product.reviews || 0} avis)</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                product.quantite_stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.quantite_stock > 0 ? 'En stock' : 'Rupture de stock'}
              </span>
            </div>

            {/* Prix */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-indigo-600">${product.prix}</span>
              {product.oldPrice && (
                <span className="ml-2 text-lg text-gray-400 line-through">${product.oldPrice}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-8">{product.description}</p>

            {/* Quantité et ajout au panier */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={decreaseQuantity}
                  className="px-3 py-2 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="px-3 py-2 hover:bg-gray-100"
                  disabled={quantity >= (product.quantite_stock || 10)}
                >
                  <FiPlus />
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={product.quantite_stock === 0}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FiShoppingCart className="inline mr-2" />
                Ajouter au panier
              </button>
              
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-red-50 hover:text-red-600 transition">
                <FiHeart size={20} />
              </button>
            </div>

            {/* Services */}
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex items-center space-x-3">
                <FiTruck className="text-indigo-600" />
                <span className="text-sm text-gray-600">Livraison gratuite pour les commandes de plus de $140</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiRefreshCw className="text-indigo-600" />
                <span className="text-sm text-gray-600">Retour gratuit sous 30 jours</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiShield className="text-indigo-600" />
                <span className="text-sm text-gray-600">Garantie 2 ans incluse</span>
              </div>
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Vous pourriez aussi aimer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(related => (
                <ProductCard key={related._id} product={related} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;