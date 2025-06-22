'use client'
import React from 'react';
import DesignCard from './DesignCard';

function DesignGrid({ tarjetas, activo, addItem, cartItems }) {
  // console.log('DesignGrid re-rendered. cartItems length:', cartItems.length);
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
            const isInCart = cartItems.some(item => {
              // console.log('Comparing:');
              // console.log('  Cart Item ID:', item.id, 'Type:', typeof item.id);
              // console.log('  Design ID:', diseño._id.toString(), 'Type:', typeof diseño._id.toString());
              const result = item.id === diseño._id.toString();
              // console.log('  Result (isInCart for this item):', result);
              return result;
            });
            // console.log('Final isInCart for Design ID', diseño._id, ':', isInCart); // Debug log
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

export default React.memo(DesignGrid);