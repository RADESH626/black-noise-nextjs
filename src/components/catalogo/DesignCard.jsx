'use client'
import React from 'react';

function DesignCard({ diseño, addItem, isInCart }) {
  console.log('Valor de diseño.userAvatar:', diseño.userAvatar);
  console.log('Valor de diseño.imagen:', diseño.imagen);
  // console.log(`DesignCard re-rendered for ${diseño.prenda}, isInCart: ${isInCart}`);
  // console.log('Design data in DesignCard:', JSON.stringify(diseño, null, 2)); // Stringify to see full content
  return (
    <div
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
          src={
            // diseño.imagen 
            // || 
            '/next.svg'
          }
          alt={`Imagen de ${diseño.prenda}`}
          className="h-full object-contain transition-transform duration-500 ease-in-out hover:scale-110"
        />
      </div>

      <div className="p-4 flex flex-col gap-2 text-white">
        <h2 className="font-semibold text-lg">{diseño.prenda}</h2>
        <p>Categoría: {diseño.categoria}</p>
        <p>Precio: ${diseño.price !== undefined && diseño.price !== null ? diseño.price.toFixed(2) : '0.00'}</p>

        <div className="flex items-center justify-end mt-2">
          <button
            className={`px-3 py-1 rounded transition ${
              isInCart ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
            onClick={() => addItem(diseño)}
            disabled={isInCart}
          >
            {isInCart ? 'En el carrito' : 'Añadir al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(DesignCard);
