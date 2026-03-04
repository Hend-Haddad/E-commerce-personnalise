// backend/src/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;
    console.log("🔍 Headers reçus:", req.headers.authorization);

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      console.log("🔍 Token extrait:", token ? token.substring(0, 20) + "..." : "pas de token");
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé - Token manquant"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔍 Token décodé:", decoded);

    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    console.log("✅ Utilisateur authentifié:", user.email);
    req.user = user;  // ← Ici c'est l'OBJET utilisateur complet
    next();
    
  } catch (error) {
    console.error("❌ Erreur d'authentification:", error.message);
    return res.status(401).json({
      success: false,
      message: "Token invalide ou expiré"
    });
  }
};


export const optionalAuth = async (req, res, next) => {
  try {
    console.log('='.repeat(50));
    console.log('🔍 optionalAuth - DEBUT');
    console.log('Headers authorization:', req.headers.authorization);
    
    // Vérifier si le header Authorization existe
    if (!req.headers.authorization) {
      console.log('ℹ️ optionalAuth - Pas de header Authorization');
      req.user = null;
      return next();
    }

    // Vérifier le format Bearer
    if (!req.headers.authorization.startsWith('Bearer')) {
      console.log('⚠️ optionalAuth - Format incorrect, pas de Bearer');
      req.user = null;
      return next();
    }

    // Extraire le token
    const token = req.headers.authorization.split(' ')[1];
    console.log('🔍 optionalAuth - Token extrait:', token.substring(0, 20) + '...');

    if (!token) {
      console.log('⚠️ optionalAuth - Token vide');
      req.user = null;
      return next();
    }

    try {
      // Décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ optionalAuth - Token décodé avec succès:', decoded);
      
      // Récupérer l'utilisateur COMPLET depuis la base de données
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log('❌ optionalAuth - Utilisateur non trouvé en base pour ID:', decoded.id);
        req.user = null;
        return next();
      }

      // ✅ ATTACHER L'UTILISATEUR COMPLET À req.user
      req.user = user;
      console.log('✅ optionalAuth - UTILISATEUR AUTHENTIFIÉ:', user.email, 'ID:', user._id);
      console.log('✅ optionalAuth - req.user est maintenant:', req.user._id);
      
    } catch (jwtError) {
      console.error('❌ optionalAuth - Erreur JWT:', jwtError.message);
      req.user = null;
    }
    
    console.log('='.repeat(50));
    next();
    
  } catch (error) {
    console.error('❌ optionalAuth - Erreur générale:', error);
    req.user = null;
    next();
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Utilisateur non authentifié"
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Accès interdit - Vous n'avez pas les droits nécessaires"
        });
      }

      next();
    } catch (error) {
      console.error("❌ Erreur authorize:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur"
      });
    }
  };
};