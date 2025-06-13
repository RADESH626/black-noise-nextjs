'use client'
<<<<<<< HEAD
=======
import React from 'react';
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6

function DesignCard({ diseño, likesState, likedDesigns, handleLike, addItem }) {
  return (
    <div
<<<<<<< HEAD
=======
      key={diseño.id}
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
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
          src={diseño.imagen || '/next.svg'}
          alt={`Imagen de ${diseño.prenda}`}
          className="h-full object-contain transition-transform duration-500 ease-in-out hover:scale-110"
        />
      </div>

      <div className="p-4 flex flex-col gap-2 text-white">
        <h2 className="font-semibold text-lg">{diseño.prenda}</h2>
        <p>Categoría: {diseño.categoria}</p>
        <p>Precio: ${diseño.price !== undefined && diseño.price !== null ? diseño.price.toFixed(2) : '0.00'}</p>

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
            {/* <button className="flex items-center text-green-400 hover:text-green-600 transition">
              ↗️ Compartir
            </button> */}
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
  );
}

export default DesignCard;
