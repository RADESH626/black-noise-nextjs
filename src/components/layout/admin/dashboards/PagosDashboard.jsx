"use client";
import React, { useEffect, useState } from "react";
import SeccionHeader from '@/components/layout/admin/secciones/acciones/SeccionHeader';
import { obtenerPagos } from '@/app/acciones/PagoActions';
import Loader from '@/components/Loader';

export default function PagosDashboard() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredPagos, setFilteredPagos] = useState([]);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pagosPerPage = 12;

  const indexOfLastPago = currentPage * pagosPerPage;
  const indexOfFirstPago = indexOfLastPago - pagosPerPage;
  const currentPagos = filteredPagos.slice(indexOfFirstPago, indexOfLastPago);
  const totalPages = Math.ceil(filteredPagos.length / pagosPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  useEffect(() => {
    const fetchPagos = async () => {
      setLoading(true);
      setError(null);
      const { pagos: fetchedPagos, error: fetchError } = await obtenerPagos();
      if (fetchError) {
        setError({ message: fetchError });
        setPagos([]);
      } else {
        setPagos(fetchedPagos || []);
      }
      setLoading(false);
    };

    fetchPagos();
  }, []);

  useEffect(() => {
    const filterPagos = () => {
      const filtered = pagos.filter(pago => {
        const userEmail = pago.usuarioId?.correo ? pago.usuarioId.correo.toLowerCase() : '';
        const pagoId = pago._id.toLowerCase();
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        const matchesSearchTerm = userEmail.includes(lowerCaseSearchTerm) || pagoId.includes(lowerCaseSearchTerm);

        const pagoDate = new Date(pago.createdAt);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        const matchesDateRange = (!start || pagoDate >= start) && (!end || pagoDate <= end);

        return matchesSearchTerm && matchesDateRange;
      });
      setFilteredPagos(filtered);
      setCurrentPage(1); // Reinicia a la página 1 en cada filtro
    };

    filterPagos();
  }, [pagos, searchTerm, startDate, endDate]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <>
        <SeccionHeader>
          <h4 className='font-bold text-2xl' style={{ color: '#000000' }}>Gestión de Pagos</h4>
        </SeccionHeader>
        <div className="min-h-full flex justify-center items-center" style={{ color: '#EF4444' }}>
          Error al cargar pagos: {error.message}
        </div>
      </>
    );
  }

  if (pagos.length === 0) {
    return (
      <>
        <SeccionHeader>
          <h4 className='font-bold text-2xl' style={{ color: '#000000' }}>Gestión de Pagos</h4>
        </SeccionHeader>
        <div className="min-h-full flex justify-center items-center" style={{ color: '#9CA3AF' }}>
          No hay pagos para mostrar.
        </div>
      </>
    );
  }

  return (
    <>
      <SeccionHeader>
        <h4 className='font-bold text-2xl' style={{ color: '#000000' }}>Gestión de Pagos</h4>
      </SeccionHeader>

      <div className="mt-4 p-4 rounded-lg shadow-md flex flex-wrap gap-4" style={{ backgroundColor: '#FFFFFF' }}>
        <input
          type="text"
          placeholder="Buscar por usuario o ID de pago"
          className="p-2 border rounded-md flex-grow"
          style={{
            borderColor: '#FFFFFFFF',
            backgroundColor: '#272525FF',
            color: '#FFFFFFFF'
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border rounded-md"
          style={{
            borderColor: '#000000FF',
            backgroundColor: '#FFFFFFFF',
            color: '#000000FF'
          }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span className="self-center" style={{ color: '#000000FF' }}>-</span>
        <input
          type="date"
          className="p-2 border rounded-md"
          style={{
            borderColor: '#000000FF',
            backgroundColor: '#FFFFFF',
            color: '#000000'
          }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md mt-4" style={{ backgroundColor: '#FFFFFF' }}>
        <table className="min-w-full divide-y" style={{ borderColor: '#FFFFFFFF' }}>
          <thead style={{ backgroundColor: '#F9FAFB' }}>
            <tr>
              {['ID Pago', 'Nombre Usuario', 'Email Usuario', 'Valor Pago', 'Método Pago', 'Estado Transacción', 'Motivo', 'Fecha Pago'].map((title) => (
                <th
                  key={title}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: '#030303FF' }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ backgroundColor: '#FFFFFFFF', borderColor: '#E5E7EBFF' }}>
            {currentPagos.map((pago) => (
              <tr key={pago._id} style={{ borderBottom: '1px solid #000000FF' }}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#111827' }}>
                  {pago._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6B7280' }}>
                  {pago.usuarioId?.Nombre || 'N/A'} {pago.usuarioId?.primerApellido || ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6B7280' }}>
                  {pago.usuarioId?.correo || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#50545CFF' }}>
                  ${typeof pago.valorPago === 'number' ? pago.valorPago.toFixed(2) : '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#50545CFF' }}>
                  {pago.metodoPago}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#50545CFF' }}>
                  {pago.estadoTransaccion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#50545CFF' }}>
                  {pago.motivo || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#50545CFF' }}>
                  {pago.createdAt ? new Date(pago.createdAt).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-gray-700 font-medium">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </>
  );
}
