"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { getCartByUserId } from '@/app/acciones/CartActions';

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

  const value = {
    cartItems,
    loadingCart,
    cartError,
    fetchCart,
    updateCart,
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
