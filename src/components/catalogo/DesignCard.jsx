'use client'
import React from 'react';

function DesignCard({ diseño, addItem, isInCart }) {
  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
      style={{ backgroundColor: '#000000FF' }} // reemplazo de bg-black/80
    >
      {/* Social media post header */}
      <div className="flex items-center p-4 pb-2">
        <img
          src={diseño.userAvatar}
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <h3 className="font-semibold" style={{ color: '#FFFFFF' }}>{diseño.usuario}</h3>
      </div>

      <div className="w-full h-64 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <img
          src={diseño.imagen || '/next.svg'}
          alt='{Imagen de ${diseño.prenda}}'
          className="h-full object-contain transition-transform duration-500 ease-in-out hover:scale-110"
        />
      </div>

      <div className="p-4 flex flex-col gap-2" style={{ color: '#FFFFFF' }}>
        <h2 className="font-semibold text-lg">{diseño.prenda}</h2>
        <p>Categoría: {diseño.categoria}</p>
        <p>Precio: ${diseño.price !== undefined && diseño.price !== null ? diseño.price.toFixed(2) : '0.00'}</p>

        <div className="flex items-center justify-end mt-2">
          <button
            className="px-3 py-1 rounded transition"
            style={{
              backgroundColor: isInCart ? '#6B7280' : '#059669',
              cursor: isInCart ? 'not-allowed' : 'pointer',
              color: '#FFFFFF'
            }}
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

export default DesignCard;
