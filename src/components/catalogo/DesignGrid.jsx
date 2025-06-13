'use client'
import React from 'react';
import DesignCard from './DesignCard';

function DesignGrid({ tarjetas, activo, likesState, likedDesigns, handleLike, addItem }) {
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
            console.log('Design ID:', diseño.id); // Added for debugging key prop warning
            return (
              <DesignCard
                key={diseño._id}
                diseño={diseño}
                likesState={likesState}
                likedDesigns={likedDesigns}
                handleLike={handleLike}
                addItem={addItem}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

export default DesignGrid;
