"use client";

import React, { useState, useEffect } from 'react';

const ComunidadDiseños = () => {
  const [activo, setActivo] = useState('diseños');

  const diseños = [
    {
      usuario: 'Sara Sofia',
      prenda: 'Camisa Negra',
      categoria: 'Camisa',
      likes: 0,
      imagen: '/img/Camisas/Camisa 1.jpg',
    },
    {
      usuario: 'Luis Fernando',
      prenda: 'Camisa Gris',
      categoria: 'Camisa',
      likes: 10,
      imagen: '/img/Camisas/Camisa 2.jpg',
    },
    {
      usuario: 'Camila Ríos',
      prenda: 'Camisa Negra Estampada',
      categoria: 'Camisa',
      likes: 50,
      imagen: '/img/Camisas/Camisa.jpg',
    },
    {
      usuario: 'David Gómez',
      prenda: 'Camiseta Underground',
      categoria: 'Camisa',
      likes: 90,
      imagen: '/img/Camisetas/Camiseta 2.jpg',
    },
  ];

  const populares = [
    {
      usuario: 'Alfonso Lopez',
      prenda: 'Chaqueta Black Noise',
      categoria: 'Chaqueta',
      likes: '150k',
      imagen: '/img/Chaquetas/Chaqueta 1.jpg',
    },
    {
      usuario: 'Valeria Torres',
      prenda: 'Falda de Cuero',
      categoria: 'Falda',
      likes: '120k',
      imagen: '/img/Faldas/Falda 1.jpg',
    },
    {
      usuario: 'Cesar Martínez',
      prenda: 'Gorra Negra',
      categoria: 'Gorra',
      likes: '500k',
      imagen: '/img/Gorras/Gorra 1.jpg',
    },
    {
      usuario: 'Kelly Pérez',
      prenda: 'Hoodie Blanco',
      categoria: 'Hoodie',
      likes: '100000k',
      imagen: '/img/Pantalones/Pantalon 2.jpg',
    },
  ];

  const tarjetas = activo === 'diseños' ? diseños : populares;

  const [likesState, setLikesState] = useState(tarjetas.map((t) => t.likes));

  useEffect(() => {
    setLikesState(tarjetas.map((t) => t.likes));
  }, [activo]);

  const handleLike = (index) => {
    setLikesState((prev) => {
      const newLikes = [...prev];
      newLikes[index] =
        typeof newLikes[index] === 'number'
          ? newLikes[index] + 1
          : parseInt(newLikes[index]) + 1;
      return newLikes;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-[#C255AA] to-black">
      <header className="p-4 flex justify-between items-center bg-black">
        <h1 className="text-lg font-bold text-[#C255AA]">BLACK NOISE</h1>
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-white to-white" />
      </header>

      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActivo('diseños')}
            className={`px-4 py-2 rounded-full ${
              activo === 'diseños' ? 'bg-[#C255AA] text-white' : 'bg-white text-black'
            }`}
          >
            DISEÑOS
          </button>
          <button
            onClick={() => setActivo('populares')}
            className={`px-4 py-2 rounded-full ${
              activo === 'populares' ? 'bg-[#C255AA] text-white' : 'bg-white text-black'
            }`}
          >
            MÁS POPULARES
          </button>
        </div>

        <div className="mb-4 text-center text-xl font-semibold text-white">
          DISEÑOS DE LA COMUNIDAD
        </div>

        <div
          className={`grid gap-4 ${
            activo === 'diseños' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
          }`}
        >
          {tarjetas.map((diseño, index) => (
            <div key={index} className="flex flex-col rounded-2xl overflow-hidden">
              <div className="w-full h-64 bg-black flex items-center justify-center">
                <img
                  src={diseño.imagen}
                  alt={`Imagen de ${diseño.prenda}`}
                  className="h-full object-contain"
                />
              </div>

              <div className="text-sm p-2 flex items-center justify-between bg-gradient-to-r from-blue-900 to-purple-500">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-black" />
                  <div>
                    <div className="font-bold text-white">{diseño.usuario}</div>
                    <div className="text-gray-300">{diseño.prenda}</div>
                    <div className="uppercase text-gray-400">
                      Categoría: {diseño.categoria}
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-1 cursor-pointer select-none text-red-500"
                  onClick={() => handleLike(index)}
                  title="Dale like"
                >
                  ❤ {likesState[index]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="p-4 text-lg font-bold text-center mt-auto bg-black text-white">
        FOOTER
      </footer>
    </div>
  );
};

export default ComunidadDiseños;