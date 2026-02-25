import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["client", "admin"],
      default: "client",
    },

    telephone: String,

    adresse: String, // utilisé seulement pour client

    actif: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export default mongoose.model("User", userSchema);