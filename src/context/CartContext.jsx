"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { getCartByUserId, addDesignToCart, removeDesignFromCart } from '@/app/acciones/CartActions';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartError, setCartError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (status === 'authenticated' && userId) {
      setLoadingCart(true);
      setCartError(null);
      const { cart, error: fetchError } = await getCartByUserId(userId);
      if (fetchError) {
        setCartError({ message: fetchError });
        setCartItems([]);
      } else {
        setCartItems(cart?.items || []);
      }
      setLoadingCart(false);
    } else if (status === 'unauthenticated') {
      setLoadingCart(false);
      setCartItems([]);
    }
  }, [status, userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateCart = useCallback((newCartItems) => {
    setCartItems(newCartItems);
  }, []);

  const addItem = useCallback(async (item) => {
    if (!userId) {
      console.warn("No user ID available. Cannot add item to cart.");
      return;
    }

    setLoadingCart(true);
    setCartError(null);

    try {
      const { success, message, data: cart } = await addDesignToCart(userId, item);
      if (success) {
        setCartItems(cart?.items || []);
      } else {
        setCartError({ message: message || "Error al agregar el item al carrito." });
      }
    } catch (error) {
      setCartError({ message: "Error de red al agregar el item al carrito." });
      console.error("Error adding item to cart:", error);
    } finally {
      setLoadingCart(false);
    }
  }, [userId]);

  const removeItem = useCallback(async (designId) => {
    if (!userId) {
      console.warn("No user ID available. Cannot remove item from cart.");
      return;
    }

    setLoadingCart(true);
    setCartError(null);

    try {
      const { success, message, data: cart } = await removeDesignFromCart(userId, designId);
      if (success) {
        setCartItems(cart?.items || []);
      } else {
        setCartError({ message: message || "Error al eliminar el item del carrito." });
      }
    } catch (error) {
      setCartError({ message: "Error de red al eliminar el item del carrito." });
      console.error("Error removing item from cart:", error);
    } finally {
      setLoadingCart(false);
    }
  }, [userId]);

  const value = {
    cartItems,
    loadingCart,
    cartError,
    fetchCart,
    updateCart,
    addItem,
    removeItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
