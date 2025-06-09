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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Mis Pagos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pagos.map((pago) => (
          <div key={pago._id} className="bg-white p-4 rounded-lg shadow-md">
            <p><strong>ID de Pago:</strong> {pago._id}</p>
            <p><strong>Monto:</strong> ${pago.monto.toFixed(2)}</p>
            <p><strong>Método:</strong> {pago.metodoPago}</p>
            <p><strong>Estado:</strong> {pago.estado}</p>
            <p><strong>Fecha:</strong> {new Date(pago.fechaPago).toLocaleDateString()}</p>
            {pago.referenciaTransaccion && (
              <p><strong>Referencia:</strong> {pago.referenciaTransaccion}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PagosComponent;
