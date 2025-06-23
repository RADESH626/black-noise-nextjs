"use client";
import React, { useEffect, useState } from "react";
import SeccionHeader from '../secciones/acciones/SeccionHeader';
import { obtenerPedidos } from '@/app/acciones/PedidoActions';
import Loader from '@/components/Loader';

export default function PedidosDashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredPedidos, setFilteredPedidos] = useState([]);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pedidosPerPage = 12;

  const indexOfLastPedido = currentPage * pedidosPerPage;
  const indexOfFirstPedido = indexOfLastPedido - pedidosPerPage;
  const currentPedidos = filteredPedidos.slice(indexOfFirstPedido, indexOfLastPedido);
  const totalPages = Math.ceil(filteredPedidos.length / pedidosPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError(null);
      const { pedidos: fetchedPedidos, error: fetchError } = await obtenerPedidos();
      if (fetchError) {
        setError({ message: fetchError });
        setPedidos([]);
      } else {
        setPedidos(fetchedPedidos || []);
      }
      setLoading(false);
    };

    fetchPedidos();
  }, []);

  useEffect(() => {
    const filterPedidos = () => {
      const filtered = pedidos.filter(pedido => {
        const userEmail = pedido.userId?.email ? pedido.userId.email.toLowerCase() : '';
        const pedidoId = pedido._id.toLowerCase();
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        const matchesSearchTerm = userEmail.includes(lowerCaseSearchTerm) || pedidoId.includes(lowerCaseSearchTerm);

        const pedidoDate = new Date(pedido.createdAt);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        const matchesDateRange = (!start || pedidoDate >= start) && (!end || pedidoDate <= end);

        return matchesSearchTerm && matchesDateRange;
      });
      setFilteredPedidos(filtered);
      setCurrentPage(1); // Reinicia a la página 1 en cada filtro
    };

    filterPedidos();
  }, [pedidos, searchTerm, startDate, endDate]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <>
        <SeccionHeader>
          <h4 className='font-bold text-2xl' style={{ color: '#000000' }}>Gestión de Pedidos</h4>
        </SeccionHeader>
        <div className="min-h-full flex justify-center items-center" style={{ color: '#EF4444' }}>
          Error al cargar pedidos: {error.message}
        </div>
      </>
    );
  }

  if (pedidos.length === 0) {
    return (
      <>
        <SeccionHeader>
          <h4 className='font-bold text-2xl' style={{ color: '#000000' }}>Gestión de Pedidos</h4>
        </SeccionHeader>
        <div className="min-h-full flex justify-center items-center" style={{ color: '#9CA3AF' }}>
          No hay pedidos para mostrar.
        </div>
      </>
    );
  }

  return (
    <>
      <SeccionHeader>
        <h4 className='font-bold text-2xl' style={{ color: '#000000' }}>Gestión de Pedidos</h4>
      </SeccionHeader>

      <div className="mt-4 p-4 rounded-lg shadow-md flex flex-wrap gap-4" style={{ backgroundColor: '#FFFFFF' }}>
        <input
          type="text"
          placeholder="Buscar por usuario o ID de pedido"
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
              {['ID Pedido', 'Nombre Usuario', 'Email Usuario', 'Valor Total', 'Estado Pedido', 'Fecha Pedido'].map((title) => (
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
            {currentPedidos.map((pedido) => (
              <tr key={pedido._id} style={{ borderBottom: '1px solid #000000FF' }}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: '#111827' }}>
                  {pedido._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6B7280' }}>
                  {pedido.userName || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6B7280' }}>
                  {pedido.userEmail || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#50545CFF' }}>
                  ${typeof pedido.valorPedido === 'number' ? pedido.valorPedido.toFixed(2) : '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#50545CFF' }}>
                  {pedido.estadoPago}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#50545CFF' }}>
                  {pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString() : 'N/A'}
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
