"use client";

import React, { useState, useEffect } from 'react';
import { obtenerPagos } from '@/app/acciones/PagoActions';
import Loader from '@/components/Loader'; // Assuming Loader is in common

const PagosDashboard = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        setLoading(true);
        const { pagos: fetchedPagos, error: fetchError } = await obtenerPagos();
        if (fetchError) {
          setError(fetchError);
        } else {
          setPagos(fetchedPagos);
        }
      } catch (err) {
        setError('Error al cargar los pagos.');
        console.error('Error fetching payments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Pagos del Proveedor</h1>
      {pagos.length === 0 ? (
        <p>No hay pagos registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID Pago</th>
                <th className="py-2 px-4 border-b">Valor Pago</th>
                <th className="py-2 px-4 border-b">Método Pago</th>
                <th className="py-2 px-4 border-b">Estado Transacción</th>
                <th className="py-2 px-4 border-b">Fecha Pago</th>
                <th className="py-2 px-4 border-b">Usuario</th>
                <th className="py-2 px-4 border-b">Email Usuario</th>
                <th className="py-2 px-4 border-b">Método Entrega</th>
                <th className="py-2 px-4 border-b">Motivo Pago</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((pago) => (
                <tr key={pago._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{pago._id}</td>
                  <td className="py-2 px-4 border-b">${pago.valorPago ? pago.valorPago.toFixed(2) : 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{pago.metodoPago || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{pago.estadoTransaccion || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{new Date(pago.fechaPago).toLocaleDateString() || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{pago.usuarioId ? `${pago.usuarioId.Nombre} ${pago.usuarioId.primerApellido}` : 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{pago.usuarioId ? pago.usuarioId.correo : 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{pago.pedidoId ? pago.pedidoId.metodoEntrega : 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{pago.motivoPago || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PagosDashboard;
