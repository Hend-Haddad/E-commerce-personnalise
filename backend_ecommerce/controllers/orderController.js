// backend/src/controllers/orderController.js - Version simplifiée
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Créer une commande (paiement à la livraison uniquement)
export const createOrder = async (req, res) => {
  try {
    console.log('📦 createOrder - Début');
    console.log('req.user:', req.user ? req.user._id : 'non connecté');
    console.log('req.body:', req.body);
    
    const { 
      cartId, 
      shipping_address, 
      notes 
    } = req.body;  // ✅ PLUS BESOIN DE payment_method

    // Vérifications
    if (!cartId) {
      return res.status(400).json({ 
        success: false, 
        message: "cartId requis" 
      });
    }

    if (!shipping_address || !shipping_address.adresse || !shipping_address.ville || !shipping_address.telephone) {
      return res.status(400).json({ 
        success: false, 
        message: "Adresse de livraison incomplète" 
      });
    }

    // Récupérer le panier
    const cart = await Cart.findOne({ 
      _id: cartId, 
      user_id: req.user._id,
      status: "actif" 
    }).populate('items.product_id');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Panier vide ou non trouvé" 
      });
    }

    // Vérifier les stocks
    for (const item of cart.items) {
      const product = item.product_id;
      if (product.quantite_stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Stock insuffisant pour ${product.nom}` 
        });
      }
    }

    // Calculer les frais de livraison
    const shipping_cost = cart.total > 140 ? 0 : 10;

    // ✅ CRÉER LA COMMANDE - PLUS BESOIN DE payment_method
    const order = new Order({
      user_id: req.user._id,
      cart_id: cart._id,
      items: cart.items.map(item => ({
        product_id: item.product_id._id,
        quantity: item.quantity,
        price_at_time: item.price_at_time,
        product_name: item.product_id.nom,
        product_image: item.product_id.images?.[0] || null
      })),
      subtotal: cart.total,
      shipping_cost,
      total: cart.total + shipping_cost,
      shipping_address: {
        adresse: shipping_address.adresse,
        ville: shipping_address.ville,
        code_postal: shipping_address.code_postal || '',
        telephone: shipping_address.telephone
      },
      notes: notes || '',
      status: "en_attente"  // En attente de traitement
      // ✅ PLUS BESOIN DE payment_method NI payment_status
    });

    await order.save();
    console.log('✅ Commande créée (paiement à la livraison):', order.order_number);

    // Mettre à jour les stocks
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product_id._id,
        { $inc: { quantite_stock: -item.quantity } }
      );
    }

    // Marquer le panier comme converti
    cart.status = "converti";
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Commande créée avec succès (paiement à la livraison)",
      order: {
        id: order._id,
        order_number: order.order_number,
        total: order.total
      }
    });

  } catch (error) {
    console.error('❌ Erreur createOrder:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur lors de la création de la commande" 
    });
  }
};

// Récupérer les commandes de l'utilisateur
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user._id })
      .sort({ created_at: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('❌ Erreur getUserOrders:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Récupérer une commande spécifique
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findOne({ 
      _id: id, 
      user_id: req.user._id 
    });

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Commande non trouvée" 
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('❌ Erreur getOrderById:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Annuler une commande
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ 
      _id: id, 
      user_id: req.user._id,
      status: "en_attente"
    });

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Commande non trouvée ou ne peut pas être annulée" 
      });
    }

    order.status = "annulée";
    await order.save();

    // Restaurer les stocks
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product_id,
        { $inc: { quantite_stock: item.quantity } }
      );
    }

    res.status(200).json({
      success: true,
      message: "Commande annulée avec succès"
    });
  } catch (error) {
    console.error('❌ Erreur cancelOrder:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};




