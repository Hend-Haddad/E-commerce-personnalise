import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { nom, prenom, email, password, telephone, adresse } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nom,
      prenom,
      email,
      password: hashedPassword,
      telephone,
      adresse,
    });

    res.status(201).json({ message: "Compte créé", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ NOUVEAU : Mettre à jour le profil utilisateur
export const updateProfile = async (req, res) => {
  try {
    const { nom, prenom, telephone, adresse } = req.body;
    const userId = req.user.id; // Récupéré depuis le middleware protect

    console.log("📝 Mise à jour profil - ID:", userId);
    console.log("📦 Données reçues:", { nom, prenom, telephone, adresse });

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    // Mettre à jour les champs
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        nom: nom || user.nom,
        prenom: prenom || user.prenom,
        telephone: telephone || user.telephone,
        adresse: adresse || user.adresse
      },
      { new: true, runValidators: true }
    ).select('-password'); // Exclure le mot de passe de la réponse

    console.log("✅ Profil mis à jour:", updatedUser);

    res.json({
      success: true,
      message: "Profil mis à jour avec succès",
      user: updatedUser
    });

  } catch (error) {
    console.error("❌ Erreur updateProfile:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Récupérer le profil
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Vérifier le mot de passe actuel
export const verifyPassword = async (req, res) => {
  try {
    const { currentPassword } = req.body;
    const userId = req.user.id; // Récupéré depuis le middleware protect

    console.log("🔍 Vérification mot de passe - ID utilisateur:", userId);

    // Récupérer l'utilisateur avec son mot de passe
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    console.log("✅ Résultat vérification:", isMatch);

    res.json({
      success: true,
      valid: isMatch
    });

  } catch (error) {
    console.error("❌ Erreur verifyPassword:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Changer le mot de passe
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    console.log("🔍 Changement mot de passe - ID utilisateur:", userId);

    // Validation du nouveau mot de passe
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 6 caractères"
      });
    }

    // Récupérer l'utilisateur avec son mot de passe
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    // Vérifier le mot de passe actuel
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Mot de passe actuel incorrect"
      });
    }

    // Hasher et sauvegarder le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log("✅ Mot de passe modifié avec succès");

    res.json({
      success: true,
      message: "Mot de passe modifié avec succès"
    });

  } catch (error) {
    console.error("❌ Erreur changePassword:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};