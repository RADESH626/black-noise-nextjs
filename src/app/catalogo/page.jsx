'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import HeaderPrincipal from '@/components/layout/general/HeaderPrincipal';
import Footer from '@/components/layout/general/footer/Footer';
import CatalogTabs from '@/components/catalogo/CatalogTabs';
import NewPostSection from '@/components/catalogo/NewPostSection';
import DesignGrid from '@/components/catalogo/DesignGrid';
import { addDesignToCart } from '@/app/acciones/CartActions';
import { obtenerDesigns } from '@/app/acciones/DesignActions';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';

const ComunidadDiseños = () => {
  const [activo, setActivo] = useState('diseños');
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { cartItems, updateCart } = useCart();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); // New state for login prompt
  const optimisticCartStateRef = React.useRef([]); // Use React.useRef for consistency

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
      setShowLoginPrompt(true); // Show login prompt
      // Optionally, hide it after a few seconds
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }

    // Optimistic update
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item._id.toString());
    let newOptimisticCartItems;

    if (existingItemIndex > -1) {
      newOptimisticCartItems = cartItems.map((cartItem, index) =>
        index === existingItemIndex
          ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
          : cartItem
      );
    } else {
      newOptimisticCartItems = [...cartItems, {
        id: item._id.toString(),
        name: item.prenda,
        price: item.price,
        quantity: 1,
        image: item.imagen,
      }];
    }

    optimisticCartStateRef.current = cartItems;
    updateCart(newOptimisticCartItems);

    try {
      const { success, message, data: updatedCart } = await addDesignToCart(userId, item._id.toString());
      if (!success) {
        updateCart(optimisticCartStateRef.current);
        console.error("Error al agregar el diseño al carrito:", message);
        // Consider a more user-friendly error notification
      } else {
        updateCart(updatedCart?.items || []);
        console.log('Cart updated by server:', updatedCart?.items);
      }
    } catch (error) {
      updateCart(optimisticCartStateRef.current);
      console.error("Error de red/servidor al agregar diseño al carrito:", error);
      // Consider a more user-friendly error notification
    }
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
          addItem={handleAddItemToCart}
          cartItems={cartItems}
        />

        {showLoginPrompt && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white p-3 rounded-lg shadow-lg animate-fadeInOut">
            Debes iniciar sesión para agregar ítems al carrito.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ComunidadDiseños;
