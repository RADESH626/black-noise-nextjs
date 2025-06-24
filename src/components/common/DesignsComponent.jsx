'use client';

import React from 'react';
import BotonGeneral from './botones/BotonGeneral';
import LoadingSpinner from './LoadingSpinner';

function DesignsComponent({ loading, error, userDesigns, handleEditDesign, handleDeleteDesign, cartItems, addItem, orderedDesignIds, mode = 'catalog' }) {

  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        <div className="col-span-full text-center text-gray-400"><LoadingSpinner /></div>
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
          <div key={design._id} className="bg-gray-600 rounded-xl shadow-lg overflow-hidden">
            <div className="w-full h-56 bg-black relative">
              {design.imagen && design.imagen !== '' ? (
                <img
                  src={design.imagen}
                  alt={design.nombreDesing} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-400 text-center p-4">
                  Imagen no disponible
                </div>
              )}
            </div>
            <div className="p-4 gradient-text-bg flex justify-between items-center">
              <div>
                <p className="font-semibold">nombre: {design.nombreDesing}</p>
                <p className="font-semibold">precio: ${design.valorDesing}</p>
                <p className="font-semibold">categoría: {design.categoria}</p>
                <p className="font-semibold">estado: {design.estadoDesing}</p>
                <p className="font-semibold">creado: {new Date(design.createdAt).toLocaleDateString()}</p>
              </div>
              {mode === 'catalog' && (
                (cartItems || []).some(item => item.id === design._id) ? (
                  <BotonGeneral
                    disabled
                    className="bg-gray-600 text-black px-4 rounded-md text-sm cursor-not-allowed"
                  >
                    En el carrito
                  </BotonGeneral>
                ) : (
                  <BotonGeneral
                    onClick={() => addItem({
                      id: design._id,
                      nombre: design.nombreDesing,
                      price: design.valorDesing,
                      imagen: design.imagen,
                    })}
                    variant="primary"
                    className="px-4 rounded-md text-sm"
                  >
                    Agregar al carrito
                  </BotonGeneral>
                )
              )}
              {mode === 'profile' && (
                <div className="flex space-x-2">
                  {(cartItems || []).some(item => item.id === design._id) ? (
                    <BotonGeneral
                      disabled
                      className="bg-gray-600 text-black px-4 rounded-md text-sm cursor-not-allowed"
                    >
                      En el carrito
                    </BotonGeneral>
                  ) : (
                    <BotonGeneral
                      onClick={() => addItem({
                        id: design._id,
                        nombre: design.nombreDesing,
                        price: design.valorDesing,
                        imagen: design.imagen,
                      })}
                      variant="primary"
                      className="px-4 rounded-md text-sm"
                    >
                      Agregar al carrito
                    </BotonGeneral>
                  )}
                  <BotonGeneral
                    onClick={() => handleEditDesign(design)}
                    variant="secondary"
                    className="px-4 rounded-md text-sm"
                  >
                    Editar
                  </BotonGeneral>
                  <BotonGeneral
                    onClick={() => handleDeleteDesign(design._id)}
                    variant="danger"
                    className="px-4 rounded-md text-sm"
                  >
                    Eliminar
                  </BotonGeneral>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </main>
  );
}

export default DesignsComponent;
