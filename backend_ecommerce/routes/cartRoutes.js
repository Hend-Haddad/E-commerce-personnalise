import express from "express";
import { 
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart
  // Ne pas importer mergeCart
} from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";


const router = express.Router();

// Middleware pour logger toutes les requêtes
router.use((req, res, next) => {
  console.log(`🛒 Route cart: ${req.method} ${req.url}`, {
    body: req.body,
    query: req.query,
    user: req.user ? req.user.id : 'no user'
  });
  next();
});

router.route("/")
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);



router.route("/:itemId")
  .put(updateCartItem)
  .delete(removeFromCart);
router.post('/cart/merge', protect, mergeCart);
export default router;