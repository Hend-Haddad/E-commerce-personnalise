import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price_at_time: {
    type: Number,
    required: true
  },
  added_at: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  session_id: {
    type: String,
    default: null
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["actif", "converti", "abandonné"],
    default: "actif"
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

// SUPPRIMEZ COMPLÈTEMENT CE BLOC :
// cartSchema.pre('save', function(next) {
//   console.log('💰 Calcul du total pour le panier', this._id);
//   this.total = this.items.reduce((sum, item) => {
//     return sum + (item.price_at_time * item.quantity);
//   }, 0);
//   console.log('💰 Total calculé:', this.total);
//   next();
// });

export default mongoose.model("Cart", cartSchema);