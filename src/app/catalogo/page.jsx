'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { useCartStorage } from '@/hooks/useCartStorage';
import HeaderPrincipal from '@/components/layout/general/HeaderPrincipal';
import Footer from '@/components/layout/general/footer/Footer';
import CatalogTabs from '@/components/catalogo/CatalogTabs';
import NewPostSection from '@/components/catalogo/NewPostSection';
import DesignGrid from '@/components/catalogo/DesignGrid';

const ComunidadDiseños = () => {
  const [activo, setActivo] = useState('diseños');
  const { addItem } = useCartStorage();

  const allDesigns = useMemo(() => {
    return []; // Aquí se debería implementar la lógica para obtener diseños reales
  }, []);

  // Filtramos populares, por ejemplo, más de 100 likes
  const populares = useMemo(() => allDesigns.filter(d => d.likes > 100), [allDesigns]);

  // Elegimos qué mostrar según la pestaña activa
  const tarjetas = useMemo(() => activo === 'diseños' ? allDesigns : populares, [activo, allDesigns, populares]);

  const [likesState, setLikesState] = useState({});
  const [likedDesigns, setLikedDesigns] = useState({}); // Stores { designId: true } for liked designs

  // Initialize likesState and likedDesigns from localStorage on mount
  useEffect(() => {
    const initialLikes = {};
    tarjetas.forEach(design => {
      initialLikes[design.id] = design.likes;
    });
    setLikesState(initialLikes);

    if (typeof window !== 'undefined') {
      const storedLikedDesigns = JSON.parse(localStorage.getItem('likedDesigns') || '{}');
      setLikedDesigns(storedLikedDesigns);
    }
  }, [tarjetas]);

  // Update localStorage when likedDesigns changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('likedDesigns', JSON.stringify(likedDesigns));
    }
  }, [likedDesigns]);

  const handleLike = (designId) => {
    setLikesState(prev => {
      const newLikes = { ...prev };
      if (likedDesigns[designId]) {
        // Unlike: decrement like count and remove from likedDesigns
        newLikes[designId] = (newLikes[designId] || 0) - 1;
        setLikedDesigns(prevLiked => {
          const newLiked = { ...prevLiked };
          delete newLiked[designId];
          return newLiked;
        });
      } else {
        // Like: increment like count and add to likedDesigns
        newLikes[designId] = (newLikes[designId] || 0) + 1;
        setLikedDesigns(prevLiked => ({
          ...prevLiked,
          [designId]: true,
        }));
      }
      return newLikes;
    });
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
          likesState={likesState}
          likedDesigns={likedDesigns}
          handleLike={handleLike}
          addItem={addItem}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ComunidadDiseños;
