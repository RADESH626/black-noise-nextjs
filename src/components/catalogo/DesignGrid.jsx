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
<<<<<<< HEAD
          {tarjetas
            ?.filter(diseño => diseño && diseño.id) // ✅ Validación aquí
            .map((diseño) => (
              <DesignCard
                key={diseño.id}
                diseño={diseño}
                likesState={likesState}
                likedDesigns={likedDesigns}
                handleLike={handleLike}
                addItem={addItem}
              />
            ))}
=======
          {tarjetas.map((diseño) => (
            <DesignCard
              key={diseño.id}
              diseño={diseño}
              likesState={likesState}
              likedDesigns={likedDesigns}
              handleLike={handleLike}
              addItem={addItem}
            />
          ))}
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
        </div>
      )}
    </>
  );
}

<<<<<<< HEAD
export default DesignGrid;
=======
export default DesignGrid;
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
