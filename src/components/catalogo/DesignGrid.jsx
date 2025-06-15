'use client'
import React from 'react';
import DesignCard from './DesignCard';

function DesignGrid({ tarjetas, activo, addItem, cartItems }) {
  return (
    <>
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
          {tarjetas.map((diseño) => {
            const isInCart = cartItems.some(item => item.id === diseño.id);
            console.log('Design ID:', diseño.id); // Added for debugging key prop warning
            return (
              <DesignCard
                key={diseño._id}
                diseño={diseño}
                addItem={addItem}
                isInCart={isInCart} // Pass isInCart prop
              />
            );
          })}
        </div>
      )}
    </>
  );
}

export default DesignGrid;
