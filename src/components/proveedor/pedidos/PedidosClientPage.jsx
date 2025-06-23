"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { actualizarPedidoPorProveedor, obtenerPedidosPorProveedorId } from "@/app/acciones/ProveedorPedidoActions"; // Import obtenerPedidosPorProveedorId
import { useDialog } from "@/context/DialogContext";
import { useState, useEffect, useCallback } from "react"; // Import useCallback
import Loader from '@/components/Loader';
import { useQueryClient } from "@tanstack/react-query";
import { EstadoPedido } from "@/models/enums/PedidoEnums";
import { updateEstadoPedido } from "@/app/acciones/PedidoActions";
import { motion } from "framer-motion";
import FilterBar from '@/components/common/FilterBar'; // Import FilterBar
import BotonExportarPDF from '@/components/common/botones/BotonExportarPDF'; // Import BotonExportarPDF

export default function PedidosClientPage({ initialPedidos }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showPopUp, showConfirmDialog } = useDialog();
  const queryClient = useQueryClient();

  const [pedidos, setPedidos] = useState(initialPedidos);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({}); // State for filters
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

  const fetchAndSetPedidos = useCallback(async (currentFilters) => {
    setLoading(true);
    setError(null);
    if (!session?.user?.proveedorId) {
        setError("ID de proveedor no disponible.");
        setLoading(false);
        return;
    }
    const combinedFilters = { ...currentFilters, proveedorId: session.user.proveedorId };
    const { pedidos: fetchedPedidos, error: fetchError } = await obtenerPedidosPorProveedorId(combinedFilters);
    if (fetchError) {
      setError({ message: fetchError });
      setPedidos([]);
    } else {
      setPedidos(fetchedPedidos || []);
      const newInitialCostoEnvio = {};
      (fetchedPedidos || []).forEach(pedido => {
        newInitialCostoEnvio[pedido._id.toString()] = pedido.costoEnvio || 0;
      });
      setEditableCostoEnvio(newInitialCostoEnvio);
    }
    setLoading(false);
  }, [session?.user?.proveedorId]);

  useEffect(() => {
    if (status === 'authenticated') {
        fetchAndSetPedidos(filters);
    }
  }, [filters, fetchAndSetPedidos, status]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
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
      const result = await actualizarPedidoPorProveedor(pedidoId, session.user.proveedorId, { costoEnvio: costo });
      if (result.success) {
        showPopUp("Costo de envío actualizado exitosamente!", "success");
        setPedidos(prevPedidos =>
          prevPedidos.map(pedido =>
            pedido._id.toString() === pedidoId ? { ...pedido, costoEnvio: costo } : pedido
          )
        );
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
        const result = await updateEstadoPedido(pedidoId, newEstado);
        if (result.success) {
          showPopUp("Estado del pedido actualizado exitosamente!", "success");
          // Re-fetch with current filters to ensure the list is up-to-date
          fetchAndSetPedidos(filters);
        } else {
          showPopUp(result.message || "Error al actualizar el estado del pedido.", "error");
        }
      } catch (err) {
        console.error("Error al actualizar el estado del pedido:", err);
        showPopUp("Error al actualizar el estado del pedido. Inténtalo de nuevo.", "error");
      } finally {
        setIsUpdating(prev => ({ ...prev, [pedidoId]: false }));
      }
    }
  }

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

  const filteredPedidos = pedidos.filter(pedido => {
    // Aplicar lógica de filtrado basada en el estado `filters`
    // Por ahora, solo se aplica el filtro de estadoPedido
    if (filters.estadoPedido && filters.estadoPedido !== "" && pedido.estadoPedido !== filters.estadoPedido) {
        return false;
    }
    // Aquí se pueden añadir más lógicas de filtrado si es necesario
    return true;
  });

  if (filteredPedidos.length === 0 && Object.keys(filters).length > 0) {
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

      <main className="grid grid-cols-1 gap-6 mt-8">

        <div className="text-sm bg-[#1f2937] p-4 rounded-md text-white">
          <p className="font-semibold mb-2">RESUMEN DE PEDIDOS:</p>
          <p><span className="font-bold">Total de Pedidos:</span> {pedidos.length}</p>
        </div>

        {filteredPedidos.map((pedido, index) => (
          <motion.div
            key={pedido._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gray-800 rounded-xl shadow-lg overflow-hidden ${pedido.estadoPedido === 'CANCELADO' ? 'border-2 border-red-500 opacity-70' : ''}`}
          >
            <div className="flex flex-col bg-gray-400 rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all duration-200 gap-4" suppressHydrationWarning={true}>
              {/* Sección de Resumen */}
              <div
                className="flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer"
                onClick={() => handleToggleExpand(pedido._id.toString())}
              >
                <h2 className="text-lg font-semibold text-white bg-gray-600 p-2 rounded">Pedido ID: {pedido._id.toString()}</h2>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${pedido.estadoPedido === EstadoPedido.PENDIENTE ? 'bg-yellow-100 text-yellow-800' :
                    pedido.estadoPedido === EstadoPedido.ASIGNADO ? 'bg-blue-100 text-blue-800' :
                      pedido.estadoPedido === EstadoPedido.EN_PROCESO ? 'bg-purple-100 text-purple-800' :
                        pedido.estadoPedido === EstadoPedido.LISTO_PARA_RECOGER ? 'bg-green-100 text-green-800' :
                          pedido.estadoPedido === EstadoPedido.ENVIADO ? 'bg-indigo-100 text-indigo-800' :
                            pedido.estadoPedido === EstadoPedido.ENTREGADO ? 'bg-teal-100 text-teal-800' :
                              pedido.estadoPedido === EstadoPedido.CANCELADO ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                    }`}>
                    {pedido.estadoPedido.replace(/_/g, ' ')}
                  </span>

                  <svg
                    className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${expandedOrders.has(pedido._id.toString()) ? 'rotate-180' : ''
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              {/* Sección de Detalles (condicional) */}
              {expandedOrders.has(pedido._id.toString()) && (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-4">
                    {/* informacion basica del pedido */}
                    <div className="flex flex-col gap-2 bg-gray-500 text-white rounded p-2">
                      <div>
                        <p className="font-medium">Usuario:</p>
                        <p>{pedido.userId?.Nombre || 'N/A'}</p>
                      </div>
                      {pedido.userId?.direccion && (
                        <div>
                          <p className="font-medium">Dirección:</p>
                          <p>{pedido.userId.direccion}</p>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">Total:</p>
                        <p className="text-xl font-bold text-green-500">${pedido.total ? pedido.total.toFixed(2) : '0.00'}</p>
                      </div>
                      <div>
                        <p className="font-medium">Método de Entrega:</p>
                        <p>{pedido.metodoEntrega || 'N/A'}</p>
                      </div>
                      {pedido.fechaPedido && (
                        <div>
                          <p className="font-medium">Fecha del Pedido:</p>
                          <p>{new Date(pedido.fechaPedido).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>

                    {/* Información de los diseños */}
                    <div className="flex flex-col flex-1 gap-2 bg-gray-500 rounded-md">
                      <p className="font-medium text-white mb-2 text-center">Diseños:</p>
                      {pedido.items && pedido.items.length > 0 ? (
                        <div className="flex flex-col p-2 rounded-md gap-4">
                          {pedido.items.map((item, index) => (
                            <div key={index} className="flex flex-col bg-gray-400 rounded-md p-2">
                              <div
                                className="flex items-center space-x-3 cursor-pointer"
                                onClick={() => handleToggleDesignExpand(item.designId?._id?.toString() || `design-${index}`)}
                              >
                                <div className="flex items-center space-x-2">
                                  {console.log('DEBUG - item.designId en PedidosClientPage:', item.designId)}
                                  {item.designId?.imagen && (
                                    <img
                                      src={item.designId.imagen}
                                      alt={item.designId.nombreDesing || 'Diseño'}
                                      className="w-8 h-8 object-cover rounded-full border border-gray-300"
                                    />
                                  )}
                                  <p className="font-semibold">{item.designId?.nombreDesing || 'Diseño Desconocido'}</p>
                                </div>
                                <p className="text-sm text-gray-600">Cantidad: <span className="font-bold text-white">{item.quantity}</span></p>
                                <svg
                                  className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${expandedDesigns.has(item.designId?._id?.toString() || `design-${index}`) ? 'rotate-180' : ''
                                    }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                              </div>
                              {expandedDesigns.has(item.designId?._id?.toString() || `design-${index}`) && (
                                <div className="mt-2 text-sm text-gray-700 bg-gray-300 p-2 rounded-md">
                                  <p><span className="font-medium">Categoría:</span> {item.designId?.categoria || 'N/A'}</p>
                                  <p><span className="font-medium">Precio Unitario:</span> ${item.designId?.valorDesing ? parseFloat(item.designId.valorDesing).toFixed(2) : '0.00'}</p>
                                  <p><span className="font-medium">Subtotal por Diseño:</span> ${item.designId?.valorDesing && item.quantity ? (parseFloat(item.designId.valorDesing) * item.quantity).toFixed(2) : '0.00'}</p>
                                  <p><span className="font-medium">Descripción:</span> {item.designId?.descripcion || 'N/A'}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600">No hay diseños asociados.</p>
                      )}
                    </div>
                  </div>
                  {pedido.metodoEntrega === 'DOMICILIO' && (
                    <div className="flex items-center space-x-2 bg-gray-500 p-2 rounded text-black">
                      <label htmlFor={`costoEnvio-${pedido._id.toString()}`} className="font-medium ">Costo de Envío:</label>
                      <input
                        id={`costoEnvio-${pedido._id.toString()}`}
                        type="number"
                        min={0}
                        max={100}
                        value={editableCostoEnvio[pedido._id.toString()]}
                        onChange={(e) => handleCostoEnvioChange(pedido._id.toString(), e.target.value)}
                        className="w-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Costo"
                      />
                      <button
                        onClick={() => handleUpdateCostoEnvio(pedido._id.toString())}
                        disabled={isUpdating[pedido._id.toString()] || editableCostoEnvio[pedido._id.toString()] === pedido.costoEnvio}
                        className={`bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded-md text-sm transition-colors duration-200 ${isUpdating[pedido._id.toString()] || editableCostoEnvio[pedido._id.toString()] === pedido.costoEnvio ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isUpdating[pedido._id.toString()] ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 bg-gray-500 p-2 rounded text-black">
                    <label htmlFor={`estadoPedido-${pedido._id.toString()}`} className="font-medium">Estado:</label>
                    <select
                      id={`estadoPedido-${pedido._id.toString()}`}
                      value={pedido.estadoPedido}
                      onChange={(e) => handleEstadoPedidoChange(pedido._id.toString(), e.target.value, pedido.estadoPedido)}
                      className="p-2 border border-gray-300 rounded-md  focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Object.values(EstadoPedido).map((estado) => (
                        <option key={estado} value={estado}>
                          {estado.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  );
}
