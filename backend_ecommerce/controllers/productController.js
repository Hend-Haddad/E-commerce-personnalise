// backend/src/controllers/productController.js
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Créer un produit avec plusieurs images (Admin uniquement)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { nom, description, prix, categorie_id, quantite_stock } = req.body;
    
    console.log("📝 Création produit - Données reçues:", req.body);
    console.log("📸 Fichiers reçus:", req.files?.length || 0, "images");

    // Vérifier si la catégorie existe
    const category = await Category.findById(categorie_id);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Catégorie non trouvée"
      });
    }

    // Vérifier si le produit existe déjà
    const existingProduct = await Product.findOne({ nom });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Un produit avec ce nom existe déjà"
      });
    }

    // Générer les URLs des images
    let images = [];
    let image_principale = "default-product.jpg";
    
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
      image_principale = images[0]; // La première image devient l'image principale
    }

    const product = await Product.create({
      nom,
      description,
      prix: parseFloat(prix),
      categorie_id,
      quantite_stock: parseInt(quantite_stock) || 0,
      images,
      image_principale
    });

    // Populer la catégorie pour la réponse
    const populatedProduct = await Product.findById(product._id).populate('categorie_id', 'nom');

    console.log("✅ Produit créé avec", images.length, "images");

    res.status(201).json({
      success: true,
      message: "Produit créé avec succès",
      product: populatedProduct
    });
  } catch (error) {
    console.error("❌ Erreur createProduct:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Récupérer tous les produits (Public)
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  try {
    const { categorie, search, minPrix, maxPrix, sort } = req.query;
    
    let query = { actif: true };
    
    // Filtre par catégorie
    if (categorie) {
      query.categorie_id = categorie;
    }
    
    // Recherche textuelle
    if (search) {
      query.$text = { $search: search };
    }
    
    // Filtre par prix
    if (minPrix || maxPrix) {
      query.prix = {};
      if (minPrix) query.prix.$gte = Number(minPrix);
      if (maxPrix) query.prix.$lte = Number(maxPrix);
    }
    
    // Options de tri
    let sortOption = {};
    if (sort === 'prix_asc') sortOption.prix = 1;
    else if (sort === 'prix_desc') sortOption.prix = -1;
    else if (sort === 'nom_asc') sortOption.nom = 1;
    else if (sort === 'nom_desc') sortOption.nom = -1;
    else if (sort === 'recent') sortOption.date_ajout = -1;
    else sortOption.date_ajout = -1;
    
    const products = await Product.find(query)
      .populate('categorie_id', 'nom')
      .sort(sortOption);

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error("❌ Erreur getAllProducts:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Récupérer un produit par ID (Public)
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categorie_id', 'nom');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé"
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error("❌ Erreur getProductById:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mettre à jour un produit avec plusieurs images (Admin uniquement)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { nom, description, prix, categorie_id, quantite_stock, actif, imagesToKeep } = req.body;
    const { id } = req.params;

    console.log("📝 Mise à jour produit ID:", id);
    console.log("📸 Nouvelles images reçues:", req.files?.length || 0);
    console.log("📦 Images à conserver:", imagesToKeep);

    let product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé"
      });
    }

    // Vérifier si la catégorie existe
    if (categorie_id) {
      const category = await Category.findById(categorie_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Catégorie non trouvée"
        });
      }
    }

    // Vérifier si le nouveau nom existe déjà (sauf pour le même produit)
    if (nom && nom !== product.nom) {
      const existingProduct = await Product.findOne({ nom });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: "Un produit avec ce nom existe déjà"
        });
      }
    }

    // Gérer les images
    let images = product.images || [];
    let image_principale = product.image_principale;

    // Si on reçoit une liste d'images à conserver
    if (imagesToKeep) {
      const imagesToKeepArray = JSON.parse(imagesToKeep);
      
      // Supprimer les images qui ne sont plus conservées
      const imagesToDelete = images.filter(img => !imagesToKeepArray.includes(img));
      imagesToDelete.forEach(imagePath => {
        const fullPath = path.join(__dirname, '../../', imagePath);
        if (fs.existsSync(fullPath) && imagePath !== '/default-product.jpg') {
          fs.unlinkSync(fullPath);
          console.log('🗑️ Image supprimée:', imagePath);
        }
      });

      images = imagesToKeepArray;
    }

    // Ajouter les nouvelles images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      images = [...images, ...newImages];
      
      // Si c'est la première image ou si l'image principale n'existe plus
      if (!image_principale || image_principale === 'default-product.jpg' || !images.includes(image_principale)) {
        image_principale = images[0];
      }
    }

    product = await Product.findByIdAndUpdate(
      id,
      { 
        nom: nom || product.nom,
        description: description || product.description,
        prix: prix ? parseFloat(prix) : product.prix,
        categorie_id: categorie_id || product.categorie_id,
        quantite_stock: quantite_stock !== undefined ? parseInt(quantite_stock) : product.quantite_stock,
        images,
        image_principale,
        actif: actif !== undefined ? actif : product.actif,
        date_modification: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('categorie_id', 'nom');

    console.log("✅ Produit mis à jour avec", images.length, "images");

    res.json({
      success: true,
      message: "Produit mis à jour avec succès",
      product
    });
  } catch (error) {
    console.error("❌ Erreur updateProduct:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Désactiver un produit (Soft Delete - Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log("🗑️ Désactivation produit ID:", id);

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé"
      });
    }

    // Supprimer les images si ce ne sont pas des images par défaut
    if (product.images && product.images.length > 0) {
      product.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '../../', imagePath);
        if (fs.existsSync(fullPath) && imagePath !== '/default-product.jpg') {
          fs.unlinkSync(fullPath);
          console.log('🗑️ Image supprimée:', imagePath);
        }
      });
    }

    // Soft delete
    product.actif = false;
    product.date_modification = Date.now();
    await product.save();

    console.log("✅ Produit désactivé:", product.nom);

    res.json({
      success: true,
      message: "Produit désactivé avec succès"
    });
  } catch (error) {
    console.error("❌ Erreur deleteProduct:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Réactiver un produit (Admin uniquement)
// @route   PUT /api/products/:id/reactivate
// @access  Private/Admin
export const reactivateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé"
      });
    }

    product.actif = true;
    product.date_modification = Date.now();
    await product.save();

    res.json({
      success: true,
      message: "Produit réactivé avec succès"
    });
  } catch (error) {
    console.error("❌ Erreur reactivateProduct:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Supprimer définitivement un produit (Admin uniquement)
// @route   DELETE /api/products/:id/permanent
// @access  Private/Admin
export const permanentDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé"
      });
    }

    // Supprimer les images si ce ne sont pas des images par défaut
    if (product.images && product.images.length > 0) {
      product.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '../../', imagePath);
        if (fs.existsSync(fullPath) && imagePath !== '/default-product.jpg') {
          fs.unlinkSync(fullPath);
          console.log('🗑️ Image supprimée:', imagePath);
        }
      });
    }

    await Product.findByIdAndDelete(id);

    console.log("🔥 Produit supprimé définitivement:", product.nom);

    res.json({
      success: true,
      message: "Produit supprimé définitivement"
    });
  } catch (error) {
    console.error("❌ Erreur permanentDeleteProduct:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mettre à jour le stock (Admin uniquement)
// @route   PUT /api/products/:id/stock
// @access  Private/Admin
export const updateStock = async (req, res) => {
  try {
    const { quantite_stock } = req.body;
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé"
      });
    }

    product.quantite_stock = quantite_stock;
    product.date_modification = Date.now();
    await product.save();

    res.json({
      success: true,
      message: "Stock mis à jour avec succès",
      product
    });
  } catch (error) {
    console.error("❌ Erreur updateStock:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};