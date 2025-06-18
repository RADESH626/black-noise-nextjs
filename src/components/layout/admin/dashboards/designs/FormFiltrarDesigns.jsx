"use client";

import { useState } from 'react';

export default function FormFiltrarDesigns() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement actual search logic later
    console.log('Searching for:', searchTerm);
  };

  return (
    <div
      className="p-6 rounded-lg shadow-md mb-6"
      style={{ backgroundColor: '#000000FF' }} // bg-gray-800
    >
      <h5
        className="text-lg font-semibold mb-4"
        style={{ color: '#FFFFFF' }} // text-white
      >
        Buscar Diseño
      </h5>
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Nombre, categoría, descripción..."
          className="flex-1 p-3 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: '#272525FF', // bg-gray-700
            color: '#FFFFFF', // text-white
            border: 'none',
            caretColor: '#FFFFFF',
            '--tw-ring-color': '#FFFFFFFF', // focus:ring-blue-500
            '--tw-ring-opacity': '1',
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: '#2563EB', // bg-blue-600
            color: '#FFFFFF', // text-white
            '--tw-ring-color': '#3B82F6', // focus:ring-blue-500
            '--tw-ring-opacity': '0.5'
          }}
        >
          Buscar
        </button>
      </form>
    </div>
  );
}
