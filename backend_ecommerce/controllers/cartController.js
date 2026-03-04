import Cart from "../models/Cart.js";
import Product from "../models/Product.js";


// Ajouter au panier - VERSION CORRIGÉE
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const { sessionId } = req.query;

    // LOGS DÉTAILLÉS
    console.log('='.repeat(50));
    console.log('🛒 addToCart - DÉBUT');
    console.log('req.user:', req.user ? {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role
    } : '❌ NON CONNECTÉ');
    console.log('sessionId reçu:', sessionId);
    
   
    const isAuthenticated = req.user && req.user._id && req.user._id.toString();
    
    console.log('isAuthenticated:', isAuthenticated ? 'OUI' : 'NON');
    console.log('req.user._id:', req.user ? req.user._id : 'null');

    // Vérifier le produit
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Produit non trouvé" 
      });
    }

    if (product.quantite_stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: "Stock insuffisant" 
      });
    }

    // Chercher le panier existant
    let cart;
    let newSessionId = sessionId;

    if (isAuthenticated) {
      // ✅ UTILISATEUR CONNECTÉ
      console.log('👤 RECHERCHE PANIER POUR UTILISATEUR CONNECTÉ ID:', req.user._id);
      
      cart = await Cart.findOne({ 
        user_id: req.user._id, 
        status: "actif" 
      });
      
      console.log('Résultat recherche:', cart ? '✅ Panier trouvé' : '❌ Aucun panier, création...');
      
      if (!cart) {
        // Créer nouveau panier pour utilisateur connecté
        cart = new Cart({
          user_id: req.user._id,
          items: [],
          status: "actif",
          total: 0
        });
        console.log('🆕 NOUVEAU PANIER CRÉÉ POUR UTILISATEUR CONNECTÉ');
      }
    } else {
      // ❌ VISITEUR
      console.log('👤 RECHERCHE PANIER POUR VISITEUR');
      
      if (!sessionId) {
        newSessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log('🆕 Nouvelle session créée pour visiteur:', newSessionId);
      }
      
      cart = await Cart.findOne({ 
        session_id: sessionId || newSessionId, 
        status: "actif" 
      });
      
      console.log('Résultat recherche:', cart ? '✅ Panier trouvé' : '❌ Aucun panier, création...');
      
      if (!cart) {
        cart = new Cart({
          session_id: sessionId || newSessionId,
          items: [],
          status: "actif",
          total: 0
        });
        console.log('🆕 Nouveau panier créé pour visiteur');
      }
    }

    // Vérifier si le produit existe déjà
    const existingItemIndex = cart.items.findIndex(
      item => item.product_id.toString() === productId
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (product.quantite_stock < newQuantity) {
        return res.status(400).json({ 
          success: false, 
          message: "Quantité demandée dépasse le stock disponible" 
        });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
      console.log('🔄 Quantité mise à jour:', newQuantity);
    } else {
      cart.items.push({
        product_id: productId,
        quantity,
        price_at_time: product.prix
      });
      console.log('➕ Nouvel item ajouté');
    }

    // Calculer le total
    cart.total = cart.items.reduce((sum, item) => {
      return sum + (item.price_at_time * item.quantity);
    }, 0);

    // Sauvegarder
    await cart.save();
    
    console.log('💾 PANIER SAUVEGARDÉ:');
    console.log('   - ID:', cart._id);
    console.log('   - user_id:', cart.user_id ? cart.user_id.toString() : 'null');
    console.log('   - session_id:', cart.session_id || 'null');
    console.log('   - items count:', cart.items.length);
    console.log('   - total:', cart.total);

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    // ✅ CRITIQUE: sessionId SEULEMENT pour les visiteurs
    const response = {
      success: true,
      message: "Produit ajouté au panier",
      cart: {
        id: cart._id,
        itemCount,
        total: cart.total,
        // ICI LA CORRECTION - sessionId = null pour utilisateur connecté
        sessionId: !isAuthenticated ? (sessionId || newSessionId) : null
      }
    };

    console.log('📤 RÉPONSE ENVOYÉE:');
    console.log('   - isAuthenticated:', isAuthenticated);
    console.log('   - sessionId retournée:', response.cart.sessionId);
    console.log('='.repeat(50));
    
    res.status(200).json(response);

  } catch (error) {
    console.error('❌ Erreur addToCart:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur",
      error: error.message 
    });
  }
};

// Obtenir le panier - VERSION CORRIGÉE
export const getCart = async (req, res) => {
  try {
    let cart;
    const { sessionId } = req.query;

    console.log('='.repeat(50));
    console.log('📦 getCart - DÉBUT');
    console.log('req.user:', req.user ? req.user._id : 'non connecté');
    console.log('sessionId:', sessionId);

    // ✅ Vérifier si utilisateur connecté
    const isAuthenticated = req.user && req.user._id;

    if (isAuthenticated) {
      // Utilisateur connecté - chercher par user_id
      console.log('🔍 Recherche panier pour utilisateur ID:', req.user._id);
      
      cart = await Cart.findOne({ 
        user_id: req.user._id, 
        status: "actif" 
      }).populate({
        path: 'items.product_id',
        model: 'Product'
      });
      
      console.log('📦 Résultat:', cart ? '✅ Panier trouvé' : '❌ Aucun panier');
      
    } else if (sessionId) {
      // Visiteur - chercher par session_id
      console.log('🔍 Recherche panier pour session:', sessionId);
      
      cart = await Cart.findOne({ 
        session_id: sessionId, 
        status: "actif" 
      }).populate({
        path: 'items.product_id',
        model: 'Product'
      });
      
      console.log('📦 Résultat:', cart ? '✅ Panier trouvé' : '❌ Aucun panier');
    }

    if (!cart) {
      console.log('📦 Aucun panier trouvé, retour panier vide');
      return res.status(200).json({ 
        success: true, 
        cart: { items: [], total: 0, itemCount: 0 } 
      });
    }

    // Formater les items
    const formattedItems = cart.items.map(item => ({
      id: item._id,
      product: item.product_id,
      quantity: item.quantity,
      prix_unitaire: item.price_at_time,
      total: item.price_at_time * item.quantity
    }));

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    const response = {
      success: true,
      cart: {
        id: cart._id,
        items: formattedItems,
        total: cart.total,
        itemCount
      }
    };

    console.log('📤 Réponse - items:', formattedItems.length);
    console.log('='.repeat(50));
    
    res.status(200).json(response);

  } catch (error) {
    console.error('❌ Erreur getCart:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};


// Mettre à jour quantité
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const { sessionId } = req.query;

    if (quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: "La quantité doit être supérieure à 0" 
      });
    }

    // Trouver le panier selon l'utilisateur
    let query = { status: "actif" };
    
    if (req.user) {
      query.user_id = req.user.id;
    } else if (sessionId) {
      query.session_id = sessionId;
    } else {
      return res.status(400).json({ 
        success: false, 
        message: "Session ou utilisateur requis" 
      });
    }

    const cart = await Cart.findOne(query);
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: "Panier non trouvé" 
      });
    }

    // Trouver l'item
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: "Article non trouvé dans le panier" 
      });
    }

    // Vérifier le stock
    const product = await Product.findById(item.product_id);
    if (product.quantite_stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: "Stock insuffisant" 
      });
    }

    item.quantity = quantity;
    
    // Recalculer le total
    cart.total = cart.items.reduce((sum, item) => {
      return sum + (item.price_at_time * item.quantity);
    }, 0);
    
    await cart.save();

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    res.status(200).json({
      success: true,
      message: "Quantité mise à jour",
      cart: {
        total: cart.total,
        itemCount
      }
    });
  } catch (error) {
    console.error('❌ Erreur updateCartItem:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Supprimer un article
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { sessionId } = req.query;

    let query = { status: "actif" };
    
    if (req.user) {
      query.user_id = req.user.id;
    } else if (sessionId) {
      query.session_id = sessionId;
    } else {
      return res.status(400).json({ 
        success: false, 
        message: "Session ou utilisateur requis" 
      });
    }

    const cart = await Cart.findOne(query);
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: "Panier non trouvé" 
      });
    }

    // Supprimer l'item
    cart.items.pull({ _id: itemId });
    
    // Recalculer le total
    cart.total = cart.items.reduce((sum, item) => {
      return sum + (item.price_at_time * item.quantity);
    }, 0);
    
    await cart.save();

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    res.status(200).json({
      success: true,
      message: "Article supprimé du panier",
      cart: {
        total: cart.total,
        itemCount
      }
    });
  } catch (error) {
    console.error('❌ Erreur removeFromCart:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Vider le panier
export const clearCart = async (req, res) => {
  try {
    const { sessionId } = req.query;

    let query = { status: "actif" };
    
    if (req.user) {
      query.user_id = req.user.id;
    } else if (sessionId) {
      query.session_id = sessionId;
    } else {
      return res.status(400).json({ 
        success: false, 
        message: "Session ou utilisateur requis" 
      });
    }

    const cart = await Cart.findOne(query);
    if (cart) {
      cart.items = [];
      cart.total = 0;
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Panier vidé avec succès"
    });
  } catch (error) {
    console.error('❌ Erreur clearCart:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Fusionner le panier session avec le panier utilisateur
export const mergeCart = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: "Utilisateur non authentifié" 
      });
    }

    console.log('🔄 Fusion panier - user:', req.user.id, 'session:', sessionId);

    // Trouver le panier session
    const sessionCart = await Cart.findOne({ 
      session_id: sessionId, 
      status: "actif" 
    });

    if (!sessionCart || sessionCart.items.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: "Aucun panier session à fusionner" 
      });
    }

    // Trouver ou créer le panier utilisateur
    let userCart = await Cart.findOne({ 
      user_id: req.user.id, 
      status: "actif" 
    });

    if (!userCart) {
      userCart = new Cart({
        user_id: req.user.id,
        items: [],
        status: "actif",
        total: 0
      });
    }

    // Fusionner les items
    for (const sessionItem of sessionCart.items) {
      const existingItem = userCart.items.find(
        item => item.product_id.toString() === sessionItem.product_id.toString()
      );

      if (existingItem) {
        // Mettre à jour la quantité si le produit existe déjà
        existingItem.quantity += sessionItem.quantity;
      } else {
        // Ajouter le nouvel item
        userCart.items.push({
          product_id: sessionItem.product_id,
          quantity: sessionItem.quantity,
          price_at_time: sessionItem.price_at_time
        });
      }
    }

    // Recalculer le total
    userCart.total = userCart.items.reduce((sum, item) => {
      return sum + (item.price_at_time * item.quantity);
    }, 0);

    await userCart.save();

    // Supprimer le panier session
    sessionCart.status = "fusionné";
    await sessionCart.save();

    console.log('✅ Fusion réussie - total items:', userCart.items.length);

    res.status(200).json({
      success: true,
      message: "Panier fusionné avec succès",
      cart: {
        id: userCart._id,
        itemCount: userCart.items.reduce((sum, item) => sum + item.quantity, 0),
        total: userCart.total
      }
    });

  } catch (error) {
    console.error('❌ Erreur mergeCart:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};