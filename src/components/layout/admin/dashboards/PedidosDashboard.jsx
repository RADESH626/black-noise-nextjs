"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import SeccionHeader from '../secciones/acciones/SeccionHeader';
import { obtenerPedidos } from '@/app/acciones/PedidoActions';
import Loader from '@/components/Loader';
import BotonExportarPDF from '@/components/common/botones/BotonExportarPDF'; // Import BotonExportarPDF
import PedidoFilters from '@/components/admin/filters/PedidoFilters'; // Importar el componente de filtros
import { useRouter, useSearchParams } from 'next/navigation';
import PedidoCard from '@/components/common/PedidoCard'; // Importar PedidoCard

export default function PedidosDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Ahora se obtiene del backend si se implementa paginación en el backend
  const pedidosPerPage = 12; // Mantener el límite por defecto o hacerlo configurable

  const currentFilters = useMemo(() => ({
    estadoPedido: searchParams.get('estadoPedido') || undefined,
    estadoPago: searchParams.get('estadoPago') || undefined,
    metodoEntrega: searchParams.get('metodoEntrega') || undefined,
    proveedorId: searchParams.get('proveedorId') || undefined,
    usuarioCompradorId: searchParams.get('usuarioCompradorId') || undefined,
    valorTotalMin: searchParams.get('valorTotalMin') || undefined,
    valorTotalMax: searchParams.get('valorTotalMax') || undefined,
    fechaPedidoStart: searchParams.get('fechaPedidoStart') || undefined,
    fechaPedidoEnd: searchParams.get('fechaPedidoEnd') || undefined,
    pedidoCancelado: searchParams.get('pedidoCancelado') === 'true' ? true : (searchParams.get('pedidoCancelado') === 'false' ? false : undefined),
    pedidoRefabricado: searchParams.get('pedidoRefabricado') === 'true' ? true : (searchParams.get('pedidoRefabricado') === 'false' ? false : undefined),
    searchText: searchParams.get('searchText') || undefined,
  }), [searchParams]);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError(null);
      // Pasar los filtros y la paginación a la acción del servidor
      const { pedidos: fetchedPedidos, totalPedidos, totalPages: fetchedTotalPages, error: fetchError } = await obtenerPedidos({
        ...currentFilters,
        page: currentPage,
        limit: pedidosPerPage,
      });

      console.log("PedidosDashboard: fetchedPedidos", fetchedPedidos);
      console.log("PedidosDashboard: totalPedidos", totalPedidos);
      console.log("PedidosDashboard: fetchedTotalPages", fetchedTotalPages);
      console.log("PedidosDashboard: fetchError", fetchError);

      if (fetchError) {
        setError({ message: fetchError });
        setPedidos([]);
        setTotalPages(1);
      } else {
        setPedidos(fetchedPedidos || []);
        // Si el backend no devuelve totalPages, calcularlo aquí
        setTotalPages(fetchedTotalPages || Math.ceil((fetchedPedidos?.length || 0) / pedidosPerPage));
      }
      setLoading(false);
    };

    fetchPedidos();
  }, [currentPage, currentFilters, pedidosPerPage]);

  const handleApplyFilters = useCallback((filters) => {
    const params = new URLSearchParams(searchParams);
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.set(key, filters[key]);
      } else {
        params.delete(key);
      }
    });
    router.push(`/admin/pedidos?${params.toString()}`);
    setCurrentPage(1); // Reiniciar a la primera página al aplicar filtros
  }, [router, searchParams]);

  const handleClearFilters = useCallback(() => {
    router.push('/admin/pedidos');
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

  // PDF Export Mappers
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
            data={pedidos} 
            reportTitle="Reporte de Pedidos" 
            tableHeaders={[
              'ID Pedido', 'Nombre Usuario', 'Email Usuario', 'Valor Total', 'Estado Pedido', 'Fecha Pedido'
            ]} 
            tableBodyMapper={(pedido) => [
              pedido._id || 'N/A',
              pedido.userName || 'N/A',
              pedido.userEmail || 'N/A',
              `$${typeof pedido.total === 'number' ? pedido.total.toFixed(2) : '0.00'}`,
              pedido.estadoPedido || 'N/A',
              pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString() : 'N/A'
            ]} 
        />
      </div>
      <PedidoFilters onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} initialFilters={currentFilters} />

      <main className="grid grid-cols-1 gap-6 mt-8">
        {pedidos.map((pedido, index) => (
          <PedidoCard key={pedido._id} pedido={pedido} userRole="admin" />
        ))}
      </main>

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
