// backend/src/controllers/wishlistController.js
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// Obtenir la wishlist (pour utilisateurs connectés)
export const getWishlist = async (req, res) => {
  try {
    console.log('❤️ getWishlist - utilisateur:', req.user._id);
    
    let wishlist = await Wishlist.findOne({ 
      user_id: req.user._id 
    }).populate({
      path: 'items.product_id',
      model: 'Product'
    });

    if (!wishlist) {
      wishlist = new Wishlist({
        user_id: req.user._id,
        items: []
      });
      await wishlist.save();
    }

    const formattedItems = wishlist.items.map(item => ({
      id: item._id,
      product: item.product_id,
      added_at: item.added_at
    }));

    res.status(200).json({
      success: true,
      wishlist: {
        id: wishlist._id,
        items: formattedItems,
        itemCount: formattedItems.length
      }
    });

  } catch (error) {
    console.error('❌ Erreur getWishlist:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Ajouter aux favoris (pour utilisateurs connectés)
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    console.log('❤️ addToWishlist - utilisateur:', req.user._id, 'produit:', productId);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Produit non trouvé" 
      });
    }

    let wishlist = await Wishlist.findOne({ user_id: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({
        user_id: req.user._id,
        items: []
      });
    }

    const existingItem = wishlist.items.find(
      item => item.product_id.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({ 
        success: false, 
        message: "Produit déjà dans les favoris" 
      });
    }

    wishlist.items.push({
      product_id: productId
    });

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Produit ajouté aux favoris",
      wishlist: {
        id: wishlist._id,
        itemCount: wishlist.items.length
      }
    });

  } catch (error) {
    console.error('❌ Erreur addToWishlist:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Retirer des favoris
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user_id: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ 
        success: false, 
        message: "Wishlist non trouvée" 
      });
    }

    wishlist.items = wishlist.items.filter(
      item => item.product_id.toString() !== productId
    );

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Produit retiré des favoris",
      wishlist: {
        id: wishlist._id,
        itemCount: wishlist.items.length
      }
    });

  } catch (error) {
    console.error('❌ Erreur removeFromWishlist:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};