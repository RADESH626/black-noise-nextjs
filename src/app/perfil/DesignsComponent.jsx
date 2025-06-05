"use client";

import React from 'react';
import { useCart } from "@/context/CartContext"; // Import useCart

function DesignsComponent({ loading, error, userDesigns, handleEditDesign }) {
  const { cartItems, addItem } = useCart(); // Get cartItems and addItem from context

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
              <input
                type="checkbox"
                checked={cartItems.some(item => item.id === design._id)}
                onChange={() => addItem({
                  id: design._id,
                  nombre: design.nombreDesing,
                  price: design.valorDesing,
                  imagen: design.imagenDesing,
                })}
                className="form-checkbox h-5 w-5 text-purple-600"
              />
            </div>
          </div>
        ))
      )}
    </main>
  );
}

export default DesignsComponent;
