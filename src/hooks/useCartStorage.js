"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { addDesignToCart, removeDesignFromCart, getCartByUserId, clearUserCart } from '@/app/acciones/CartActions';

export const useCartStorage = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Effect to load cart from localStorage and then synchronize with DB
  useEffect(() => {
    const loadAndSyncCart = async () => {
      if (typeof window !== 'undefined') {
        const storedCart = localStorage.getItem('cartItems');
        let localCart = storedCart ? JSON.parse(storedCart) : [];
        setCartItems(localCart);

        if (status === 'authenticated' && userId) {
          // Fetch server cart
          const { cart: serverCart, error } = await getCartByUserId(userId);
          if (error) {
            console.error('Error fetching server cart:', error);
            // Optionally handle error, e.g., by not syncing or showing a message
          } else if (serverCart) {
            // Merge local cart with server cart, prioritizing server quantities if applicable
            // For simplicity, we'll just use server cart designIds and fetch full design details later
            // For now, we'll just ensure local cart reflects server's design IDs
            const mergedCartItems = [];
            const serverDesignIds = serverCart.designIds || [];

            // Add items from server cart
            // The server now returns full design details in serverCart.items
            if (serverCart.items) {
              for (const serverItem of serverCart.items) {
                mergedCartItems.push({
                  id: serverItem.id,
                  name: serverItem.nombre, // Map nombre to name
                  price: serverItem.price,
                  image: serverItem.imagen, // Map imagen to image
                  quantity: serverItem.quantity,
                });
              }
            }

            // Add items from local storage that are not in server cart
            for (const localItem of localCart) {
              if (!serverDesignIds.includes(localItem.id)) {
                mergedCartItems.push(localItem);
              }
            }
            setCartItems(mergedCartItems);
            localStorage.setItem('cartItems', JSON.stringify(mergedCartItems));
          } else {
            // If no server cart, ensure local cart is saved to server if not empty
            if (localCart.length > 0) {
              for (const item of localCart) {
                await addDesignToCart(userId, item.id); // Add each item to server cart
              }
            }
          }
        }
        setIsInitialized(true);
      }
    };

    loadAndSyncCart();
  }, [status, userId]); // Rerun when session status or userId changes

  // Effect to save cart to localStorage whenever cartItems changes
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);


  const addItem = async (item) => {
    if (!userId) {
      console.warn('User not authenticated. Item added to local cart only.');
      setCartItems((prevItems) => {
        const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
          return prevItems.map(cartItem =>
            cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
          );
        } else {
          // Ensure item has name, price, image even for local-only add
          return [...prevItems, {
            id: item.id,
            name: item.nombre || item.name, // Use nombre if available, else name
            price: parseFloat(item.price) || 0, // Ensure price is a number
            image: item.imagen || item.image, // Use imagen if available, else image
            quantity: 1
          }];
        }
      });
      return;
    }

    // Attempt to add to server cart first
    const { success, message } = await addDesignToCart(userId, item.id);

    if (success) {
      // After successful server update, re-fetch the cart to get populated details
      const { cart: updatedServerCart, error: fetchError } = await getCartByUserId(userId);
      if (fetchError) {
        console.error('Error re-fetching cart after add:', fetchError);
        // Fallback to local update if server fetch fails
        setCartItems((prevItems) => {
          const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
          if (existingItem) {
            return prevItems.map(cartItem =>
              cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
            );
          } else {
            return [...prevItems, {
              id: item.id,
              name: item.nombre || item.name,
              price: parseFloat(item.price) || 0,
              image: item.imagen || item.image,
              quantity: 1
            }];
          }
        });
      } else if (updatedServerCart && updatedServerCart.items) {
        // Update local state with the fully populated cart from the server
        setCartItems(updatedServerCart.items.map(serverItem => ({
          id: serverItem.id,
          name: serverItem.nombre,
          price: serverItem.price,
          image: serverItem.imagen,
          quantity: serverItem.quantity,
        })));
      }
    } else {
      console.error('Failed to add item to server cart:', message);
      // Optionally, revert local state or show error to user
    }
  };

  const removeItem = async (itemId) => {
    if (!userId) {
      console.warn('User not authenticated. Item removed from local cart only.');
      setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
      return;
    }

    const { success, message } = await removeDesignFromCart(userId, itemId);

    if (success) {
      setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
    } else {
      console.error('Failed to remove item from server cart:', message);
    }
  };

  const updateQuantity = (itemId, quantity) => {
    // This function currently only updates local state.
    // If quantity needs to be persisted on server, a new server action would be needed.
    setCartItems((prevItems) => {
      return prevItems
        .map(item =>
          item.id === itemId ? { ...item, quantity: quantity } : item
        )
        .filter(item => item.quantity > 0);
    });
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = async () => {
    if (!userId) {
      console.warn('User not authenticated. Local cart cleared only.');
      setCartItems([]);
      return;
    }

    const { success, message } = await clearUserCart(userId);

    if (success) {
      setCartItems([]);
    } else {
      console.error('Failed to clear server cart:', message);
    }
  };

  return { cartItems, addItem, removeItem, updateQuantity, getTotal, clearCart };
};
