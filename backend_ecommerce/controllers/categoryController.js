// backend/src/controllers/categoryController.js
import Category from "../models/Category.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fonction utilitaire pour générer le slug
const generateSlug = (nom) => {
  return nom
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/[éèê]/g, 'e')
    .replace(/[àâ]/g, 'a')
    .replace(/[ç]/g, 'c')
    .replace(/[ùûü]/g, 'u')
    .replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o');
};

// @desc    Créer une catégorie avec image (Admin uniquement)
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  try {
    const { nom, description } = req.body;
    
    console.log("📝 Création catégorie - Données reçues:", { nom, description });
    console.log("📸 Fichier reçu:", req.file);

    // Vérifier si la catégorie existe déjà
    const existingCategory = await Category.findOne({ nom });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Une catégorie avec ce nom existe déjà"
      });
    }

    // Générer le slug
    const slug = generateSlug(nom);

    // Gérer l'image
    let image = "default-category.jpg";
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const category = await Category.create({
      nom,
      description,
      slug,
      image
    });

    console.log("✅ Catégorie créée:", category);

    res.status(201).json({
      success: true,
      message: "Catégorie créée avec succès",
      category
    });
  } catch (error) {
    console.error("❌ Erreur createCategory:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Récupérer toutes les catégories (Public)
// @route   GET /api/categories
// @access  Public
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ actif: true })
      .sort({ date_ajout: -1 });

    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    console.error("❌ Erreur getAllCategories:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Récupérer une catégorie par ID (Public)
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée"
      });
    }

    res.json({
      success: true,
      category
    });
  } catch (error) {
    console.error("❌ Erreur getCategoryById:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mettre à jour une catégorie avec image (Admin uniquement)
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  try {
    const { nom, description, actif } = req.body;
    const { id } = req.params;

    console.log("📝 Mise à jour catégorie ID:", id);
    console.log("📦 Données reçues:", { nom, description, actif });
    console.log("📸 Fichier reçu:", req.file);

    let category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée"
      });
    }

    // Vérifier si le nouveau nom existe déjà (sauf pour la même catégorie)
    if (nom && nom !== category.nom) {
      const existingCategory = await Category.findOne({ nom });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Une catégorie avec ce nom existe déjà"
        });
      }
    }

    // Gérer l'image
    let image = category.image;
    if (req.file) {
      // Supprimer l'ancienne image si ce n'est pas l'image par défaut
      if (category.image && category.image !== 'default-category.jpg' && category.image !== '/default-category.jpg') {
        const oldImagePath = path.join(__dirname, '../../', category.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('🗑️ Ancienne image supprimée:', oldImagePath);
        }
      }
      image = `/uploads/${req.file.filename}`;
    }

    // Générer le slug si le nom change
    let slug = category.slug;
    if (nom && nom !== category.nom) {
      slug = generateSlug(nom);
    }

    category = await Category.findByIdAndUpdate(
      id,
      { 
        nom: nom || category.nom,
        description: description || category.description,
        slug,
        image,
        actif: actif !== undefined ? actif : category.actif,
        date_modification: Date.now()
      },
      { new: true, runValidators: true }
    );

    console.log("✅ Catégorie mise à jour:", category);

    res.json({
      success: true,
      message: "Catégorie mise à jour avec succès",
      category
    });
  } catch (error) {
    console.error("❌ Erreur updateCategory:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ @desc    Désactiver une catégorie (Soft Delete - Admin)
// ✅ @route   DELETE /api/categories/:id
// ✅ @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log("🗑️ Désactivation catégorie ID:", id);

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée"
      });
    }

    // Soft delete - on désactive plutôt que supprimer
    category.actif = false;
    category.date_modification = Date.now();
    await category.save();

    console.log("✅ Catégorie désactivée:", category.nom);

    res.json({
      success: true,
      message: "Catégorie désactivée avec succès"
    });
  } catch (error) {
    console.error("❌ Erreur deleteCategory:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ @desc    Supprimer définitivement une catégorie (Admin uniquement)
// ✅ @route   DELETE /api/categories/:id/permanent
// ✅ @access  Private/Admin
export const permanentDeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log("🔥 Suppression définitive catégorie ID:", id);

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée"
      });
    }

    // Supprimer l'image si ce n'est pas l'image par défaut
    if (category.image && category.image !== 'default-category.jpg' && category.image !== '/default-category.jpg') {
      const imagePath = path.join(__dirname, '../../', category.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('🗑️ Image supprimée:', imagePath);
      }
    }

    await Category.findByIdAndDelete(id);

    console.log("✅ Catégorie supprimée définitivement");

    res.json({
      success: true,
      message: "Catégorie supprimée définitivement"
    });
  } catch (error) {
    console.error("❌ Erreur permanentDeleteCategory:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};