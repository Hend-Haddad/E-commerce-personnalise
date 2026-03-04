// backend/src/models/Order.js - Version simplifiée (paiement à la livraison uniquement)
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price_at_time: { type: Number, required: true },
  product_name: String,
  product_image: String
});

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cart_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  
  // Numéro de commande généré automatiquement
  order_number: { 
    type: String, 
    unique: true, 
    default: function() {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      return `CMD-${year}${month}${day}-${random}`;
    }
  },
  
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  shipping_cost: { type: Number, default: 0 },
  total: { type: Number, required: true },
  
  // Statut de la commande
  status: { 
    type: String, 
    enum: ["en_attente", "confirmée", "en_préparation", "expédiée", "livrée", "annulée"],
    default: "en_attente"
  },
  
  // ✅ PLUS BESOIN DE payment_method - On sait que c'est à la livraison
  // ✅ PLUS BESOIN DE payment_status - On le déduit du statut de commande
  
  // Adresse de livraison
  shipping_address: {
    adresse: { type: String, required: true },
    ville: { type: String, required: true },
    code_postal: String,
    telephone: { type: String, required: true }
  },
  
  notes: String,
  
  // Dates importantes
  delivered_at: Date
  
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

export default mongoose.model("Order", orderSchema);