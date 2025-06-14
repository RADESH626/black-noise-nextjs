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
    <div className="p-6 bg-gray-800 rounded-lg shadow-md mb-6">
      <h5 className="text-lg font-semibold mb-4 text-white">Buscar Diseño</h5>
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Nombre, categoría, descripción..."
          className="flex-1 p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Buscar
        </button>
      </form>
    </div>
  );
}
