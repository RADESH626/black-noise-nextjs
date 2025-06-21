'use client'
import React from 'react';

function CatalogTabs({ activo, setActivo }) {
  return (
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
  );
}

export default CatalogTabs;
