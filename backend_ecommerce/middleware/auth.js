// backend/src/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;
    console.log("🔍 Headers reçus:", req.headers.authorization);

    // Vérifier le token dans les headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      console.log("🔍 Token extrait:", token ? token.substring(0, 20) + "..." : "pas de token");
    }

    if (!token) {
      console.log("❌ Token manquant");
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé - Token manquant"
      });
    }

    // Vérifier le token
    console.log("🔍 Vérification du token avec JWT_SECRET");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔍 Token décodé avec succès, userId:", decoded.id);

    // Récupérer l'utilisateur
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      console.log("❌ Utilisateur non trouvé en base");
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    console.log("✅ Utilisateur authentifié:", user.email, "rôle:", user.role);
    
    // Ajouter l'utilisateur à la requête
    req.user = user;
    
    // ✅ TRÈS IMPORTANT: Appeler next() pour passer au middleware suivant
    next();
    
  } catch (error) {
    console.error("❌ Erreur d'authentification:", error.message);
    
    // Messages d'erreur plus précis
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Token invalide - Format incorrect"
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expiré - Veuillez vous reconnecter"
      });
    }
    
    return res.status(401).json({
      success: false,
      message: "Token invalide ou expiré"
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      console.log("🔍 Authorize - req.user:", req.user ? req.user.email : "pas de user");
      console.log("🔍 Rôles requis:", roles);
      console.log("🔍 Rôle utilisateur:", req.user?.role);

      if (!req.user) {
        console.log("❌ Utilisateur non authentifié - req.user manquant");
        return res.status(401).json({
          success: false,
          message: "Utilisateur non authentifié"
        });
      }

      if (!roles.includes(req.user.role)) {
        console.log(`❌ Rôle ${req.user.role} non autorisé`);
        return res.status(403).json({
          success: false,
          message: "Accès interdit - Vous n'avez pas les droits nécessaires"
        });
      }

      console.log("✅ Autorisation réussie");
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