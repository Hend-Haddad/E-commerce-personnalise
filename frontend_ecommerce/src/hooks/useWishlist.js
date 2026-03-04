// src/hooks/useWishlist.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { wishlistService } from '../services/wishlistService';
import toast from 'react-hot-toast';

const WISHLIST_STORAGE_KEY = 'wishlist_items';

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState({ items: [], itemCount: 0 });
  const [loading, setLoading] = useState(true);

  const userId = user?._id || user?.id;

  // Charger la wishlist
  const loadWishlist = useCallback(async () => {
    try {
      setLoading(true);
      
      if (userId) {
        // Utilisateur connecté - charger depuis le backend
        const data = await wishlistService.getWishlist();
        if (data?.success) {
          setWishlist({
            items: data.wishlist.items || [],
            itemCount: data.wishlist.itemCount || 0
          });
        }
      } else {
        // Visiteur - charger depuis localStorage
        const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (storedWishlist) {
          const items = JSON.parse(storedWishlist);
          setWishlist({
            items,
            itemCount: items.length
          });
        } else {
          setWishlist({ items: [], itemCount: 0 });
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement wishlist:', error);
      setWishlist({ items: [], itemCount: 0 });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // Sauvegarder dans localStorage (pour visiteurs)
  const saveToLocalStorage = (items) => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    setWishlist({
      items,
      itemCount: items.length
    });
  };

  // Ajouter aux favoris
  const addToWishlist = async (product, productId = product?._id) => {
    const productName = product?.nom || 'Produit';
    const id = productId || product?._id;

    if (!id) {
      toast.error('ID produit manquant');
      return { success: false };
    }

    try {
      if (userId) {
        // Utilisateur connecté
        const result = await wishlistService.addToWishlist(id);
        if (result?.success) {
          await loadWishlist(); // Recharger depuis le backend
          toast.success(`${productName} ajouté aux favoris`);
        }
        return result;
      } else {
        // Visiteur - localStorage
        const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
        const items = storedWishlist ? JSON.parse(storedWishlist) : [];
        
        // Vérifier si déjà présent
        const exists = items.some(item => item.productId === id);
        if (exists) {
          toast.error('Produit déjà dans les favoris');
          return { success: false };
        }

        // Ajouter le produit avec les infos nécessaires
        const newItem = {
          productId: id,
          product: product, // Stocker l'objet produit complet
          added_at: new Date().toISOString()
        };

        const newItems = [...items, newItem];
        saveToLocalStorage(newItems);
        toast.success(`${productName} ajouté aux favoris`);
        
        return { 
          success: true,
          wishlist: { itemCount: newItems.length }
        };
      }
    } catch (error) {
      console.error('❌ Erreur ajout favoris:', error);
      toast.error("Erreur lors de l'ajout aux favoris");
      return { success: false };
    }
  };

  // Retirer des favoris
  const removeFromWishlist = async (productId, productName) => {
    const name = productName || 'Produit';

    try {
      if (userId) {
        // Utilisateur connecté
        const result = await wishlistService.removeFromWishlist(productId);
        if (result?.success) {
          await loadWishlist();
          toast.success(`${name} retiré des favoris`);
        }
        return result;
      } else {
        // Visiteur - localStorage
        const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (storedWishlist) {
          const items = JSON.parse(storedWishlist);
          const newItems = items.filter(item => item.productId !== productId);
          saveToLocalStorage(newItems);
          toast.success(`${name} retiré des favoris`);
        }
        return { success: true };
      }
    } catch (error) {
      console.error('❌ Erreur retrait favoris:', error);
      toast.error("Erreur lors du retrait des favoris");
      return { success: false };
    }
  };

  // Basculer l'état favori
  const toggleWishlist = async (product, productId) => {
    const id = productId || product?._id;
    
    if (!id) {
      toast.error('ID produit manquant');
      return { success: false };
    }

    const isFav = isInWishlist(id);
    
    if (isFav) {
      return await removeFromWishlist(id, product?.nom);
    } else {
      return await addToWishlist(product, id);
    }
  };

  // Vérifier si un produit est dans les favoris
  const isInWishlist = (productId) => {
    if (!productId) return false;
    
    if (userId) {
      // Pour utilisateur connecté
      return wishlist.items.some(item => 
        item.product?._id === productId || item.product_id === productId
      );
    } else {
      // Pour visiteur
      const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (storedWishlist) {
        const items = JSON.parse(storedWishlist);
        return items.some(item => item.productId === productId);
      }
      return false;
    }
  };

  // Obtenir les items complets (pour la page wishlist)
  const getWishlistItems = () => {
    if (userId) {
      return wishlist.items;
    } else {
      const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return storedWishlist ? JSON.parse(storedWishlist) : [];
    }
  };

  // Vider la wishlist
  const clearWishlist = async () => {
    if (userId) {
      // Pour utilisateur connecté - à implémenter si besoin
      toast.error('Fonctionnalité à venir');
    } else {
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
      setWishlist({ items: [], itemCount: 0 });
      toast.success('Wishlist vidée');
    }
  };

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistItems,
    itemCount: userId ? wishlist.itemCount : (() => {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored).length : 0;
    })()
  };
};