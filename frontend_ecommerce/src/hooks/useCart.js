// src/hooks/useCart.js - Version corrigée

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { cartService } from '../services/cartService';
import toast from 'react-hot-toast';

export const useCart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const userId = user?._id || user?.id;
  
  console.log('🔄 useCart - user:', userId ? `Connecté: ${userId}` : 'Visiteur');
  console.log('🔄 useCart - sessionId:', sessionId);

  // ============================================
  // GESTION DE LA SESSION POUR LES VISITEURS
  // ============================================
  useEffect(() => {
    if (!userId) {
      // Visiteur : gérer la sessionId
      let sid = localStorage.getItem('cart_session_id');
      
      if (!sid) {
        sid = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('cart_session_id', sid);
        console.log('🆕 Nouvelle session créée pour visiteur:', sid);
      } else {
        console.log('🔄 Session existante pour visiteur:', sid);
      }
      
      setSessionId(sid);
    } else {
      // Utilisateur connecté : PAS de sessionId
      console.log('👤 Utilisateur connecté - pas de sessionId');
      setSessionId(null);
    }
    
    setInitialized(true);
  }, [userId]);

  // ============================================
  // CHARGER LE PANIER
  // ============================================
  const loadCart = useCallback(async () => {
    if (!initialized) {
      console.log('⏳ loadCart - Pas encore initialisé');
      return;
    }

    try {
      setLoading(true);
      console.log('📦 loadCart - DÉBUT - user:', userId ? 'connecté' : 'visiteur');
      
      // 🔴 IMPORTANT: Pour les utilisateurs connectés, on ne passe PAS de sessionId
      // Pour les visiteurs, on passe la sessionId
      const currentSessionId = !userId ? (sessionId || localStorage.getItem('cart_session_id')) : null;
      
      console.log('   - userId:', userId || 'visiteur');
      console.log('   - sessionId utilisée:', currentSessionId);
      console.log('   - user object passé:', user ? 'oui' : 'non');
      
      // Appel API - on passe l'utilisateur pour que le service puisse ajouter le token
      const data = await cartService.getCart(user, currentSessionId);
      
      console.log('📦 loadCart - Données reçues:', data);
      
      if (data?.success && data?.cart) {
        console.log('✅ Panier chargé:', data.cart);
        
        // Formater les items
        const formattedItems = data.cart.items?.map(item => ({
          ...item,
          id: item.id || item._id,
          product: item.product || item.produit,
          prix_unitaire: item.prix_unitaire || item.price_unitaire || item.price_at_time
        })) || [];
        
        setCart({
          id: data.cart.id,
          items: formattedItems,
          total: data.cart.total || 0,
          itemCount: data.cart.itemCount || formattedItems.length
        });
        
        // Pour les visiteurs, sauvegarder la sessionId si retournée
        if (data.cart.sessionId && !userId) {
          localStorage.setItem('cart_session_id', data.cart.sessionId);
          setSessionId(data.cart.sessionId);
        }
      } else {
        setCart({ items: [], total: 0, itemCount: 0 });
      }
    } catch (error) {
      console.error('❌ Erreur loadCart:', error);
      setCart({ items: [], total: 0, itemCount: 0 });
    } finally {
      setLoading(false);
      console.log('📦 loadCart - FIN, loading = false');
    }
  }, [user, userId, sessionId, initialized]);

  // Charger au démarrage
  useEffect(() => {
    if (initialized) {
      loadCart();
    }
  }, [initialized, loadCart]);

  // ============================================
  // AJOUTER AU PANIER
  // ============================================
  // Dans src/hooks/useCart.js - Vérifiez cette partie
const addToCart = async (productId, quantity = 1) => {
  try {
    console.log('='.repeat(50));
    console.log('➕ HOOK addToCart - DÉBUT');
    console.log('   - user:', userId ? `Connecté (${userId})` : 'Visiteur');
    console.log('   - user object:', user ? 'présent' : 'absent');
    
    // 🔴 IMPORTANT: Pour les connectés, on passe user, PAS sessionId
    const currentSessionId = !userId ? sessionId : null;
    
    console.log('   - sessionId utilisée:', currentSessionId);
    
    // Appel au service - on passe user pour les connectés
    const result = await cartService.addToCart(
      productId, 
      quantity, 
      user,  // ← Ceci est CRITIQUE - doit être passé
      currentSessionId
    );

    console.log('📥 Résultat:', result);

    if (result?.success) {
      if (result.cart?.sessionId && !userId) {
        localStorage.setItem('cart_session_id', result.cart.sessionId);
        setSessionId(result.cart.sessionId);
      }
      
      await loadCart();
      toast.success('Produit ajouté au panier');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Erreur addToCart:', error);
    toast.error("Erreur lors de l'ajout au panier");
    return { success: false };
  }
};

  // ============================================
  // AUTRES FONCTIONS (updateQuantity, removeFromCart, etc.)
  // ============================================
  const updateQuantity = async (itemId, quantity) => {
    try {
      if (quantity < 1) return { success: false };
      
      const currentSessionId = !userId ? sessionId : null;
      
      const result = await cartService.updateQuantity(
        itemId, 
        quantity, 
        user,
        currentSessionId
      );
      
      if (result?.success) {
        await loadCart();
        toast.success('Quantité mise à jour');
      }
      
      return result;
    } catch (error) {
      console.error('❌ Erreur updateQuantity:', error);
      toast.error('Erreur lors de la mise à jour');
      return { success: false };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const currentSessionId = !userId ? sessionId : null;
      
      const result = await cartService.removeFromCart(
        itemId, 
        user,
        currentSessionId
      );
      
      if (result?.success) {
        await loadCart();
        toast.success('Article supprimé');
      }
      
      return result;
    } catch (error) {
      console.error('❌ Erreur removeFromCart:', error);
      toast.error('Erreur lors de la suppression');
      return { success: false };
    }
  };

  const clearCart = async () => {
    try {
      const currentSessionId = !userId ? sessionId : null;
      
      const result = await cartService.clearCart(user, currentSessionId);
      
      if (result?.success) {
        setCart({ items: [], total: 0, itemCount: 0 });
        toast.success('Panier vidé');
      }
      
      return result;
    } catch (error) {
      console.error('❌ Erreur clearCart:', error);
      toast.error('Erreur lors du vidage');
      return { success: false };
    }
  };

  const checkout = async (orderData) => {
    if (!userId) {
      toast.error('Veuillez vous connecter pour passer commande');
      return { success: false, requiresAuth: true };
    }

    try {
      const result = await cartService.checkout(cart.id, orderData);
      
      if (result?.success) {
        setCart({ items: [], total: 0, itemCount: 0 });
        toast.success('Commande créée !');
      }
      
      return result;
    } catch (error) {
      console.error('❌ Erreur checkout:', error);
      toast.error('Erreur lors de la commande');
      return { success: false };
    }
  };

  return {
    cart,
    loading,
    sessionId,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkout,
    itemCount: cart.itemCount || 0
  };
};