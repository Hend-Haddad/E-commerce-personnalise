import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom du produit est requis"],
      trim: true,
      maxlength: [200, "Le nom ne peut pas dépasser 200 caractères"]
    },
    description: {
      type: String,
      required: [true, "La description est requise"],
      trim: true
    },
    prix: {
      type: Number,
      required: [true, "Le prix est requis"],
      min: [0, "Le prix ne peut pas être négatif"]
    },
    categorie_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La catégorie est requise"]
    },
    quantite_stock: {
      type: Number,
      required: [true, "La quantité en stock est requise"],
      min: [0, "La quantité ne peut pas être négative"],
      default: 0
    },
    images: [{
      type: String,  // Tableau d'URLs d'images
      default: []
    }],
    image_principale: {
      type: String,  // URL de l'image principale
      default: "default-product.jpg"
    },
    date_ajout: {
      type: Date,
      default: Date.now
    },
    date_modification: {
      type: Date,
      default: Date.now
    },
    actif: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: {
      createdAt: 'date_ajout',
      updatedAt: 'date_modification'
    }
  }
);

// Index pour la recherche textuelle
productSchema.index({ nom: 'text', description: 'text' });

export default mongoose.model("Product", productSchema);