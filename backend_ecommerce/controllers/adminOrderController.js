// backend/src/controllers/adminOrderController.js
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

// Récupérer TOUTES les commandes (pour l'admin)
export const getAllOrders = async (req, res) => {
  try {
    console.log('📋 Admin - Récupération de toutes les commandes');
    
    const { status, page = 1, limit = 20, search } = req.query;
    
    // Construire le filtre
    let filter = {};
    if (status && status !== 'tous') {
      filter.status = status;
    }
    
    // Recherche par numéro de commande ou email client
    if (search) {
      const user = await User.findOne({ email: new RegExp(search, 'i') });
      filter.$or = [
        { order_number: new RegExp(search, 'i') }
      ];
      if (user) {
        filter.$or.push({ user_id: user._id });
      }
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Récupérer les commandes avec les informations utilisateur
    const orders = await Order.find(filter)
      .populate('user_id', 'nom prenom email telephone')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Compter le total pour la pagination
    const total = await Order.countDocuments(filter);
    
    // Statistiques rapides
    const stats = {
      en_attente: await Order.countDocuments({ status: 'en_attente' }),
      confirmée: await Order.countDocuments({ status: 'confirmée' }),
      en_préparation: await Order.countDocuments({ status: 'en_préparation' }),
      expédiée: await Order.countDocuments({ status: 'expédiée' }),
      livrée: await Order.countDocuments({ status: 'livrée' }),
      annulée: await Order.countDocuments({ status: 'annulée' }),
      total: await Order.countDocuments()
    };
    
    console.log(`✅ ${orders.length} commandes trouvées`);
    
    res.status(200).json({
      success: true,
      orders,
      stats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur getAllOrders:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};

// Récupérer une commande spécifique (pour admin)
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id)
      .populate('user_id', 'nom prenom email telephone adresse')
      .populate('items.product_id', 'nom prix images');
    
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
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};

// Mettre à jour le statut d'une commande
// backend/src/controllers/adminOrderController.js
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`📦 Admin - Mise à jour commande ${id} vers ${status}`);
    
    // Statuts valides
    const validStatuses = [
      'en_attente', 
      'confirmée', 
      'en_préparation', 
      'expédiée', 
      'livrée', 
      'annulée'
    ];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Statut invalide"
      });
    }
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Commande non trouvée" 
      });
    }
    
    // Si on annule une commande qui était confirmée, restaurer les stocks
    if (status === 'annulée' && order.status !== 'annulée') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product_id,
          { $inc: { quantite_stock: item.quantity } }
        );
      }
    }
    
    // Si on livre la commande, enregistrer la date de livraison
    if (status === 'livrée') {
      order.delivered_at = new Date();
    }
    
    order.status = status;
    await order.save();
    
    // ✅ ICI - Le client verra automatiquement le nouveau statut
    // car il récupère la même commande depuis la base de données
    
    res.status(200).json({
      success: true,
      message: `Statut de la commande mis à jour : ${status}`,
      order: {
        id: order._id,
        order_number: order.order_number,
        status: order.status,
        delivered_at: order.delivered_at
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur updateOrderStatus:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};

// Obtenir les statistiques des commandes
export const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          total_montant: { $sum: "$total" }
        }
      }
    ]);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayStats = await Order.countDocuments({
      created_at: { $gte: today }
    });
    
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthStats = await Order.countDocuments({
      created_at: { $gte: monthStart }
    });
    
    res.status(200).json({
      success: true,
      stats: {
        byStatus: stats,
        today: todayStats,
        thisMonth: monthStats
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur getOrderStats:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};