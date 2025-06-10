'use client';

import React, { useEffect, useState } from 'react';
import { obtenerPagosPorUsuarioId } from '@/app/acciones/PagoActions';

const PagosComponent = ({ userId }) => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPagos = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await obtenerPagosPorUsuarioId(userId);
        if (response.success) {
          setPagos(response.pagos);
        } else {
          setError(response.message || 'Error al cargar los pagos.');
        }
      } catch (err) {
        setError('Error de red o del servidor al cargar los pagos.');
        console.error('Error fetching payments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-4">Cargando pagos...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  if (pagos.length === 0) {
    return <div className="text-center py-4 text-gray-500">No hay pagos registrados.</div>;
  }

  return (
    <div className="p-4 bg-black text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Mis Pagos</h2>
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pagos.map((pago) => (
          <div key={pago._id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="w-full h-56 bg-gray-700 relative">
              <img
                src="/public/img/Fondos/Fondo 1.jpg"
                alt={`Pago ${pago._id}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0 m-3">
                <button
                  onClick={() => alert(`Ver detalles del pago: ${pago._id}`)}
                  className="bg-white text-purple-700 font-semibold py-1 px-4 rounded-md text-sm hover:bg-gray-200 transition duration-150"
                >
                  VER DETALLES
                </button>
              </div>
            </div>
            <div className="p-4 gradient-text-bg flex justify-between items-center text-white">
              <div>
                <p className="font-semibold">ID de Pago: {pago._id}</p>
                <p className="font-semibold">Monto: ${pago.monto.toFixed(2)}</p>
                <p className="font-semibold">Método: {pago.metodoPago}</p>
                <p className="font-semibold">Estado: {pago.estado}</p>
                <p className="font-semibold">Fecha: {new Date(pago.fechaPago).toLocaleDateString()}</p>
                {pago.referenciaTransaccion && (
                  <p className="font-semibold">Referencia: {pago.referenciaTransaccion}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default PagosComponent;
