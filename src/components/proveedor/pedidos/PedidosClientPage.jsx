"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { actualizarPedidoPorProveedor, obtenerPedidosPorProveedorId } from "@/app/acciones/ProveedorPedidoActions"; // Import obtenerPedidosPorProveedorId
import { useDialog } from "@/context/DialogContext";
import { useState, useEffect, useCallback, useMemo } from "react"; // Import useCallback y useMemo
import Loader from '@/components/Loader';
import { useQueryClient } from "@tanstack/react-query";
import { EstadoPedido, MetodoEntrega } from "@/models/enums/PedidoEnums"; // Importar enums adicionales
import { EstadoPago } from "@/models/enums/pago/EstadoPago"; // Importar EstadoPago desde su ubicación correcta
import { updateEstadoPedido } from "@/app/acciones/PedidoActions";
import { motion } from "framer-motion";
import FilterBar from '@/components/common/FilterBar'; // Import FilterBar
import BotonExportarPDF from '@/components/common/botones/BotonExportarPDF'; // Import BotonExportarPDF
import PedidoCard from '@/components/common/PedidoCard'; // Importar PedidoCard
import { useSearchParams } from 'next/navigation'; // Importar useSearchParams
import logger from '@/utils/logger'; // Importar el logger

export default function PedidosClientPage({ initialPedidos }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams(); // Obtener searchParams
  const { showPopUp, showConfirmDialog } = useDialog();
  const queryClient = useQueryClient();

  const [pedidos, setPedidos] = useState(initialPedidos);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [filters, setFilters] = useState({}); // Eliminado, ahora se inicializa con useMemo
  const [editableCostoEnvio, setEditableCostoEnvio] = useState(() => {
    const initialCostoEnvio = {};
    initialPedidos.forEach(pedido => {
      initialCostoEnvio[pedido._id.toString()] = pedido.costoEnvio || 0;
    });
    return initialCostoEnvio;
  });
  const [isUpdating, setIsUpdating] = useState({});
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [expandedDesigns, setExpandedDesigns] = useState(new Set());

  // Sincronizar editableCostoEnvio con los pedidos actualizados
  useEffect(() => {
    setEditableCostoEnvio(prev => {
      const newCostoEnvio = { ...prev };
      pedidos.forEach(pedido => {
        newCostoEnvio[pedido._id.toString()] = pedido.costoEnvio || 0;
      });
      return newCostoEnvio;
    });
  }, [pedidos]); // Dependencia de 'pedidos'

  // Inicializar filtros desde searchParams
  const currentFilters = useMemo(() => ({
    searchText: searchParams.get('searchText') || undefined,
    estadoPedido: searchParams.get('estadoPedido') || undefined,
    estadoPago: searchParams.get('estadoPago') || undefined,
    metodoEntrega: searchParams.get('metodoEntrega') || undefined,
    usuarioComprador: searchParams.get('usuarioComprador') || undefined,
    minValorTotal: searchParams.get('minValorTotal') || undefined,
    maxValorTotal: searchParams.get('maxValorTotal') || undefined,
    fechaPedidoStart: searchParams.get('fechaPedidoStart') || undefined,
    fechaPedidoEnd: searchParams.get('fechaPedidoEnd') || undefined,
    pedidoCancelado: searchParams.get('pedidoCancelado') === 'true' ? 'true' : (searchParams.get('pedidoCancelado') === 'false' ? 'false' : undefined),
    pedidoRefabricado: searchParams.get('pedidoRefabricado') === 'true' ? 'true' : (searchParams.get('pedidoRefabricado') === 'false' ? 'false' : undefined),
  }), [searchParams]);

  const fetchAndSetPedidos = useCallback(async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const proveedorId = session.user.proveedorId;
      if (!proveedorId) {
        throw new Error("ID de proveedor no encontrado en la sesión.");
      }
      const data = await obtenerPedidosPorProveedorId({ proveedorId, ...filters });
      if (data.success) {
        setPedidos(data.pedidos);
      } else {
        setError(new Error(data.message || "Error al cargar los pedidos."));
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.proveedorId]); // Dependencia de proveedorId de la sesión

  useEffect(() => {
    if (status === 'authenticated') {
        // Usar currentFilters directamente para la llamada a la API
        fetchAndSetPedidos(currentFilters);
    }
  }, [currentFilters, fetchAndSetPedidos, status]); // Dependencia de currentFilters

  const handleFilterChange = (newFilters) => {
    // Actualizar la URL con los nuevos filtros
    const params = new URLSearchParams(searchParams);
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key] !== undefined && newFilters[key] !== null && newFilters[key] !== '') {
        params.set(key, newFilters[key]);
      } else {
        params.delete(key);
      }
    });
    router.push(`/proveedor/pedidos?${params.toString()}`);
  };

  const handleToggleExpand = (pedidoId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pedidoId)) {
        newSet.delete(pedidoId);
      } else {
        newSet.add(pedidoId);
      }
      return newSet;
    });
  };

  const handleToggleDesignExpand = (designId) => {
    setExpandedDesigns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(designId)) {
        newSet.delete(designId);
      } else {
        newSet.add(designId);
      }
      return newSet;
    });
  };

  const handleCostoEnvioChange = (pedidoId, value) => {
    setEditableCostoEnvio(prev => ({
      ...prev,
      [pedidoId]: parseFloat(value) || 0
    }));
  };

  const handleUpdateCostoEnvio = async (pedidoId) => {
    setIsUpdating(prev => ({ ...prev, [pedidoId]: true }));
    try {
      const costo = editableCostoEnvio[pedidoId];
      logger.debug(`[PedidosClientPage] Intentando actualizar costo de envío para pedido ${pedidoId} a: ${costo}`);
      const result = await actualizarPedidoPorProveedor(pedidoId, session.user.proveedorId, { costoEnvio: costo });
      logger.debug(`[PedidosClientPage] Resultado de actualizarPedidoPorProveedor:`, result);
      if (result.success) {
        showPopUp("Costo de envío actualizado exitosamente!", "success");
        // Actualizar el estado con el pedido completo devuelto por el servidor
        setPedidos(prevPedidos => {
          const updatedPedidos = prevPedidos.map(pedido =>
            pedido._id.toString() === pedidoId ? result.pedido : pedido
          );
          logger.debug(`[PedidosClientPage] Estado 'pedidos' actualizado. Nuevo pedido:`, result.pedido);
          return updatedPedidos;
        });
        // Opcional: re-fetch completo si la actualización local no es suficiente por alguna razón
        // fetchAndSetPedidos(currentFilters);
      } else {
        showPopUp(result.message || "Error al actualizar el costo de envío.", "error");
      }
    } catch (err) {
      console.error("Error updating shipping cost:", err);
      showPopUp("Error al actualizar el costo de envío. Inténtalo de nuevo.", "error");
    } finally {
      setIsUpdating(prev => ({ ...prev, [pedidoId]: false }));
    }
  };

  async function handleEstadoPedidoChange(pedidoId, newEstado, oldEstado) {
    const confirmed = await showConfirmDialog(
      `¿Estás seguro de que quieres cambiar el estado del pedido a "${newEstado.replace(/_/g, ' ')}"?`
    );

    if (confirmed) {
      setIsUpdating(prev => ({ ...prev, [pedidoId]: true }));
      try {
        logger.debug(`[PedidosClientPage] Intentando cambiar estado de pedido ${pedidoId} de ${oldEstado} a: ${newEstado}`);
        const result = await updateEstadoPedido(pedidoId, newEstado);
        logger.debug(`[PedidosClientPage] Resultado de updateEstadoPedido:`, result);
        if (result.success) {
          showPopUp("Estado del pedido actualizado exitosamente!", "success");
          // Re-fetch with current filters to ensure the list is up-to-date
          fetchAndSetPedidos(currentFilters); // CAMBIO AQUÍ
        } else {
          showPopUp(result.message || "Error al actualizar el estado del pedido.", "error");
        }
      } catch (err) {
        logger.error("Error al actualizar el estado del pedido:", err);
        showPopUp("Error al actualizar el estado del pedido. Inténtalo de nuevo.", "error");
      } finally {
        setIsUpdating(prev => ({ ...prev, [pedidoId]: false }));
      }
    }
  }

  // PDF Export Mappers
  if (loading || status === 'loading') {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-full flex justify-center items-center text-red-500">
        Error al cargar pedidos: {error.message}
      </div>
    );
  }

  // La lógica de filtrado en el cliente ya no es necesaria, ya que el filtrado principal se realiza en el servidor.
  // Se mantiene filteredPedidos para compatibilidad con el resto del componente.
  const filteredPedidos = pedidos;

  if (filteredPedidos.length === 0 && Object.keys(currentFilters).some(key => currentFilters[key] !== undefined && currentFilters[key] !== null && currentFilters[key] !== '')) {
    return (
      <div className="min-h-full flex justify-center items-center text-gray-400">
        No hay pedidos que coincidan con los filtros aplicados.
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="min-h-full flex justify-center items-center text-gray-400">
        No hay pedidos aún.
      </div>
    );
  }

  return (
    <div className="bg-white font-poppins p-4">

      <h2 className="text-center text-2xl font-bold mt-4 text-black">Pedidos del Proveedor</h2>

      <div className="flex justify-end mb-4">
        <BotonExportarPDF 
            data={pedidos} 
            reportTitle="Reporte de Pedidos de Proveedor" 
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
      <FilterBar 
        onFilterChange={handleFilterChange} 
        initialFilters={currentFilters} 
        additionalFilters={[
            {
                name: "searchText",
                label: "Buscar:",
                type: "text",
                placeholder: "ID Pedido o Email/Nombre Usuario"
            },
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
            },
            {
                name: "estadoPago",
                label: "Estado del Pago:",
                type: "select",
                options: [
                    { value: "", label: "Todos" },
                    { value: EstadoPago.PAGADO, label: "Pagado" },
                    { value: EstadoPago.PENDIENTE, label: "Pendiente" },
                    { value: EstadoPago.REEMBOLSADO, label: "Reembolsado" },
                ]
            },
            {
                name: "metodoEntrega",
                label: "Método de Entrega:",
                type: "select",
                options: [
                    { value: "", label: "Todos" },
                    { value: MetodoEntrega.ENVIO_A_DOMICILIO, label: "Envío a Domicilio" },
                    { value: MetodoEntrega.RECOGIDA_EN_TIENDA, label: "Recogida en Tienda" },
                ]
            },
            {
                name: "usuarioComprador",
                label: "Email Comprador:",
                type: "text",
                placeholder: "Filtrar por email del comprador"
            },
            {
                name: "minValorTotal",
                label: "Valor Total Mínimo:",
                type: "number",
                placeholder: "Mínimo"
            },
            {
                name: "maxValorTotal",
                label: "Valor Total Máximo:",
                type: "number",
                placeholder: "Máximo"
            },
            {
                name: "fechaPedidoStart",
                label: "Fecha Pedido Desde:",
                type: "date"
            },
            {
                name: "fechaPedidoEnd",
                label: "Fecha Pedido Hasta:",
                type: "date"
            },
            {
                name: "pedidoCancelado",
                label: "¿Pedido Cancelado?:",
                type: "select",
                options: [
                    { value: "", label: "Todos" },
                    { value: "true", label: "Sí" },
                    { value: "false", label: "No" },
                ]
            },
            {
                name: "pedidoRefabricado",
                label: "¿Pedido Refabricado?:",
                type: "select",
                options: [
                    { value: "", label: "Todos" },
                    { value: "true", label: "Sí" },
                    { value: "false", label: "No" },
                ]
            }
        ]}
      />

      <main className="grid grid-cols-1 gap-6 mt-8">

        <div className="text-sm bg-[#1f2937] p-4 rounded-md text-white">
          <p className="font-semibold mb-2">RESUMEN DE PEDIDOS:</p>
          <p><span className="font-bold">Total de Pedidos:</span> {pedidos.length}</p>
        </div>

        {filteredPedidos.map((pedido, index) => {
          // Crear una copia del pedido y sobrescribir el costoEnvio con el valor editable del padre
          const currentPedido = { 
            ...pedido, 
            costoEnvio: editableCostoEnvio[pedido._id.toString()] !== undefined 
                          ? editableCostoEnvio[pedido._id.toString()] 
                          : pedido.costoEnvio 
          };

          return (
            <PedidoCard 
              key={pedido._id} 
              pedido={currentPedido} // Pasar el pedido con el costoEnvio actualizado
              userRole="supplier" 
              onUpdateCostoEnvio={(id, costo) => handleUpdateCostoEnvio(id, costo)}
              onCostoEnvioInputChange={handleCostoEnvioChange} // Pasar la función de cambio del input
              onEstadoPedidoChange={(id, newEstado, oldEstado) => handleEstadoPedidoChange(id, newEstado, oldEstado)}
              expandedOrders={expandedOrders}
              handleToggleExpand={handleToggleExpand}
              expandedDesigns={expandedDesigns}
              handleToggleDesignExpand={handleToggleDesignExpand}
            />
          );
        })}
      </main>
    </div>
  );
}
