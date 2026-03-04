// backend/src/middleware/upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Créer le dossier uploads s'il n'existe pas
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Générer un nom unique pour éviter les conflits
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    
    // Préfixe différent selon le type (produit ou catégorie)
    const prefix = file.fieldname === 'image' ? 'category' : 'product';
    cb(null, prefix + '-' + uniqueSuffix + ext);
  }
});

// Filtrer les types de fichiers
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp'
  ];

  console.log('📸 Fichier reçu:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    fieldname: file.fieldname
  });

  if (allowedMimes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error(`Format non supporté. Types acceptés: JPG, PNG, GIF, WEBP`), false);
  }
};

// ✅ Configuration pour UPLOAD MULTIPLE (produits - champ "images")
export const uploadMultiple = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max par fichier
  fileFilter: fileFilter
}).array('images', 10); // ← 10 images max

// ✅ Configuration pour UPLOAD SINGLE (catégories - champ "image")
export const uploadSingle = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter
}).single('image'); // ← Une seule image

// Middleware de gestion d'erreurs
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('❌ Erreur Multer:', err);
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Fichier trop volumineux. Taille maximum: 5MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: `Trop de fichiers. Maximum: ${err.field === 'images' ? '10 images' : '1 image'}`
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Champ de fichier incorrect. Utilisez "images" pour les produits ou "image" pour les catégories'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    console.error('❌ Erreur upload:', err);
    return res.status(400).json({
      success: false,
      message: err.message || 'Erreur lors de l\'upload'
    });
  }
  next();
};

// Export par défaut pour compatibilité
export default {
  uploadMultiple,
  uploadSingle,
  handleUploadError
};