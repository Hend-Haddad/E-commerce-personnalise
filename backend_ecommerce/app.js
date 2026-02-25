// backend/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";

import { createDefaultAdmin } from "./scripts/createAdmin.js";
// backend/src/app.js (ajoutez ces lignes)
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir les fichiers statiques du dossier uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Route de test
app.get("/api/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "API fonctionne correctement",
    timestamp: new Date().toISOString()
  });
});

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
// Route 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} non trouvée` 
  });
});

// Gestion erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || "Erreur serveur"
  });
});

// Connexion DB et création admin
connectDB()
  .then(() => {
    console.log("✅ Base de données connectée");
    return createDefaultAdmin(); // Appel de la fonction importée
  })
  .catch(error => {
    console.error("❌ Erreur au démarrage:", error);
  });

export default app;