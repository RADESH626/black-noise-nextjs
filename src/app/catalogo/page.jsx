'use client'

import React, { useState, useEffect, useMemo } from 'react';
import HeaderPrincipal from '@/components/layout/general/HeaderPrincipal';
import Footer from '@/components/layout/general/footer/Footer';
import CatalogTabs from '@/components/catalogo/CatalogTabs';
import NewPostSection from '@/components/catalogo/NewPostSection';
import DesignGrid from '@/components/catalogo/DesignGrid';
import { addDesignToCart, getCartByUserId } from '@/app/acciones/CartActions'; // Import addDesignToCart and getCartByUserId
import { obtenerDesigns } from '@/app/acciones/DesignActions'; // Import obtenerDesigns
import { useSession } from 'next-auth/react'; // Import useSession

const ComunidadDiseños = () => {
  const [activo, setActivo] = useState('diseños');
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [allDesigns, setAllDesigns] = useState([]); // State to store all designs
  const [loadingDesigns, setLoadingDesigns] = useState(true);
  const [errorDesigns, setErrorDesigns] = useState(null);
  const [cartItems, setCartItems] = useState([]); // State to store cart items

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
  }, []); // Empty dependency array to run once on mount

  useEffect(() => {
    async function fetchCartItems() {
      if (userId) { // Only fetch if userId is available
        try {
          const result = await getCartByUserId(userId);
          if (result?.cart?.items) {
            setCartItems(result.cart.items);
          } else {
            console.error("Error al cargar ítems del carrito:", result?.error);
            setCartItems([]); // Ensure cartItems is an array even on error
          }
        } catch (err) {
          console.error("Error de red o del servidor al cargar ítems del carrito:", err.message);
          setCartItems([]); // Ensure cartItems is an array even on error
        }
      }
    }
    fetchCartItems();
  }, [userId]); // Re-run when userId changes

  // Elegimos qué mostrar según la pestaña activa
  const tarjetas = useMemo(() => activo === 'diseños' ? allDesigns : allDesigns, [activo, allDesigns]);

  const handleAddItemToCart = async (item) => {
    if (!userId) {
      alert("Debes iniciar sesión para agregar ítems al carrito.");
      return;
    }
    const { success, message } = await addDesignToCart(userId, item.id);
    if (!success) {
      alert(message || "Error al agregar el diseño al carrito.");
    } else {
      alert("Diseño agregado al carrito!");
      // Optionally, revalidate cart path here if needed, but CartComponent will fetch its own data
    }
  };

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
