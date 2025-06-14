'use client'
import React from 'react';
import Link from 'next/link';

function NewPostSection() {
  return (
    <div className="bg-black/80 p-4 rounded-2xl shadow-lg mb-6 flex flex-col items-center">
      <div className="flex items-center w-full mb-4">
        <img
          src="/img/perfil/FotoPerfil.webp"
          alt="User Avatar"
          className="w-12 h-12 rounded-full mr-4 object-cover"
        />
        <input
          type="text"
          placeholder="¿Qué diseño estás pensando hoy?"
          className="flex-grow p-3 rounded-full bg-[#292727] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <Link href="/perfil" className="bg-blue-600 px-6 py-2 rounded-full text-white font-semibold hover:bg-blue-700 transition-colors duration-300">
        Publicar Diseño
      </Link>
    </div>
  );
}

export default NewPostSection;
