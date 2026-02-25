// backend/src/models/Category.js - Version sans middleware
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom de la catégorie est requis"],
      unique: true,
      trim: true,
      maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"]
    },
    description: {
      type: String,
      required: [true, "La description est requise"],
      trim: true,
      maxlength: [500, "La description ne peut pas dépasser 500 caractères"]
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    image: {
      type: String,
      default: "default-category.jpg"
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

// ✅ PAS DE MIDDLEWARE - On gérera le slug dans le contrôleur

export default mongoose.model("Category", categorySchema);