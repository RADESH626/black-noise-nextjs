'use client';
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { obtenerPedidosPagadosPorUsuarioId } from "@/app/acciones/PedidoActions";
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import Modal from '@/components/common/modales/Modal';
import { EstadoPedido } from "@/models/enums/PedidoEnums";
import { useDialog } from "@/context/DialogContext";

const PedidosContent = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const { showPopUp } = useDialog();

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelled, setShowCancelled] = useState(false);
  const [showDevolucionModal, setShowDevolucionModal] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const [showOtraReason, setShowOtraReason] = useState(false);
  const [selectedReturnReason, setSelectedReturnReason] = useState('');
  const [otraReason, setOtraReason] = useState('');
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [expandedDesigns, setExpandedDesigns] = useState(new Set());

  const handleSolicitarDevolucion = (pedidoId) => {
    setSelectedPedidoId(pedidoId);
    setShowDevolucionModal(true);
  };

  const handleCancelarPedido = async (pedidoId) => {
    try {
      const response = await fetch('/api/cancelar-pedido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pedidoId: pedidoId,
        }),
      });

      if (response.ok) {
        showPopUp('Pedido cancelado correctamente', 'success');
        // Refresh pedidos after cancellation
        const { pedidos: fetchedPedidos, error: fetchError } = await obtenerPedidosPagadosPorUsuarioId(userId);
        if (fetchError) {
          setError({ message: fetchError });
          setPedidos([]);
        } else {
          setPedidos(fetchedPedidos || []);
        }
      } else {
        showPopUp('Error al cancelar el pedido', 'error');
      }
    } catch (error) {
      console.error('Error al cancelar el pedido:', error);
      showPopUp('Error al cancelar el pedido', 'error');
    }
  };

  const handleCloseDevolucionModal = () => {
    setShowDevolucionModal(false);
    setSelectedPedidoId(null);
    setSelectedReturnReason('');
    setOtraReason('');
    setShowOtraReason(false);
  };

  const handleEnviarSolicitud = async () => {
    const returnReason = selectedReturnReason === 'Otra' ? otraReason : selectedReturnReason;
    console.log('Pedido ID:', selectedPedidoId);
    console.log('Razón de la devolución:', returnReason);

    if (!returnReason) {
      showPopUp('Por favor, seleccione o especifique la razón de la devolución.', 'error');
      return;
    }

    try {
      const response = await fetch('/api/devoluciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pedidoId: selectedPedidoId,
          returnReason: returnReason,
        }),
      });

      if (response.ok) {
        showPopUp('Solicitud de devolución enviada correctamente', 'success');
         // Refresh pedidos after return request
         const { pedidos: fetchedPedidos, error: fetchError } = await obtenerPedidosPagadosPorUsuarioId(userId);
         if (fetchError) {
           setError({ message: fetchError });
           setPedidos([]);
         } else {
           setPedidos(fetchedPedidos || []);
         }
      } else {
        showPopUp('Error al enviar la solicitud de devolución', 'error');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud de devolución:', error);
      showPopUp('Error al enviar la solicitud de devolución', 'error');
    }

    handleCloseDevolucionModal();
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      if (status === 'authenticated' && userId) {
        setLoading(true);
        setError(null);
        const { pedidos: fetchedPedidos, error: fetchError } = await obtenerPedidosPagadosPorUsuarioId(userId);
        if (fetchError) {
          setError({ message: fetchError });
          setPedidos([]);
        } else {
          setPedidos(fetchedPedidos || []);
        }
        setLoading(false);
      } else if (status === 'unauthenticated') {
        setLoading(false);
        setPedidos([]);
      }
    };

    fetchPedidos();
  }, [status, userId]);

  const filteredPedidos = showCancelled
    ? pedidos
    : pedidos.filter(pedido => pedido.estadoPedido !== 'CANCELADO');

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

  if (loading) {
    return (
      <div className="min-h-full flex justify-center items-center text-gray-400">
        Cargando pedidos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full flex justify-center items-center text-red-500">
        Error al cargar pedidos: {error.message}
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
    <div className="bg-black text-white font-poppins p-4">
      <h2 className="text-center text-2xl font-bold mt-4">Tus Pedidos</h2>

      <div className="flex justify-end mb-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={showCancelled}
            onChange={() => setShowCancelled(!showCancelled)}
          />
          <div className="relative w-11 h-6 bg-gray-700  dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-300">Mostrar Pedidos Cancelados</span>
        </label>
      </div>

      <main className="grid grid-cols-1 gap-6 mt-8">
        {console.log('DEBUG - filteredPedidos en PedidosComponent:', filteredPedidos)}
        {filteredPedidos.map((pedido, index) => {
          return (
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
                {console.log('DEBUG - expandedOrders.has(pedido._id.toString()):', expandedOrders.has(pedido._id.toString()))}
                {expandedOrders.has(pedido._id.toString()) && (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-4">
                      {/* informacion basica del pedido */}
                      <div className="flex flex-col gap-2 bg-gray-500 text-white rounded p-2">
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
                        {console.log('DEBUG - pedido.items:', pedido.items)}
                        {pedido.items && pedido.items.length > 0 ? (
                          <div className="flex flex-col p-2 rounded-md gap-4">
                            {pedido.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex flex-col bg-gray-400 rounded-md p-2">
                                <div
                                  className="flex items-center space-x-3 cursor-pointer"
                                  onClick={() => handleToggleDesignExpand(item.designId?._id?.toString() || `design-${itemIndex}`)}
                                >
                                  {item.designId?.imagen && (
                                    <img
                                      src={item.designId.imagen}
                                      alt={item.designId.nombreDesing || 'Diseño'}
                                      className="w-12 h-12 object-cover rounded-md"
                                    />
                                  )}
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
                                  {console.log('DEBUG - item.designId completo en PedidosComponent (dentro del map):', item.designId)}
                                  <p className="text-sm text-gray-600">Cantidad: <span className="font-bold text-white">{item.quantity}</span></p>
                                  <svg
                                    className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${expandedDesigns.has(item.designId?._id?.toString() || `design-${itemIndex}`) ? 'rotate-180' : ''
                                      }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                  </svg>
                                </div>
                                {expandedDesigns.has(item.designId?._id?.toString() || `design-${itemIndex}`) && (
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
                    <div className="flex justify-end">
                    <div className="flex justify-end">
                      {pedido.estadoPedido === EstadoPedido.ENTREGADO ? (
                        <BotonGeneral
                          onClick={() => handleSolicitarDevolucion(pedido._id)}
                          variant="danger"
                          className="py-2 px-4 text-sm"
                        >
                          Solicitar Devolución
                        </BotonGeneral>
                      ) : null}
                      {pedido.estadoPedido === EstadoPedido.PENDIENTE ? (
                        <BotonGeneral
                          onClick={() => handleCancelarPedido(pedido._id)}
                          variant="danger"
                          className="py-2 px-4 text-sm"
                        >
                          Cancelar Pedido
                        </BotonGeneral>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </main>

      {showDevolucionModal && (
        <Modal
          title="Solicitar Devolución"
          onClose={handleCloseDevolucionModal}
        >
          <div>
            <p>¿Cuál es la razón de la devolución para el pedido {selectedPedidoId}?</p>
            <div className="flex flex-col">
              <label>
                <input
                  type="radio"
                  name="returnReason"
                  value="El producto llegó dañado o es defectuoso"
                  onChange={(e) => {
                    setSelectedReturnReason(e.target.value);
                    setShowOtraReason(false);
                  }}
                  checked={selectedReturnReason === "El producto llegó dañado o es defectuoso"}
                />
                El producto llegó dañado o es defectuoso
              </label>
              <label>
                <input
                  type="radio"
                  name="returnReason"
                  value="La talla o el tamaño es incorrecto"
                  onChange={(e) => {
                    setSelectedReturnReason(e.target.value);
                    setShowOtraReason(false);
                  }}
                  checked={selectedReturnReason === "La talla o el tamaño es incorrecto"}
                />
                La talla o el tamaño es incorrecto
              </label>
              <label>
                <input
                  type="radio"
                  name="returnReason"
                  value="Recibí un artículo equivocado"
                  onChange={(e) => {
                    setSelectedReturnReason(e.target.value);
                    setShowOtraReason(false);
                  }}
                  checked={selectedReturnReason === "Recibí un artículo equivocado"}
                />
                Recibí un artículo equivocado
              </label>
              <label>
                <input
                  type="radio"
                  name="returnReason"
                  value="El producto es diferente a la descripción o a las fotos"
                  onChange={(e) => {
                    setSelectedReturnReason(e.target.value);
                    setShowOtraReason(false);
                  }}
                  checked={selectedReturnReason === "El producto es diferente a la descripción o a las fotos"}
                />
                El producto es diferente a la descripción o a las fotos
              </label>
              <label>
                <input
                  type="radio"
                  name="returnReason"
                  value="La calidad no es la esperada"
                  onChange={(e) => {
                    setSelectedReturnReason(e.target.value);
                    setShowOtraReason(false);
                  }}
                  checked={selectedReturnReason === "La calidad no es la esperada"}
                />
                La calidad no es la esperada
              </label>
              <label>
                <input
                  type="radio"
                  name="returnReason"
                  value="Otra"
                  onChange={(e) => {
                    setSelectedReturnReason('Otra');
                    setShowOtraReason(true);
                  }}
                  checked={selectedReturnReason === "Otra"}
                />
                Otra
              </label>
              {showOtraReason && (
                <textarea
                  placeholder="Por favor, especifique la razón"
                  className="border border-gray-700 rounded-md p-2 text-black"
                  value={otraReason}
                  onChange={(e) => setOtraReason(e.target.value)}
                />
              )}
            </div>
            <BotonGeneral onClick={handleEnviarSolicitud}>
              Enviar Solicitud
            </BotonGeneral>
          </div>
        </Modal>
      )}

      <hr className="border-white my-6" />
      <div className="text-sm bg-[#1f2937] p-4 rounded-md">
        <p className="font-semibold mb-2">RESUMEN DE PEDIDOS:</p>
        <p><span className="font-bold">Total de Pedidos:</span> {filteredPedidos.length}</p>
      </div>
    </div>
  );
};

export default PedidosContent;
