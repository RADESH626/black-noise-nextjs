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
          className="flex-grow p-3 rounded-full text-white placeholder-[#AAAAAA] focus:outline-none focus:ring-2"
          style={{
            backgroundColor: '#1E1E1EEC',
            border: '1px solid #0A1828',
            boxShadow: '0 0 0 2px #FFFFFFFF' // optional glow
          }}
        />
      </div>
      <Link
        href="/perfil"
        className="px-6 py-2 rounded-full text-white font-semibold transition-colors duration-300"
        style={{
          backgroundColor: '#1A3870FF',
          hover: '#0A1828' // this won't work inline, needs Tailwind hover: setup
        }}
      >
        Publicar Diseño
      </Link>
    </div>
  );
}

export default NewPostSection;