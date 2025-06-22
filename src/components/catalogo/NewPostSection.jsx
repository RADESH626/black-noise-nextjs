'use client'
import React from 'react';
import Link from 'next/link';

function NewPostSection() {
  return (
    <div className="p-4 rounded-2xl shadow-lg mb-6 flex flex-col items-center" style={{ backgroundColor: '#0B0B0B' }}>
      <div className="flex items-center w-full mb-4">
        <img
          src="/img/perfil/FotoPerfil.webp"
          alt="User Avatar"
          className="w-12 h-12 rounded-full mr-4 object-cover"
        />
        <input
          type="text"
          placeholder="¿Qué diseño estás pensando hoy?"
          className="flex-grow p-3 rounded-full text-white placeholder-[#ffffff] focus:outline-none focus:ring-2"
          style={{
            backgroundColor: '#1E1E1EEC',
            border: '1px solid #000000FF',
            boxShadow: '0 0 0 2px #FFFFFFFF' // optional glow
          }}
        />
      </div>
      <Link
        href="/perfil"
        className="px-6 py-2 rounded-full text-black font-semibold transition-colors duration-300"
        style={{
          backgroundColor: '#f5f5f5',
          hover: '#ffffff' // this won't work inline, needs Tailwind hover: setup
        }}
      >
        Publicar Diseño
      </Link>
    </div>
  );
}

export default NewPostSection;