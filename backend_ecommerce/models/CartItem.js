// backend/src/models/CartItem.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    panier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true
    },
    produit_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantite: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    prix_unitaire: {
      type: Number,
      required: true,
      min: 0
    },
    date_creation: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: {
      createdAt: 'date_creation',
      updatedAt: false
    }
  }
);

// Un produit ne peut apparaître qu'une seule fois dans un panier
cartItemSchema.index({ panier_id: 1, produit_id: 1 }, { unique: true });

// ✅ Vérifiez que cette ligne est bien présente
export default mongoose.model("CartItem", cartItemSchema);