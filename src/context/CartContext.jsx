"use client";

import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addItem = (item) => {
    setCartItems((prevItems) => {
<<<<<<< HEAD
      // Check if item already exists in cart
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);

      if (existingItem) {
        // If exists, update quantity (assuming items have a quantity property)
        // If not, you might want to handle this differently based on your needs
=======
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
        return prevItems.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
<<<<<<< HEAD
        // If not exists, add with quantity 1
=======
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    setCartItems((prevItems) => {
<<<<<<< HEAD
      return prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: quantity } : item
      ).filter(item => item.quantity > 0); // Remove if quantity is 0 or less
=======
      return prevItems
        .map(item =>
          item.id === itemId ? { ...item, quantity: quantity } : item
        )
        .filter(item => item.quantity > 0);
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
    });
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

<<<<<<< HEAD
  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, updateQuantity, getTotal }}>
=======
  // Aquí agrego clearCart sin modificar nada más
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, updateQuantity, getTotal, clearCart }}>
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
