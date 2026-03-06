// backend/src/controllers/adminClientController.js
import User from "../models/User.js";
import Order from "../models/Order.js";

// Récupérer tous les clients
export const getAllClients = async (req, res) => {
  try {
    console.log('👥 Admin - Récupération de tous les clients');
    
    const { search, page = 1, limit = 20, actif } = req.query;
    
    // Construire le filtre
    let filter = { role: "client" }; // Seulement les clients, pas les admins
    
    if (actif !== undefined) {
      filter.actif = actif === 'true';
    }
    
    if (search) {
      filter.$or = [
        { nom: new RegExp(search, 'i') },
        { prenom: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { telephone: new RegExp(search, 'i') }
      ];
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Récupérer les clients
    const clients = await User.find(filter)
      .select('-password')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Compter le total pour la pagination
    const total = await User.countDocuments(filter);
    
    // Statistiques
    const stats = {
      total: await User.countDocuments({ role: "client" }),
      actifs: await User.countDocuments({ role: "client", actif: true }),
      inactifs: await User.countDocuments({ role: "client", actif: false }),
      nouveaux: await User.countDocuments({ 
        role: "client", 
        created_at: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
      })
    };
    
    console.log(`✅ ${clients.length} clients trouvés`);
    
    res.status(200).json({
      success: true,
      clients,
      stats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur getAllClients:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};

// Récupérer un client par ID
export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`👤 Admin - Récupération client ${id}`);
    
    const client = await User.findOne({ 
      _id: id, 
      role: "client" 
    }).select('-password');
    
    if (!client) {
      return res.status(404).json({ 
        success: false, 
        message: "Client non trouvé" 
      });
    }
    
    // Récupérer les commandes du client
    const orders = await Order.find({ user_id: id })
      .sort({ created_at: -1 })
      .limit(10);
    
    // Statistiques des commandes
    const orderStats = {
      total: await Order.countDocuments({ user_id: id }),
      total_depenses: await Order.aggregate([
        { $match: { user_id: id, status: { $ne: 'annulée' } } },
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]),
      dernier_achat: await Order.findOne({ user_id: id })
        .sort({ created_at: -1 })
        .select('created_at')
    };
    
    res.status(200).json({
      success: true,
      client,
      orders: orders || [],
      stats: {
        total_commandes: orderStats.total,
        total_depense: orderStats.total_depenses[0]?.total || 0,
        dernier_achat: orderStats.dernier_achat?.created_at || null
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur getClientById:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};

// Mettre à jour un client
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, telephone, adresse, actif } = req.body;
    
    console.log(`✏️ Admin - Mise à jour client ${id}`);
    
    const client = await User.findOneAndUpdate(
      { _id: id, role: "client" },
      {
        nom,
        prenom,
        telephone,
        adresse,
        actif
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!client) {
      return res.status(404).json({ 
        success: false, 
        message: "Client non trouvé" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Client mis à jour avec succès",
      client
    });
    
  } catch (error) {
    console.error('❌ Erreur updateClient:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};

// Désactiver/Activer un client
export const toggleClientStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { actif } = req.body;
    
    console.log(`🔄 Admin - Changement statut client ${id} -> ${actif ? 'actif' : 'inactif'}`);
    
    const client = await User.findOneAndUpdate(
      { _id: id, role: "client" },
      { actif },
      { new: true }
    ).select('-password');
    
    if (!client) {
      return res.status(404).json({ 
        success: false, 
        message: "Client non trouvé" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Client ${actif ? 'activé' : 'désactivé'} avec succès`,
      client
    });
    
  } catch (error) {
    console.error('❌ Erreur toggleClientStatus:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};

// Supprimer un client (soft delete ou hard delete)
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;
    
    if (permanent === 'true') {
      // Suppression définitive
      const client = await User.findOneAndDelete({ 
        _id: id, 
        role: "client" 
      });
      
      if (!client) {
        return res.status(404).json({ 
          success: false, 
          message: "Client non trouvé" 
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Client supprimé définitivement"
      });
      
    } else {
      // Soft delete - on désactive simplement
      const client = await User.findOneAndUpdate(
        { _id: id, role: "client" },
        { actif: false },
        { new: true }
      ).select('-password');
      
      res.status(200).json({
        success: true,
        message: "Client désactivé",
        client
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur deleteClient:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};