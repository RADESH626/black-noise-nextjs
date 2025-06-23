"use client";



import React, { useState, useEffect } from 'react';
import { obtenerPagos } from '@/app/acciones/PagoActions';
import Loader from '@/components/Loader';

const PagosDashboard = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Number of payments per page

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        setLoading(true);
        const { pagos: fetchedPagos, totalPagos, currentPage: fetchedCurrentPage, totalPages: fetchedTotalPages, error: fetchError } = await obtenerPagos(currentPage, limit);
        if (fetchError) {
          setError(fetchError);
        } else {
          setPagos(fetchedPagos);
          setTotalPages(fetchedTotalPages);
          setCurrentPage(fetchedCurrentPage);
        }
      } catch (err) {
        setError('Error al cargar los pagos.');
        console.error('Error fetching payments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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
                <th className="py-2 px-4 border-b">Fecha de Creación</th>
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
                  <td className="py-2 px-4 border-b">{new Date(pago.createdAt).toLocaleDateString() || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{pago.usuarioId ? `${pago.usuarioId.Nombre} ${pago.usuarioId.primerApellido}` : 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{pago.usuarioId ? pago.usuarioId.correo : 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{pago.pedidoId ? pago.pedidoId.metodoEntrega : 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{pago.motivo || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-4 py-2 rounded ${
                  pageNumber === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PagosDashboard;
