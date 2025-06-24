"use client";

import { useState } from 'react';

export default function FormFiltrarVentas({ initialVentasFromPage }) {
  const [ventas, setVentas] = useState(initialVentasFromPage || []);
  const [currentPage, setCurrentPage] = useState(1);
  const ventasPorPagina = 9; // Número de ventas por página

  const indexOfLastVenta = currentPage * ventasPorPagina;
  const indexOfFirstVenta = indexOfLastVenta - ventasPorPagina;
  const currentVentas = ventas.slice(indexOfFirstVenta, indexOfLastVenta);
  const totalPages = Math.ceil(ventas.length / ventasPorPagina);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div
      className="p-4 w-full flex flex-col items-center"
      style={{ backgroundColor: '#FFFFFFFF', color: '#FFFFFF' }} // fondo blanco
    >
      <h5 className="text-lg font-semibold mb-4 text-center">Ventas Registradas</h5>

      {ventas.length > 0 ? (
        <>
          <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
            {currentVentas.map((venta) => (
              <div
                key={venta._id}
                className="rounded-xl shadow-lg overflow-hidden"
                style={{ backgroundColor: '#1F2937' }} // fondo tarjeta
              >
                {/* Eliminada la imagen aquí */}

                <div className="p-4 gradient-text-bg flex justify-between items-center" style={{ color: '#FFFFFF', minHeight: '150px' }}>
                  <div>
                    <p className="font-semibold">ID Venta: {venta._id}</p>
                    <p className="font-semibold">
                      Monto: ${venta.pagoIds ? venta.pagoIds.reduce((sum, pago) => sum + (pago.valorPago || 0), 0).toFixed(2) : '0.00'}
                    </p>
                    <p className="font-semibold">
                      Fecha: {venta.createdAt ? new Date(venta.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="p-2 flex justify-center">
                  <button
                    onClick={() => alert(`Ver detalles de la venta: ${venta._id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded text-sm transition duration-300"
                  >
                    VER DETALLES
                  </button>
                </div>
              </div>
            ))}
          </main>

          {/* Paginación sin BotonGeneral */}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              Anterior
            </button>
            <span className="self-center" style={{ color: '#000000' }}>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              Siguiente
            </button>
          </div>
        </>
      ) : (
        <p
          className="text-center mt-8"
          style={{ color: '#9CA3AF' }} // texto gris claro
        >
          No hay ventas para mostrar.
        </p>
      )}
    </div>
  );
}
