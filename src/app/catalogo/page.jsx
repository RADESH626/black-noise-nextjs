'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { useCartStorage } from '@/hooks/useCartStorage';
import HeaderPrincipal from '@/components/layout/general/HeaderPrincipal';
import Footer from '@/components/layout/general/footer/Footer';

import { mockDesigns } from '@/data/mock/designs';
import { useMockDataContext } from '@/context/MockDataContext';

const ComunidadDiseños = () => {
  const [activo, setActivo] = useState('diseños');
  const { addItem } = useCartStorage();
  const { mockDataEnabled } = useMockDataContext();

  const allDesigns = useMemo(() => {
    return mockDataEnabled ? mockDesigns.map(d => ({
      ...d,
      id: d._id, // Map _id to id for consistency with existing code
      usuario: 'Usuario de la Comunidad', // Placeholder as mock data only has usuarioId
      userAvatar: '/img/perfil/FotoPerfil.webp', // Placeholder
      prenda: d.nombreDesing, // Map nombreDesing to prenda
      imagen: d.imagenDesing, // Map imagenDesing to imagen
      price: d.valorDesing, // Map valorDesing to price
    })) : []; // Fallback if mockDataEnabled is false, or fetch real data
  }, [mockDataEnabled, mockDesigns]);

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
        <div className="flex gap-2 mb-4 justify-center">
          <button
            onClick={() => setActivo('diseños')}
            className={`px-4 py-2 rounded-full transition-colors duration-300 ease-in-out transform ${
              activo === 'diseños' ? 'bg-[#292727] text-white scale-105 shadow-lg' : 'bg-white text-black hover:bg-[#242a33] hover:text-white'
            }`}
          >
            DISEÑOS
          </button>
          <button
            onClick={() => setActivo('populares')}
            className={`px-4 py-2 rounded-full transition-colors duration-300 ease-in-out transform ${
              activo === 'populares' ? 'bg-[#292727] text-white scale-105 shadow-lg' : 'bg-white text-black hover:bg-[#242a33] hover:text-white'
            }`}
          >
            MÁS POPULARES
          </button>
        </div>

        <div className="mb-4 text-center text-xl font-semibold text-white animate-fadeIn">
          DISEÑOS DE LA COMUNIDAD
        </div>

        {/* New Post Section */}
        <div className="bg-black/80 p-4 rounded-2xl shadow-lg mb-6 flex flex-col items-center">
          <div className="flex items-center w-full mb-4">
            <img
              src="/img/perfil/FotoPerfil.webp"
              alt="User Avatar"
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
            <input
              type="text"
              placeholder="¿Qué diseño estás pensando hoy?"
              className="flex-grow p-3 rounded-full bg-[#292727] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="bg-blue-600 px-6 py-2 rounded-full text-white font-semibold hover:bg-blue-700 transition-colors duration-300">
            Publicar Diseño
          </button>
        </div>

        {tarjetas.length === 0 ? (
          <div className="text-center text-white text-xl mt-8">
            No hay diseños disponibles.
          </div>
        ) : (
          <div
            className={`grid gap-6 transition-all duration-500 ease-in-out ${
              activo === 'diseños' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
            }`}
          >
            {tarjetas.map((diseño, index) => (
              <div
                key={diseño.id}
                className="flex flex-col rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl bg-black/80"
              >
                {/* Social media post header */}
                <div className="flex items-center p-4 pb-2">
                  <img
                    src={diseño.userAvatar}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <h3 className="font-semibold text-white">{diseño.usuario}</h3>
                </div>

                <div className="w-full h-64 flex items-center justify-center bg-black overflow-hidden">
                  <img
                    src={diseño.imagen}
                    alt={`Imagen de ${diseño.prenda}`}
                    className="h-full object-contain transition-transform duration-500 ease-in-out hover:scale-110"
                  />
                </div>

                <div className="p-4 flex flex-col gap-2 text-white">
                  <h2 className="font-semibold text-lg">{diseño.prenda}</h2>
                  <p>Categoría: {diseño.categoria}</p>
                  <p>Precio: ${diseño.price.toFixed(2)}</p>

                  {/* Social media interaction buttons */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-3">
                    <button
                      className={`flex items-center transition ${
                        likedDesigns[diseño.id] ? 'text-red-600' : 'text-red-400 hover:text-red-600'
                      }`}
                      onClick={() => handleLike(diseño.id)}
                    >
                      {likedDesigns[diseño.id] ? '❤️' : '♡'}{' '}
                      {likesState[diseño.id] !== undefined ? likesState[diseño.id] : diseño.likes}
                    </button>
                      <button className="flex items-center text-green-400 hover:text-green-600 transition">
                        ↗️ Compartir
                      </button>
                    </div>
                    <button
                      className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 transition"
                      onClick={() => addItem(diseño)}
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ComunidadDiseños;
