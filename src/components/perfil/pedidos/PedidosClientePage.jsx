"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { obtenerPedidosPorUsuarioId } from "@/app/acciones/PedidoActions"; // Usar la acción de pedidos del usuario
import { useDialog } from "@/context/DialogContext";
import { useState, useEffect, useCallback } from "react";
import Loader from '@/components/Loader';
import { EstadoPedido } from "@/models/enums/PedidoEnums";
import { motion } from "framer-motion";

export default function PedidosClientePage({ initialPedidos }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showPopUp } = useDialog();

  const [pedidos, setPedidos] = useState(initialPedidos);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelled, setShowCancelled] = useState(false); // Para mostrar/ocultar pedidos cancelados
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [expandedDesigns, setExpandedDesigns] = useState(new Set());

  const fetchAndSetPedidos = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!session?.user?.id) {
        setError("ID de usuario no disponible.");
        setLoading(false);
        return;
    }
    const { pedidos: fetchedPedidos, error: fetchError } = await obtenerPedidosPorUsuarioId(session.user.id);
    if (fetchError) {
      setError({ message: fetchError });
      setPedidos([]);
    } else {
      setPedidos(fetchedPedidos || []);
    }
    setLoading(false);
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === 'authenticated') {
        fetchAndSetPedidos();
    }
  }, [fetchAndSetPedidos, status]);

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

  const filteredPedidos = showCancelled
    ? pedidos
    : pedidos.filter(pedido => pedido.estadoPedido !== EstadoPedido.CANCELADO);

  if (filteredPedidos.length === 0) {
    return (
      <div className="min-h-full flex justify-center items-center text-gray-400">
        No hay pedidos aún.
      </div>
    );
  }

  return (
    <div className="bg-white font-poppins p-4">

      <h2 className="text-center text-2xl font-bold mt-4 text-black">Tus Pedidos</h2>

      <div className="flex justify-end mb-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={showCancelled}
            onChange={() => setShowCancelled(!showCancelled)}
          />
          <div className="relative w-11 h-6 bg-gray-700 rounded-full peer dark:bg-gray-600 peer-checked:bg-red-500
            peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute
            after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full
            after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:after:border-white"></div>
          <span className="ml-3 text-sm font-medium text-black">Mostrar Pedidos Cancelados</span>
        </label>
      </div>

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
                      {pedido.costoEnvio !== undefined && (
                        <div>
                          <p className="font-medium">Costo de Envío:</p>
                          <p>${pedido.costoEnvio.toFixed(2)}</p>
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
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </main>

      <hr className="border-white my-6" />
      <div className="text-sm  pbg-[#f5f5f5]-4 rounded-md">
        <p className="font-semibold mb-2">RESUMEN DE PEDIDOS:</p>
        <p><span className="font-bold">Total de Pedidos:</span> {filteredPedidos.length}</p>
      </div>
    </div>
  );
}
