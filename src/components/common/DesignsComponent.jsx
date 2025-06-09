"use client";

import React from 'react';
import { useCartStorage } from "@/hooks/useCartStorage"; // Import useCartStorage

function DesignsComponent({ loading, error, userDesigns, handleEditDesign }) {
  const { cartItems, addItem } = useCartStorage(); // Get cartItems and addItem from useCartStorage

  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        <div className="col-span-full text-center text-gray-400">Cargando diseños...</div>
      ) : error ? (
        <div className="col-span-full text-red-500 text-center">
          Error al cargar los diseños: {error}
        </div>
      ) : userDesigns.length === 0 ? (
        <div className="col-span-full text-center text-gray-400">
          No tienes diseños publicados aún.
        </div>
      ) : (
        userDesigns.map((design) => (
          <div key={design._id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="w-full h-56 bg-gray-700 relative">
              <img
                src={design.imagenDesing}
                alt={design.nombreDesing}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0 m-3">
                <button
                  onClick={() => handleEditDesign(design)}
                  className="bg-white text-purple-700 font-semibold py-1 px-4 rounded-md text-sm hover:bg-gray-200 transition duration-150"
                >
                  EDITAR
                </button>
              </div>
            </div>
            <div className="p-4 gradient-text-bg flex justify-between items-center">
              <div>
                <p className="font-semibold">nombre: {design.nombreDesing}</p>
                <p className="font-semibold">precio: ${design.valorDesing}</p>
                <p className="font-semibold">categoría: {design.categoria}</p>
                <p className="font-semibold text-purple-400">likes: {design.likes}</p>
              </div>
              {cartItems.some(item => item.id === design._id) ? (
                <button
                  disabled
                  className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-md text-sm cursor-not-allowed"
                >
                  En el carrito
                </button>
              ) : (
                <button
                  onClick={() => addItem({
                    id: design._id,
                    nombre: design.nombreDesing,
                    price: design.valorDesing,
                    imagen: design.imagenDesing,
                  })}
                  className="bg-purple-700 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-purple-800 transition duration-150"
                >
                  Agregar al carrito
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </main>
  );
}

export default DesignsComponent;
