'use client'; // Move to the top

import React from 'react'; // Keep one import

function DesignsComponent({ loading, error, userDesigns, handleEditDesign, cartItems, addItem, orderedDesignIds }) { // Keep orderedDesignIds prop for now, though not used for button logic

  // Helper function to safely get the image source
  const getImageSrc = (design) => {
    // design.imageData is now expected to be a base64 string (e.g., "data:image/jpeg;base64,...")
    if (design.imageData) {
      return design.imageData;
    }
    return design.imagenDesing || '/placeholder.png'; // fallback if imagenDesing also fails
  };

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
                src={getImageSrc(design)}
                alt={design.nombreDesing}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 gradient-text-bg flex justify-between items-center">
              <div>
                <p className="font-semibold">nombre: {design.nombreDesing}</p>
                <p className="font-semibold">precio: ${design.valorDesing}</p>
                <p className="font-semibold">categoría: {design.categoria}</p>
                <p className="font-semibold text-purple-400">likes: {design.likes}</p>
              </div>
              {/* Removed the check for orderedDesignIds.has(design._id) */}
              {(cartItems || []).some(item => item.id === design._id) ? (
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
