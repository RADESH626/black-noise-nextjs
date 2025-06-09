"use client";

import { useState } from 'react';

export default function FormFiltrarVentas({ initialVentasFromPage }) {
  const [ventas, setVentas] = useState(initialVentasFromPage || []);

  return (
    <div className="p-4 bg-black text-white">
      <h5 className="text-lg font-semibold mb-4 text-center">Ventas Registradas</h5>
      {ventas.length > 0 ? (
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ventas.map(venta => (
            <div key={venta.id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="w-full h-56 bg-gray-700 relative">
                <img
                  src="/public/img/Fondos/Fondo 1.jpg"
                  alt={`Venta ${venta.id}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 m-3">
                  <button
                    onClick={() => alert(`Ver detalles de la venta: ${venta.id}`)}
                    className="bg-white text-purple-700 font-semibold py-1 px-4 rounded-md text-sm hover:bg-gray-200 transition duration-150"
                  >
                    VER DETALLES
                  </button>
                </div>
              </div>
              <div className="p-4 gradient-text-bg flex justify-between items-center text-white">
                <div>
                  <p className="font-semibold">ID Venta: {venta.id}</p>
                  <p className="font-semibold">Monto: ${venta.amount.toFixed(2)}</p>
                  <p className="font-semibold">Fecha: {new Date(venta.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </main>
      ) : (
        <p className="text-center text-gray-400">No hay ventas para mostrar.</p>
      )}
    </div>
  );
}
