'use client'

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import HeaderPrincipal from '@/components/layout/general/HeaderPrincipal';
import Footer from '@/components/layout/general/footer/Footer';

const todosDiseños = [
  {
    id: 'catalogo-diseno-1',
    usuario: 'Sara Sofia',
    prenda: 'Camisa Negra',
    categoria: 'Camisa',
    likes: 0,
    imagen: '/img/Camisas/Camisa 1.jpg',
    price: 20000,
  },
  {
    id: 'catalogo-diseno-2',
    usuario: 'Luis Fernando',
    prenda: 'Camisa Gris',
    categoria: 'Camisa',
    likes: 10,
    imagen: '/img/Camisas/Camisa 2.jpg',
    price: 25000,
  },
  {
    id: 'catalogo-diseno-3',
    usuario: 'Camila Ríos',
    prenda: 'Camisa Negra Estampada',
    categoria: 'Camisa',
    likes: 50,
    imagen: '/img/Camisas/Camisa.jpg',
    price: 30000,
  },
  {
    id: 'catalogo-diseno-4',
    usuario: 'David Gómez',
    prenda: 'Camiseta Underground',
    categoria: 'Camisa',
    likes: 90,
    imagen: '/img/Camisetas/Camiseta 2.jpg',
    price: 18000,
  },
  {
    id: 'catalogo-diseno-5',
    usuario: 'Alfonso Lopez',
    prenda: 'Chaqueta Black Noise',
    categoria: 'Chaqueta',
    likes: 15000,
    imagen: '/img/Chaquetas/Chaqueta 1.jpg',
    price: 50000,
  },
  {
    id: 'catalogo-diseno-6',
    usuario: 'Valeria Torres',
    prenda: 'Falda de Cuero',
    categoria: 'Falda',
    likes: 120,
    imagen: '/img/Faldas/Falda 1.jpg',
    price: 35000,
  },
  {
    id: 'catalogo-diseno-7',
    usuario: 'Cesar Martínez',
    prenda: 'Gorra Negra',
    categoria: 'Gorra',
    likes: 500,
    imagen: '/img/Gorras/Gorra 1.jpg',
    price: 22000,
  },
  {
    id: 'catalogo-diseno-8',
    usuario: 'Kelly Pérez',
    prenda: 'Pantalon Azul',
    categoria: 'Pantalon',
    likes: 1000,
    imagen: '/img/Pantalones/Pantalon 2.jpg',
    price: 40000,
  },
   {
    id: 'catalogo-diseno-9',
    usuario: 'Natalia Herrera',
    prenda: 'Vestido Gótico',
    categoria: 'Vestido',
    likes: 275,
    imagen: '/img/Sweaters/Sweater.jpg',
    price: 48000,
  },
];

const ComunidadDiseños = () => {
  const [activo, setActivo] = useState('diseños');
  const { addItem } = useCart();

  // Filtramos populares, por ejemplo, más de 100 likes
  const populares = todosDiseños.filter(d => d.likes > 100);

  // Elegimos qué mostrar según la pestaña activa
  const tarjetas = activo === 'diseños' ? todosDiseños : populares;

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
              <div className="w-full h-64 flex items-center justify-center bg-black overflow-hidden">
                <img
                  src={diseño.imagen}
                  alt={`Imagen de ${diseño.prenda}`}
                  className="h-full object-contain transition-transform duration-500 ease-in-out hover:scale-110"
                />
              </div>

              <div className="p-4 flex flex-col gap-2 text-white">
                <h2 className="font-semibold text-lg">{diseño.prenda}</h2>
                <p>Usuario: {diseño.usuario}</p>
                <p>Categoría: {diseño.categoria}</p>
                <p>Precio: ${diseño.price.toFixed(2)}</p>

                <div className="flex items-center justify-between mt-2">
                  <button
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
                    onClick={() => handleLike(index)}
                  >
                    ❤️ {likesState[index]}
                  </button>

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
      </main>

      <Footer />
    </div>
  );
};

export default ComunidadDiseños;
