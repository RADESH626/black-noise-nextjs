"use client";
import React, { useEffect, useState, useCallback } from "react";
import SeccionHeader from '@/components/layout/admin/secciones/acciones/SeccionHeader';
import { obtenerPagos } from '@/app/acciones/PagoActions';
import Loader from '@/components/Loader';
import PagoFilters from '@/components/admin/filters/PagoFilters'; // Importar el componente de filtros
import { useRouter, useSearchParams } from 'next/navigation';
import BotonGeneral from '@/components/common/botones/BotonGeneral'; // Importar BotonGeneral
import BotonExportarPDF from '@/components/common/botones/BotonExportarPDF'; // Importar BotonExportarPDF

export default function PagosDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pagosPerPage = 12; // Mantener el límite por defecto o hacerlo configurable

  const currentFilters = React.useMemo(() => ({
    metodoPago: searchParams.get('metodoPago') || '',
    estadoTransaccion: searchParams.get('estadoTransaccion') || '',
    usuarioId: searchParams.get('usuarioId') || '',
    pedidoId: searchParams.get('pedidoId') || '',
    ventaId: searchParams.get('ventaId') || '',
    valorPagoMin: searchParams.get('valorPagoMin') || '',
    valorPagoMax: searchParams.get('valorPagoMax') || '',
    fechaPagoStart: searchParams.get('fechaPagoStart') || '',
    fechaPagoEnd: searchParams.get('fechaPagoEnd') || '',
  }), [
    searchParams.get('metodoPago'),
    searchParams.get('estadoTransaccion'),
    searchParams.get('usuarioId'),
    searchParams.get('pedidoId'),
    searchParams.get('ventaId'),
    searchParams.get('valorPagoMin'),
    searchParams.get('valorPagoMax'),
    searchParams.get('fechaPagoStart'),
    searchParams.get('fechaPagoEnd'),
  ]);

  useEffect(() => {
    const fetchPagos = async () => {
      setLoading(true);
      setError(null);
      const { pagos: fetchedPagos, totalPagos, totalPages: fetchedTotalPages, error: fetchError } = await obtenerPagos(currentPage, pagosPerPage, currentFilters);
      if (fetchError) {
        setError({ message: fetchError });
        setPagos([]);
        setTotalPages(1);
      } else {
        setPagos(fetchedPagos || []);
        setTotalPages(fetchedTotalPages || 1);
      }
      setLoading(false);
    };

    fetchPagos();
  }, [currentPage, currentFilters, pagosPerPage]); // Dependencias actualizadas

  const handleApplyFilters = useCallback((filters) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.set(key, filters[key]);
      } else {
        params.delete(key);
      }
    });
    router.push(`/admin/pagos?${params.toString()}`);
    setCurrentPage(1); // Reiniciar a la primera página al aplicar filtros
  }, [router]);

  const handleClearFilters = useCallback(() => {
    router.push('/admin/pagos');
    setCurrentPage(1); // Reiniciar a la primera página al limpiar filtros
  }, [router]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

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
        <div className="mb-4 flex justify-end">
            <BotonExportarPDF
                data={pagos}
                reportTitle="Reporte de Pagos"
                tableHeaders={[
                    'ID Pago', 'Valor Pago', 'Método Pago', 'Estado Transacción', 'Motivo', 'Fecha Pago',
                    'Usuario (Nombre, Email)', 'Venta Asociada (ID, Valor, Estado)', 'Pedido Asociado (ID, Entrega, Estado, Total)'
                ]}
                tableBodyMapper={(pago) => [
                    pago._id,
                    `$${typeof pago.valorPago === 'number' ? pago.valorPago.toFixed(2) : '0.00'}`,
                    pago.metodoPago,
                    pago.estadoTransaccion,
                    pago.motivo || 'N/A',
                    pago.createdAt ? new Date(pago.createdAt).toLocaleDateString() : 'N/A',
                    pago.usuarioId ? `${pago.usuarioId.Nombre} ${pago.usuarioId.primerApellido} (${pago.usuarioId.correo})` : 'N/A',
                    pago.ventaId
                        ? `ID: ${pago.ventaId._id}\nValor: $${typeof pago.ventaId.valorVenta === 'number' ? pago.ventaId.valorVenta.toFixed(2) : '0.00'}\nEstado: ${pago.ventaId.estadoVenta}`
                        : 'N/A',
                    pago.pedidoId
                        ? `ID: ${pago.pedidoId._id}\nEntrega: ${pago.pedidoId.metodoEntrega}\nEstado: ${pago.pedidoId.estadoPedido}\nTotal: $${typeof pago.pedidoId.total === 'number' ? pago.pedidoId.total.toFixed(2) : '0.00'}`
                        : 'N/A',
                ]}
                columnWidths={{
                    0: { cellWidth: 40 },    // ID Pago
                    1: { cellWidth: 25 },    // Valor Pago
                    2: { cellWidth: 25 },    // Método Pago
                    3: { cellWidth: 25 },    // Estado Transacción
                    4: { cellWidth: 25 },    // Motivo
                    5: { cellWidth: 25 },    // Fecha Pago
                    6: { cellWidth: 60 },    // Usuario (Nombre, Email)
                    7: { cellWidth: 60 },    // Venta Asociada (ID, Valor, Estado)
                    8: { cellWidth: 60 },    // Pedido Asociado (ID, Entrega, Estado, Total)
                }}
                className="py-2 px-4"
            />
        </div>
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

      <div className="mb-4 flex justify-end">
          <BotonExportarPDF
              data={pagos}
              reportTitle="Reporte de Pagos"
              tableHeaders={[
                  'ID Pago', 'Valor Pago', 'Método Pago', 'Estado Transacción', 'Motivo', 'Fecha Pago',
                  'Usuario (Nombre, Email)', 'Venta Asociada (ID, Valor, Estado)', 'Pedido Asociado (ID, Entrega, Estado, Total)'
              ]}
              tableBodyMapper={(pago) => [
                  pago._id,
                  `$${typeof pago.valorPago === 'number' ? pago.valorPago.toFixed(2) : '0.00'}`,
                  pago.metodoPago,
                  pago.estadoTransaccion,
                  pago.motivo || 'N/A',
                  pago.createdAt ? new Date(pago.createdAt).toLocaleDateString() : 'N/A',
                  pago.usuarioId ? `${pago.usuarioId.Nombre} ${pago.usuarioId.primerApellido} (${pago.usuarioId.correo})` : 'N/A',
                  pago.ventaId
                      ? `ID: ${pago.ventaId._id}\nValor: $${typeof pago.ventaId.valorVenta === 'number' ? pago.ventaId.valorVenta.toFixed(2) : '0.00'}\nEstado: ${pago.ventaId.estadoVenta}`
                      : 'N/A',
                  pago.pedidoId
                      ? `ID: ${pago.pedidoId._id}\nEntrega: ${pago.pedidoId.metodoEntrega}\nEstado: ${pago.pedidoId.estadoPedido}\nTotal: $${typeof pago.pedidoId.total === 'number' ? pago.pedidoId.total.toFixed(2) : '0.00'}`
                      : 'N/A',
              ]}
              columnWidths={{
                  0: { cellWidth: 30 },    // ID Pago
                  1: { cellWidth: 25 },    // Valor Pago
                  2: { cellWidth: 25 },    // Método Pago
                  3: { cellWidth: 15 },    // Estado Transacción
                  4: { cellWidth: 25 },    // Motivo
                  5: { cellWidth: 15 },    // Fecha Pago
                  6: { cellWidth: 60 },    // Usuario (Nombre, Email)
                  7: { cellWidth: 60 },    // Venta Asociada (ID, Valor, Estado)
                  8: { cellWidth: 60 },    // Pedido Asociado (ID, Entrega, Estado, Total)
              }}
              className="py-2 px-4"
          />
      </div>

      <div className="mb-6">
        <PagoFilters onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} initialFilters={currentFilters} />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md mt-4" style={{ backgroundColor: '#FFFFFF' }}>
        <table className="min-w-full divide-y" style={{ borderColor: '#FFFFFFFF' }}>
          <thead style={{ backgroundColor: '#F9FAFB' }}>
            <tr>
              {['ID Pago', 'Nombre Usuario', 'Email Usuario', 'Valor Pago', 'Método Pago', 'Método de Entrega', 'Estado Transacción', 'Motivo', 'Fecha Pago'].map((title) => (
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
            {pagos.map((pago) => ( // Usar 'pagos' directamente ya que el filtrado es en el servidor
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
                  {pago.pedidoId?.metodoEntrega || 'N/A'}
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
