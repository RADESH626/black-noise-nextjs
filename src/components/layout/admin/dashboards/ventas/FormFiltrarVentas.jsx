"use client";

import { useState } from 'react';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

export default function FormFiltrarVentas({ initialVentasFromPage }) {
  const [ventas, setVentas] = useState(initialVentasFromPage || []);

  return (
    <div
      className="p-4"
      style={{ backgroundColor: '#272525FF', color: '#FFFFFF' }} /* bg-black text-white */
    >
      <h5 className="text-lg font-semibold mb-4 text-center">Ventas Registradas</h5>

      {ventas.length > 0 ? (
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ventas.map((venta) => (
            <div
              key={venta._id}
              className="rounded-xl shadow-lg overflow-hidden"
              style={{ backgroundColor: '#1F2937' }} /* bg-gray-800 */
            >
              <div
                className="w-full h-56 relative"
                style={{ backgroundColor: '#374151' }} /* bg-gray-700 */
              >
                <img
                  src="/public/img/Fondos/Fondo 1.jpg"
                  alt={`Venta ${venta._id}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 m-3">
                  <BotonGeneral
                    onClick={() => alert(`Ver detalles de la venta: ${venta._id}`)}
                    variant="info"
                    className="py-1 px-4 text-sm"
                  >
                    VER DETALLES
                  </BotonGeneral>
                </div>
              </div>
              <div className="p-4 gradient-text-bg flex justify-between items-center" style={{ color: '#FFFFFF' }}>
                <div>
                  <p className="font-semibold">ID Venta: {venta._id}</p>
                  <p className="font-semibold">Monto: ${venta.pagoIds ? venta.pagoIds.reduce((sum, pago) => sum + (pago.valorPago || 0), 0).toFixed(2) : '0.00'}</p>
                  <p className="font-semibold">Fecha: {venta.createdAt ? new Date(venta.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          ))}
        </main>
      ) : (
        <p
          className="text-center"
          style={{ color: '#9CA3AF' }} /* text-gray-400 */
        >
          No hay ventas para mostrar.
        </p>
      )}
    </div>
  );
}
