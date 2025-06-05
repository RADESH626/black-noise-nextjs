<<<<<<< HEAD
"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext'; // Import useCart

const ComunidadDiseños = () => {
  const [activo, setActivo] = useState('diseños');
  const { cartItems, addItem } = useCart(); // Get cartItems and addItem from context

  const diseños = [
    {
      id: 'catalogo-diseno-1', // Added unique ID
      usuario: 'Sara Sofia',
      prenda: 'Camisa Negra',
      categoria: 'Camisa',
      likes: 0,
      imagen: '/img/Camisas/Camisa 1.jpg',
      price: 20.00 // Added price
    },
    {
      id: 'catalogo-diseno-2', // Added unique ID
      usuario: 'Luis Fernando',
      prenda: 'Camisa Gris',
      categoria: 'Camisa',
      likes: 10,
      imagen: '/img/Camisas/Camisa 2.jpg',
      price: 25.00 // Added price
    },
    {
      id: 'catalogo-diseno-3', // Added unique ID
      usuario: 'Camila Ríos',
      prenda: 'Camisa Negra Estampada',
      categoria: 'Camisa',
      likes: 50,
      imagen: '/img/Camisas/Camisa.jpg',
      price: 30.00 // Added price
    },
    {
      id: 'catalogo-diseno-4', // Added unique ID
      usuario: 'David Gómez',
      prenda: 'Camiseta Underground',
      categoria: 'Camisa',
      likes: 90,
      imagen: '/img/Camisetas/Camiseta 2.jpg',
      price: 18.00 // Added price
    }
  ];

  const populares = [
    {
      id: 'catalogo-popular-1', // Added unique ID
      usuario: 'Alfonso Lopez',
      prenda: 'Chaqueta Black Noise',
      categoria: 'Chaqueta',
      likes: 15000,
      imagen: '/img/Chaquetas/Chaqueta 1.jpg',
      price: 50.00 // Added price
    },
    {
      id: 'catalogo-popular-2', // Added unique ID
      usuario: 'Valeria Torres',
      prenda: 'Falda de Cuero',
      categoria: 'Falda',
      likes: 120,
      imagen: '/img/Faldas/Falda 1.jpg',
      price: 35.00 // Added price
    },
    {
      id: 'catalogo-popular-3', // Added unique ID
      usuario: 'Cesar Martínez',
      prenda: 'Gorra Negra',
      categoria: 'Gorra',
      likes: 500,
      imagen: '/img/Gorras/Gorra 1.jpg',
      price: 22.00 // Added price
    },
    {
      id: 'catalogo-popular-4', // Added unique ID
      usuario: 'Kelly Pérez',
      prenda: 'Pantalon Azul',
      categoria: 'Pantalon',
      likes: 1000,
      imagen: '/img/Pantalones/Pantalon 2.jpg',
      price: 40.00 // Added price
    }
  ];

  const tarjetas = activo === 'diseños' ? diseños : populares;

  const [likesState, setLikesState] = useState(tarjetas.map(t => t.likes));

  useEffect(() => {
    setLikesState(tarjetas.map(t => t.likes));
  }, [activo]);

  const handleLike = (index) => {
    setLikesState(prev => {
      const newLikes = [...prev];
      newLikes[index] += 1;
=======
'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import HeaderPrincipal from '@/components/layout/general/HeaderPrincipal';
import Footer from '@/components/layout/general/footer/Footer';

import { mockDesigns } from '@/data/mock/designs';
import { useMockDataContext } from '@/context/MockDataContext';

const ComunidadDiseños = () => {
  const [activo, setActivo] = useState('diseños');
  const { addItem } = useCart();
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
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
      return newLikes;
    });
  };

  return (
<<<<<<< HEAD
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(to bottom, #000000, #C255AA, #000000)' }}
    >
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-black">
        <h1 className="text-lg font-bold text-[#C255AAFF] animate-pulse">
          BLACK NOISE
        </h1>
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-r from-white to-white animate-pulse"
        />
      </header>

      {/* Contenido principal */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Botones */}
=======
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to bottom, #000000, #0A1828, #000000)' }}>
      <HeaderPrincipal />

      <main className="flex-grow p-4 flex flex-col">
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
        <div className="flex gap-2 mb-4 justify-center">
          <button
            onClick={() => setActivo('diseños')}
            className={`px-4 py-2 rounded-full transition-colors duration-300 ease-in-out transform ${
<<<<<<< HEAD
              activo === 'diseños' ? 'bg-[#C255AA] text-white scale-105 shadow-lg' : 'bg-white text-black hover:bg-[#C255AA] hover:text-white'
=======
              activo === 'diseños' ? 'bg-[#292727] text-white scale-105 shadow-lg' : 'bg-white text-black hover:bg-[#242a33] hover:text-white'
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
            }`}
          >
            DISEÑOS
          </button>
          <button
            onClick={() => setActivo('populares')}
            className={`px-4 py-2 rounded-full transition-colors duration-300 ease-in-out transform ${
<<<<<<< HEAD
              activo === 'populares' ? 'bg-[#C255AA] text-white scale-105 shadow-lg' : 'bg-white text-black hover:bg-[#C255AA] hover:text-white'
=======
              activo === 'populares' ? 'bg-[#292727] text-white scale-105 shadow-lg' : 'bg-white text-black hover:bg-[#242a33] hover:text-white'
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
            }`}
          >
            MÁS POPULARES
          </button>
        </div>

<<<<<<< HEAD
        {/* Título */}
=======
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
        <div className="mb-4 text-center text-xl font-semibold text-white animate-fadeIn">
          DISEÑOS DE LA COMUNIDAD
        </div>

<<<<<<< HEAD
        {/* Tarjetas */}
        <div
          className={`grid gap-6 transition-all duration-500 ease-in-out ${
            activo === 'diseños' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
          }`}
        >
          {tarjetas.map((diseño, index) => (
            <div
              key={index}
              className="flex flex-col rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl bg-black/80"
            >
              {/* Imagen */}
              <div className="w-full h-64 flex items-center justify-center bg-black overflow-hidden">
                <img
                  src={diseño.imagen}
                  alt={`Imagen de ${diseño.prenda}`}
                  className="h-full object-contain transition-transform duration-500 ease-in-out hover:scale-110"
                />
              </div>

              {/* Información */}
              <div
                className="text-sm p-3 flex items-center justify-between"
                style={{ background: 'linear-gradient(to right, #1e3a8a, #a855f7)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-black border-2 border-purple-700 animate-pulse"></div>
                  <div>
                    <div className="font-bold text-white">{diseño.usuario}</div>
                    <div className="text-gray-300">{diseño.prenda}</div>
                    <div className="uppercase text-gray-500 text-xs">
                      Categoría: {diseño.categoria}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3"> {/* Added flex container for like and checkbox */}
                  <div
                    className="flex items-center gap-1 cursor-pointer select-none text-red-500 transition-transform duration-200 active:scale-90"
                    onClick={() => handleLike(index)}
                    title="Dale like"
                  >
                    ❤ {likesState[index].toLocaleString()}
                  </div>
                   {/* Checkbox for adding to cart */}
                  <input
                    type="checkbox"
                    checked={cartItems.some(item => item.id === diseño.id)} // Check if item is in cart
                    onChange={() => addItem({ // Add item to cart on change
                      id: diseño.id,
                      nombre: diseño.prenda, // Use 'prenda' as the name
                      price: diseño.price,
                      imagen: diseño.imagen,
                    })}
                    className="form-checkbox h-5 w-5 text-purple-600" // Basic styling
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-lg font-bold text-center mt-auto bg-black text-white animate-fadeIn">
        FOOTER
      </footer>

      {/* Animations adicionales via Tailwind plugin or styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }
      `}</style>
=======
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
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
    </div>
  );
};

export default ComunidadDiseños;
