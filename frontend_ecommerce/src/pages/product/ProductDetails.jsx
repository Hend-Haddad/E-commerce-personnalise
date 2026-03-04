// src/pages/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiMinus, FiPlus, FiTruck, FiRefreshCw, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist'; // ← AJOUTER useWishlist
import { productService } from '../../services/productService';
import Navbar from '../../components/common/Navbar';
import ClientNavbar from '../../components/client/ClientNavbar';
import Footer from '../../components/common/Footer';
import ProductCard from '../../ui/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist(); // ← AJOUTER
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlistToggling, setWishlistToggling] = useState(false); // ← État pour chargement favoris
  const [isWishlisted, setIsWishlisted] = useState(false); // ← État pour savoir si en favoris

  useEffect(() => {
    loadProduct();
  }, [id]);

  // Vérifier si le produit est dans les favoris (uniquement si connecté)
  useEffect(() => {
    if (user && product?._id) {
      setIsWishlisted(isInWishlist(product._id));
    }
  }, [user, product, isInWishlist]);

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

 const handleAddToCart = async () => {
    // Vérification du stock uniquement, pas de vérification de connexion
    if (product.quantite_stock === 0) {
      toast.error('Produit en rupture de stock');
      return;
    }

    if (quantity > product.quantite_stock) {
      toast.error(`Stock insuffisant. Maximum: ${product.quantite_stock}`);
      return;
    }

    setAddingToCart(true);
    try {
      console.log('🛒 Ajout au panier - produit:', product._id, 'quantité:', quantity);
      
      const result = await addToCart(product._id, quantity);
      
      console.log('📥 Résultat addToCart:', result);
      
      if (result?.success) {
        toast.success(`${quantity} ${quantity > 1 ? 'articles' : 'article'} ajouté(s) au panier`);
      } else {
        // Message adapté selon le contexte
        if (!user) {
          toast.success(`${quantity} ${quantity > 1 ? 'articles' : 'article'} ajouté(s) au panier (temporaire)`);
        } else {
          toast.error(result?.message || 'Erreur lors de l\'ajout au panier');
        }
      }
    } catch (error) {
      console.error('❌ Erreur ajout au panier:', error);
      toast.error('Erreur lors de l\'ajout au panier');
    } finally {
      setAddingToCart(false);
    }
  };

  // ❤️ TOGGLE WISHLIST - UNIQUEMENT POUR UTILISATEURS CONNECTÉS
  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter aux favoris');
      navigate('/login', { state: { from: `/product/${id}` } });
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

  const handleHomeClick = () => {
    if (user && user.role === 'client') {
      navigate('/client');
    } else {
      navigate('/');
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (user && user.role === 'client') {
      navigate(`/client?category=${categoryId}`);
    } else {
      navigate(`/products?category=${categoryId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        {user && user.role === 'client' ? <ClientNavbar /> : <Navbar />}
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
        {user && user.role === 'client' ? <ClientNavbar /> : <Navbar />}
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-800">Produit non trouvé</h2>
          <button 
            onClick={handleHomeClick}
            className="text-indigo-600 mt-4 inline-block hover:underline"
          >
            Retour à l'accueil
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {user && user.role === 'client' ? <ClientNavbar /> : <Navbar />}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Fil d'Ariane */}
        <nav className="text-sm breadcrumbs mb-8">
          <ol className="flex items-center space-x-2">
            <li>
              <button 
                onClick={handleHomeClick}
                className="text-gray-500 hover:text-indigo-600"
              >
                Home
              </button>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <button
                onClick={() => handleCategoryClick(product.categorie_id?._id)}
                className="text-gray-500 hover:text-indigo-600"
              >
                {product.categorie_id?.nom || 'Catégorie'}
              </button>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-800 font-medium">{product.nom}</li>
          </ol>
        </nav>

        {/* Détails produit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Galerie d'images */}
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square">
              <img
                src={getImageUrl(product.images?.[selectedImage])}
                alt={product.nom}
                className="w-full h-full object-cover"
              />
            </div>
            
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

            <div className="mb-6">
              <span className="text-3xl font-bold text-indigo-600">${product.prix}</span>
              {product.oldPrice && (
                <span className="ml-2 text-lg text-gray-400 line-through">${product.oldPrice}</span>
              )}
            </div>

            <p className="text-gray-600 mb-8">{product.description}</p>

            {/* Quantité et ajout au panier */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={decreaseQuantity}
                  className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                  disabled={quantity <= 1 || addingToCart}
                >
                  <FiMinus />
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                  disabled={quantity >= (product.quantite_stock || 10) || addingToCart}
                >
                  <FiPlus />
                </button>
              </div>
              
              {/* 🛒 BOUTON AJOUTER AU PANIER - VISIBLE POUR TOUS */}
              <button
                onClick={handleAddToCart}
                disabled={product.quantite_stock === 0 || addingToCart}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {addingToCart ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <FiShoppingCart className="inline mr-2" />
                    Ajouter au panier
                  </>
                )}
              </button>
              
              {/* ❤️ BOUTON FAVORIS - UNIQUEMENT POUR UTILISATEURS CONNECTÉS */}
              {user ? (
                <button
                  onClick={handleToggleWishlist}
                  disabled={wishlistToggling}
                  className={`p-3 border rounded-lg transition ${
                    isWishlisted
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                  } ${wishlistToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={isWishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  {wishlistToggling ? (
                    <div className="animate-spin h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full" />
                  ) : (
                    <FiHeart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                  )}
                </button>
              ) : (
                // Pour les visiteurs, on peut soit ne rien afficher, soit un bouton grisé
                // Option 1: Ne rien afficher (pas de bouton)
                // Option 2: Bouton grisé qui redirige vers login
                <button
                  onClick={() => {
                    toast.error('Veuillez vous connecter pour ajouter aux favoris');
                    navigate('/login', { state: { from: `/product/${id}` } });
                  }}
                  className="p-3 border border-gray-300 rounded-lg text-gray-400 hover:bg-gray-50 transition"
                  title="Connectez-vous pour ajouter aux favoris"
                >
                  <FiHeart size={20} />
                </button>
              )}
            </div>

            {/* Indicateur de stock */}
            {product.quantite_stock > 0 && product.quantite_stock < 5 && (
              <p className="text-sm text-orange-600 mb-4">
                ⚠️ Plus que {product.quantite_stock} en stock
              </p>
            )}

            {/* Message pour les visiteurs - optionnel */}
            {!user && (
              <p className="text-sm text-gray-500 mb-4 flex items-center">
                <FiHeart className="mr-1 text-gray-400" size={14} />
                <Link to="/login" className="text-indigo-600 hover:underline">
                  Connectez-vous
                </Link> pour ajouter ce produit à vos favoris
              </p>
            )}

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