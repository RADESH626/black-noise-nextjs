'use client'

import React, { useState, useMemo, useCallback } from 'react';
import HeaderPrincipal from '@/components/layout/general/HeaderPrincipal';
import Footer from '@/components/layout/general/footer/Footer';
import CatalogTabs from '@/components/catalogo/CatalogTabs';
import NewPostSection from '@/components/catalogo/NewPostSection';
import DesignGrid from '@/components/catalogo/DesignGrid';
import { addDesignToCart } from '@/app/acciones/CartActions';
import { obtenerDesigns } from '@/app/acciones/DesignActions';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import { useQuery } from '@tanstack/react-query';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const ComunidadDiseños = () => {
  const [activo, setActivo] = useState('diseños');
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { cartItems, updateCart } = useCart();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const optimisticCartStateRef = React.useRef([]);

  const { data: allDesigns, isLoading: loadingDesigns, isError: errorDesigns, error } = useQuery({
    queryKey: ['allDesigns'],
    queryFn: async () => {
      const result = await obtenerDesigns();
      if (result?.data) return result.data;
      else throw new Error(result?.error || "Error al cargar los diseños.");
    },
    staleTime: Infinity,
    cacheTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const tarjetas = useMemo(() => activo === 'diseños' ? allDesigns : allDesigns, [activo, allDesigns]);

  // ✅ Paginación:
  const [currentPage, setCurrentPage] = useState(1);
  const designsPerPage = 6; // Cambia este valor según lo que quieras mostrar

  const totalPages = tarjetas ? Math.ceil(tarjetas.length / designsPerPage) : 0;

  const currentDesigns = tarjetas ? tarjetas.slice(
    (currentPage - 1) * designsPerPage,
    currentPage * designsPerPage
  ) : [];

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleAddItemToCart = useCallback(async (item) => {
    if (!userId) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }

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
      } else {
        updateCart(updatedCart?.items || []);
      }
    } catch (error) {
      updateCart(optimisticCartStateRef.current);
      console.error("Error de red/servidor al agregar diseño al carrito:", error);
    }
  }, [userId, cartItems, updateCart]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to bottom, #FFFFFFFF, #FFFFFFFF, #FFFFFFFF)' }}>
      <HeaderPrincipal />

      <main className="flex-grow p-4 flex flex-col bg-gray-400" >
        {/* <CatalogTabs activo={activo} setActivo={setActivo} /> */}

        {/* <div className="mb-4 text-center text-xl font-semibold text-black animate-fadeIn">
          DISEÑOS DE LA COMUNIDAD
        </div> */}

        <NewPostSection />

        {loadingDesigns && <LoadingSpinner />}
        {errorDesigns && <p className="text-red-500 text-center">Error: {error?.message || "No se pudieron cargar los diseños."}</p>}

        {!loadingDesigns && !errorDesigns && allDesigns && (
          <>
            <DesignGrid
              tarjetas={currentDesigns}
              activo={activo}
              addItem={handleAddItemToCart}
              cartItems={cartItems}
            />

            {/* Botones paginación */}
            <div className="flex justify-center gap-4 mt-4">
              <BotonGeneral onClick={handlePrevPage} disabled={currentPage === 1}>
                Anterior
              </BotonGeneral>
              <span className="text-black">Página {currentPage} de {totalPages}</span>
              <BotonGeneral onClick={handleNextPage} disabled={currentPage === totalPages}>
                Siguiente
              </BotonGeneral>
            </div>
          </>
        )}

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
