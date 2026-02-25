// backend/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Vérifiez que process.env.MONGO_URI contient bien le nom de la base
    console.log("🔍 Connexion à:", process.env.MONGO_URI);
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connecté");
    console.log("📊 Base de données:", mongoose.connection.name); // Affiche le nom
  } catch (error) {
    console.error("❌ Erreur MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;