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
    cb(null, 'category-' + uniqueSuffix + ext);
  }
});

// Filtrer les types de fichiers - Version améliorée avec plus de formats
const fileFilter = (req, file, cb) => {
  // Liste étendue des types MIME acceptés
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/x-icon'
  ];

  // Extensions autorisées
  const allowedExtensions = /jpeg|jpg|png|gif|webp|svg|bmp|ico/i;
  
  // Vérifier l'extension
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  
  // Vérifier le type MIME
  const mimetype = allowedMimes.includes(file.mimetype.toLowerCase());

  console.log('📸 Fichier reçu:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    extension: path.extname(file.originalname),
    size: file.size
  });

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    const error = new Error(
      `Format non supporté. Types acceptés: ${allowedExtensions.source}`
    );
    error.status = 400;
    cb(error, false);
  }
};

// Limiter la taille des fichiers (5MB max)
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1 // Un seul fichier
  },
  fileFilter: fileFilter
});

// Middleware pour upload simple (une seule image)
export const uploadSingle = upload.single('image');

// Middleware pour upload multiple (pour les produits)
export const uploadMultiple = upload.array('images', 10);

// Middleware de gestion d'erreurs pour multer
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Erreur Multer (taille, nombre de fichiers, etc.)
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Fichier trop volumineux. Taille maximum: 5MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Trop de fichiers. Maximum: 10 images'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    // Autres erreurs
    return res.status(400).json({
      success: false,
      message: err.message || 'Erreur lors de l\'upload'
    });
  }
  next();
};

export default upload;