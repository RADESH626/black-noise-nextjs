'use client'
import React from 'react';
<<<<<<< HEAD
import BotonGeneral from '@/components/common/botones/BotonGeneral';
=======
>>>>>>> c32cb53 (primer commit)

function CatalogTabs({ activo, setActivo }) {
  return (
    <div className="flex gap-2 mb-4 justify-center">
<<<<<<< HEAD
      <BotonGeneral
        type="button"
        onClick={() => setActivo('diseños')}
        variant="secondary"
=======
      <button
        onClick={() => setActivo('diseños')}
>>>>>>> c32cb53 (primer commit)
        className={`px-4 py-2 rounded-full transition-colors duration-300 ease-in-out transform ${
          activo === 'diseños' ? 'bg-[#292727] text-white scale-105 shadow-lg' : 'bg-white text-black hover:bg-[#242a33] hover:text-white'
        }`}
      >
        DISEÑOS
<<<<<<< HEAD
      </BotonGeneral>
      <BotonGeneral
        type="button"
        onClick={() => setActivo('populares')}
        variant="secondary"
=======
      </button>
      <button
        onClick={() => setActivo('populares')}
>>>>>>> c32cb53 (primer commit)
        className={`px-4 py-2 rounded-full transition-colors duration-300 ease-in-out transform ${
          activo === 'populares' ? 'bg-[#292727] text-white scale-105 shadow-lg' : 'bg-white text-black hover:bg-[#242a33] hover:text-white'
        }`}
      >
        MÁS POPULARES
<<<<<<< HEAD
      </BotonGeneral>
=======
      </button>
>>>>>>> c32cb53 (primer commit)
    </div>
  );
}

export default CatalogTabs;
