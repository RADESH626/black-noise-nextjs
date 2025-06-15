'use client'

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import HeaderPrincipal from '@/components/layout/general/HeaderPrincipal';
import Footer from '@/components/layout/general/footer/Footer';
import CatalogTabs from '@/components/catalogo/CatalogTabs';
import NewPostSection from '@/components/catalogo/NewPostSection';
import DesignGrid from '@/components/catalogo/DesignGrid';
import { addDesignToCart } from '@/app/acciones/CartActions'; // Only addDesignToCart is needed here
import { obtenerDesigns } from '@/app/acciones/DesignActions'; // Import obtenerDesigns
import { useSession } from 'next-auth/react'; // Import useSession
import { useCart } from '@/context/CartContext'; // Import useCart

const ComunidadDiseños = () => {
  const [activo, setActivo] = useState('diseños');
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { cartItems, updateCart } = useCart();
  const debounceTimeoutRef = useRef(null);
  const optimisticCartStateRef = useRef([]);

  const [allDesigns, setAllDesigns] = useState([]);
  const [loadingDesigns, setLoadingDesigns] = useState(true);
  const [errorDesigns, setErrorDesigns] = useState(null);

  useEffect(() => {
    async function fetchDesigns() {
      try {
        setLoadingDesigns(true);
        const result = await obtenerDesigns();
        if (result?.data) {
          setAllDesigns(result.data);
        } else {
          setErrorDesigns(result?.error || "Error al cargar los diseños.");
        }
      } catch (err) {
        setErrorDesigns("Error de red o del servidor al cargar diseños: " + err.message);
      } finally {
        setLoadingDesigns(false);
      }
    }
    fetchDesigns();
  }, []);

  const tarjetas = useMemo(() => activo === 'diseños' ? allDesigns : allDesigns, [activo, allDesigns]);

  const handleAddItemToCart = useCallback(async (item) => {
    if (!userId) {
      // Consider a more user-friendly notification than alert
      console.warn("Debes iniciar sesión para agregar ítems al carrito.");
      return;
    }

    // Optimistic update
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item._id.toString());
    let newOptimisticCartItems;

    if (existingItemIndex > -1) {
      // If item already in cart, increment quantity optimistically
      newOptimisticCartItems = cartItems.map((cartItem, index) =>
        index === existingItemIndex
          ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
          : cartItem
      );
    } else {
      // If item not in cart, add it optimistically
      newOptimisticCartItems = [...cartItems, {
        id: item._id.toString(),
        name: item.prenda,
        price: item.price,
        quantity: 1,
        image: item.imagen,
      }];
    }

    optimisticCartStateRef.current = cartItems; // Store current state for rollback
    updateCart(newOptimisticCartItems); // Update UI optimistically

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        const { success, message, data: updatedCart } = await addDesignToCart(userId, item._id.toString());
        if (!success) {
          // Rollback on error
          updateCart(optimisticCartStateRef.current);
          console.error("Error al agregar el diseño al carrito:", message);
          // Consider a more user-friendly error notification
        } else {
          updateCart(updatedCart?.items || []); // Update with actual server state
          console.log('Cart updated by server:', updatedCart?.items);
        }
      } catch (error) {
        // Rollback on network/server error
        updateCart(optimisticCartStateRef.current);
        console.error("Error de red/servidor al agregar diseño al carrito:", error);
        // Consider a more user-friendly error notification
      }
    }, 500); // Debounce for 500ms
  }, [userId, cartItems, updateCart]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to bottom, #000000, #0A1828, #000000)' }}>
      <HeaderPrincipal />

      <main className="flex-grow p-4 flex flex-col">
        <CatalogTabs activo={activo} setActivo={setActivo} />

        <div className="mb-4 text-center text-xl font-semibold text-white animate-fadeIn">
          DISEÑOS DE LA COMUNIDAD
        </div>

        <NewPostSection />

        <DesignGrid
          tarjetas={tarjetas}
          activo={activo}
          addItem={handleAddItemToCart} // Pass the new addItem function
          cartItems={cartItems} // Pass cart items to DesignGrid
        />
      </main>

      <Footer />
    </div>
  );
};

export default ComunidadDiseños;
