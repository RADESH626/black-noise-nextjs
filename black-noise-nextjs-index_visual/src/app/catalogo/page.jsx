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
      return newLikes;
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(to bottom, #000000, #0A1828, #000000)' }}
    >
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-black">
        <h1 className="text-lg font-bold text-[#ffffff] animate-pulse">
          BLACK NOISE
        </h1>
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-r from-white to-white animate-pulse"
        />
      </header> *

      {/* Contenido principal */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Botones */}
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

        {/* Título */}
        <div className="mb-4 text-center text-xl font-semibold text-white animate-fadeIn">
          DISEÑOS DE LA COMUNIDAD
        </div>

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
                style={{ background: 'linear-gradient(to right, #1F57ACFF, #1F57ACFF)' }}
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
    </div>
  );
};

export default ComunidadDiseños;
