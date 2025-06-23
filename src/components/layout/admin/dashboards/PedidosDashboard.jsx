"use client";
import React, { useEffect, useState, useCallback } from "react";
import SeccionHeader from '../secciones/acciones/SeccionHeader';
import { obtenerPedidos } from '@/app/acciones/PedidoActions';
import Loader from '@/components/Loader';
import FilterBar from '@/components/common/FilterBar'; // Import FilterBar
import BotonExportarPDF from '@/components/common/botones/BotonExportarPDF'; // Import BotonExportarPDF
import { EstadoPedido } from '@/models/enums/PedidoEnums'; // Import EstadoPedido

export default function PedidosDashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({}); // State for filters
  const [filteredPedidos, setFilteredPedidos] = useState([]); // Keep for client-side pagination/filtering if needed

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

  const fetchAndSetPedidos = useCallback(async (currentFilters) => {
    setLoading(true);
    setError(null);
    const { pedidos: fetchedPedidos, error: fetchError } = await obtenerPedidos(currentFilters);
    if (fetchError) {
      setError({ message: fetchError });
      setPedidos([]);
      setFilteredPedidos([]);
    } else {
      setPedidos(fetchedPedidos || []);
      setFilteredPedidos(fetchedPedidos || []); // Initialize filteredPedidos with fetched data
    }
    setLoading(false);
    setCurrentPage(1); // Reset to page 1 on new fetch
  }, []);

  useEffect(() => {
    fetchAndSetPedidos(filters);
  }, [filters, fetchAndSetPedidos]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // PDF Export Mappers
  const pedidoTableHeaders = [
    'ID Pedido', 'Nombre Usuario', 'Email Usuario', 'Valor Total', 'Estado Pedido', 'Fecha Pedido'
  ];

  const pedidoTableBodyMapper = (pedido) => [
    pedido._id || 'N/A',
    pedido.userName || 'N/A',
    pedido.userEmail || 'N/A',
    `$${typeof pedido.total === 'number' ? pedido.total.toFixed(2) : '0.00'}`,
    pedido.estadoPedido || 'N/A',
    pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString() : 'N/A'
  ];

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

      <div className="flex justify-end mb-4">
        <BotonExportarPDF 
            data={filteredPedidos} 
            reportTitle="Reporte de Pedidos" 
            tableHeaders={pedidoTableHeaders} 
            tableBodyMapper={pedidoTableBodyMapper} 
        />
      </div>
      <FilterBar 
        onFilterChange={handleFilterChange} 
        initialFilters={filters} 
        additionalFilters={[
            {
                name: "estadoPedido",
                label: "Estado del Pedido:",
                type: "select",
                options: [
                    { value: "", label: "Todos" },
                    { value: EstadoPedido.PENDIENTE, label: "Pendiente" },
                    { value: EstadoPedido.EN_FABRICACION, label: "En Fabricación" },
                    { value: EstadoPedido.LISTO, label: "Listo" },
                    { value: EstadoPedido.ENVIADO, label: "Enviado" },
                    { value: EstadoPedido.ENTREGADO, label: "Entregado" },
                    { value: EstadoPedido.CANCELADO, label: "Cancelado" },
                    { value: EstadoPedido.SOLICITUD_DEVOLUCION, label: "Solicitud Devolución" },
                    { value: EstadoPedido.DEVOLUCION_APROBADA, label: "Devolución Aprobada" },
                    { value: EstadoPedido.DEVOLUCION_RECHAZADA, label: "Devolución Rechazada" },
                    { value: EstadoPedido.DEVOLUCION_COMPLETADA, label: "Devolución Completada" },
                ]
            }
        ]}
      />

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
                  ${typeof pedido.total === 'number' ? pedido.total.toFixed(2) : '0.00'}
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
