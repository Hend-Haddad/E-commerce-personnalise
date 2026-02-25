// backend/scripts/createAdmin.js
import User from "../models/User.js";
import bcrypt from "bcrypt";

/**
 * Crée un compte admin par défaut si aucun admin n'existe
 * @returns {Promise<Object|null>} L'admin créé ou null s'il existe déjà
 */
export const createDefaultAdmin = async () => {
  try {
    // Vérifier si un admin existe déjà
    const adminExists = await User.findOne({ role: "admin" });
    
    if (adminExists) {
      console.log("ℹ️ Un admin existe déjà dans la base de données");
      return null;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Créer l'admin
    const admin = await User.create({
      nom: "Admin",
      prenom: "Super",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
      actif: true,
      
    });

    console.log("✅ Admin par défaut créé avec succès !");
    console.log("📧 Email: admin@site.com");
    console.log("🔑 Mot de passe: admin123");
    console.log("⚠️  Changez ces identifiants en production !");

    return admin;

  } catch (error) {
    console.error("❌ Erreur lors de la création de l'admin:", error.message);
    throw error; // Propage l'erreur pour la gestion dans app.js
  }
};

/**
 * Supprime tous les admins (utile pour les tests)
 * À utiliser avec précaution !
 */
export const deleteAllAdmins = async () => {
  try {
    const result = await User.deleteMany({ role: "admin" });
    console.log(`🗑️ ${result.deletedCount} admin(s) supprimé(s)`);
    return result;
  } catch (error) {
    console.error("❌ Erreur lors de la suppression:", error.message);
    throw error;
  }
};

// Si le script est exécuté directement (node scripts/createAdmin.js)
if (import.meta.url === `file://${process.argv[1]}`) {
  import("../config/db.js").then(async ({ default: connectDB }) => {
    await connectDB();
    await createDefaultAdmin();
    process.exit(0);
  }).catch(err => {
    console.error("Erreur:", err);
    process.exit(1);
  });
}