'use client';
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { obtenerPedidosPagadosPorUsuarioId, solicitarDevolucion } from "@/app/acciones/PedidoActions";
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import Modal from '@/components/common/modales/Modal';
import { EstadoPedido } from "@/models/enums/PedidoEnums";
import { useDialog } from "@/context/DialogContext";
import LoadingSpinner from '@/components/Loader';

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

  const { showDialog } = useDialog();
  const [cancelReason, setCancelReason] = useState('');

  const handleCancelarPedido = (pedidoId) => {
    setSelectedPedidoId(pedidoId);
    showDialog({
      title: "Cancelar Pedido",
      content: (
        <div>
          <p className="mb-4">Por favor, especifique la razón de la cancelación para el pedido {pedidoId}:</p>
          <textarea
            placeholder="Escriba aquí la razón de la cancelación..."
            className="border border-gray-700 rounded-md p-2 text-black w-full h-24"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </div>
      ),
      type: "confirm",
      onConfirm: () => handleConfirmCancelacion(pedidoId),
      onCancel: () => {
        setCancelReason('');
        setSelectedPedidoId(null);
      },
      confirmBtnText: "Confirmar Cancelación",
      cancelBtnText: "Volver"
    });
  };

  const handleConfirmCancelacion = async (pedidoId) => {
    if (!cancelReason.trim()) {
      showPopUp('Por favor, especifique la razón de la cancelación.', 'error');
      return;
    }

    try {
      // Aquí se llamará a la acción del servidor en PedidoActions.js
      // Necesitamos importar la acción primero
      const { cancelarPedido } = await import('@/app/acciones/PedidoActions');
      const result = await cancelarPedido(pedidoId, cancelReason.trim());

      if (result.success) {
        showPopUp('Pedido cancelado correctamente', 'success');
        // Refrescar pedidos tras cancelar
        const { pedidos: fetchedPedidos, error: fetchError } = await obtenerPedidosPagadosPorUsuarioId(userId);
        if (fetchError) {
          setError({ message: fetchError });
          setPedidos([]);
        } else {
          setPedidos(fetchedPedidos || []);
        }
      } else {
        showPopUp(result.message || 'Error al cancelar el pedido', 'error');
      }
    } catch (error) {
      console.error('Error al cancelar el pedido:', error);
      showPopUp('Error al cancelar el pedido', 'error');
    } finally {
      setCancelReason('');
      setSelectedPedidoId(null);
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
    const returnReason = selectedReturnReason === 'Otra' ? otraReason.trim() : selectedReturnReason;

    if (!returnReason) {
      showPopUp('Por favor, seleccione o especifique la razón de la devolución.', 'error');
      return;
    }

    try {
      const result = await solicitarDevolucion(selectedPedidoId, userId, returnReason);

      if (result.success) {
        showPopUp('Solicitud de devolución enviada correctamente', 'success');
        // Refrescar pedidos tras solicitud de devolución
        const { pedidos: fetchedPedidos, error: fetchError } = await obtenerPedidosPagadosPorUsuarioId(userId);
        if (fetchError) {
          setError({ message: fetchError });
          setPedidos([]);
        } else {
          setPedidos(fetchedPedidos || []);
        }
      } else {
        showPopUp(result.message || 'Error al enviar la solicitud de devolución', 'error');
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
    : pedidos.filter(pedido => pedido.estadoPedido !== EstadoPedido.CANCELADO);

  const handleToggleExpand = (pedidoId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pedidoId)) newSet.delete(pedidoId);
      else newSet.add(pedidoId);
      return newSet;
    });
  };

  const handleToggleDesignExpand = (designId) => {
    setExpandedDesigns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(designId)) newSet.delete(designId);
      else newSet.add(designId);
      return newSet;
    });
  };

  if (loading) return (
    <div className="min-h-full flex justify-center items-center text-gray-400">
      <LoadingSpinner />
    </div>
  );

  if (error) return (
    <div className="min-h-full flex justify-center items-center text-red-500">
      Error al cargar pedidos: {error.message}
    </div>
  );

  if (pedidos.length === 0) return (
    <div className="min-h-full flex justify-center items-center text-gray-400">
      No hay pedidos aún.
    </div>
  );

  return (
    <div className="bg-white text-black font-poppins p-4">
      <h2 className="text-center text-2xl font-bold mt-4">Tus Pedidos</h2>

      <div className="flex justify-end mb-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={showCancelled}
            onChange={() => setShowCancelled(!showCancelled)}
          />
          <div className="relative w-11 h-6 bg-gray-700 rounded-full peer dark:bg-gray-600 peer-checked:bg-red -500
            peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute
            after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full
            after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:after:border-white"></div>
          <span className="ml-3 text-sm font-medium text-black">Mostrar Pedidos Cancelados</span>
        </label>
      </div>

      <main className="grid grid-cols-1 gap-6 mt-8">
        {filteredPedidos.map((pedido, index) => (
          <motion.div
            key={pedido._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gray-800 rounded-xl shadow-lg overflow-hidden ${pedido.estadoPedido === EstadoPedido.CANCELADO ? 'border-2 border-red-500 opacity-70' : ''}`}
          >
            <div className="flex flex-col bg-gray-400 rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all duration-200 gap-4" suppressHydrationWarning={true}>
              {/* Sección Resumen */}
              <div
                className="flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer"
                onClick={() => handleToggleExpand(pedido._id.toString())}
              >
                <h2 className="text-lg font-semibold text-white bg-gray-600 p-2 rounded">Pedido ID: {pedido._id.toString()}</h2>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    pedido.estadoPedido === EstadoPedido.PENDIENTE ? 'bg-yellow-100 text-yellow-800' :
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
                    className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${
                      expandedOrders.has(pedido._id.toString()) ? 'rotate-180' : ''
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

              {/* Sección detalles (condicional) */}
              {expandedOrders.has(pedido._id.toString()) && (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-4">
                    {/* Info básica */}
                    <div className="flex flex-col gap-2 bg-gray-500 text-white rounded p-2">
                      <div>
                        <p className="font-medium">Total:</p>
                        <p className="text-xl font-bold text-green-500">${pedido.total?.toFixed(2) ?? '0.00'}</p>
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

                    {/* Diseños */}
                    <div className="flex flex-col flex-1 gap-2 bg-gray-500 rounded-md p-2">
                      <p className="font-medium text-white mb-2 text-center">Diseños:</p>
                      {pedido.items?.length > 0 ? (
                        pedido.items.map((item, idx) => {
                          const designId = item.designId?._id?.toString() || `design-${idx}`;
                          const design = item.designId;
                          return (
                            <div key={idx} className="flex flex-col bg-gray-400 rounded-md p-2">
                              <div
                                className="flex items-center space-x-3 cursor-pointer"
                                onClick={() => handleToggleDesignExpand(designId)}
                              >
                                {design?.imagen && (
                                  <img
                                    src={design.imagen}
                                    alt={design.nombreDesing || 'Diseño'}
                                    className="w-12 h-12 object-cover rounded-md"
                                  />
                                )}
                                <div className="flex items-center space-x-2">
                                  {design?.imagen && (
                                    <img
                                      src={design.imagen}
                                      alt={design.nombreDesing || 'Diseño'}
                                      className="w-8 h-8 object-cover rounded-full border border-gray-300"
                                    />
                                  )}
                                  <p className="font-semibold">{design?.nombreDesing || 'Diseño Desconocido'}</p>
                                </div>
                                <p className="text-sm text-gray-600">Cantidad: <span className="font-bold text-white">{item.quantity}</span></p>
                                <svg
                                  className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${
                                    expandedDesigns.has(designId) ? 'rotate-180' : ''
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                              </div>
                              {expandedDesigns.has(designId) && (
                                <div className="mt-2 text-sm text-gray-700 bg-gray-300 p-2 rounded-md">
                                  <p><span className="font-medium">Categoría:</span> {design?.categoria || 'N/A'}</p>
                                  <p><span className="font-medium">Precio Unitario:</span> ${design?.valorDesing ? parseFloat(design.valorDesing).toFixed(2) : '0.00'}</p>
                                  <p><span className="font-medium">Subtotal por Diseño:</span> ${design?.valorDesing && item.quantity ? (parseFloat(design.valorDesing) * item.quantity).toFixed(2) : '0.00'}</p>
                                  <p><span className="font-medium">Descripción:</span> {design?.descripcion || 'N/A'}</p>
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-600">No hay diseños asociados.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    {(pedido.estadoPedido === EstadoPedido.ENTREGADO || pedido.estadoPedido === EstadoPedido.LISTO) && (
                      <BotonGeneral
                        onClick={() => handleSolicitarDevolucion(pedido._id)}
                        variant="danger"
                        className="py-2 px-4 text-sm"
                      >
                        Solicitar Devolución
                      </BotonGeneral>
                    )}
                    {pedido.estadoPedido === EstadoPedido.PENDIENTE && (
                      <BotonGeneral
                        onClick={() => handleCancelarPedido(pedido._id)}
                        variant="danger"
                        className="py-2 px-4 text-sm"
                      >
                        Cancelar Pedido
                      </BotonGeneral>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </main>

      {showDevolucionModal && (
        <Modal
          title="Solicitar Devolución"
          onClose={handleCloseDevolucionModal}
        >
          <div>
            <p>¿Cuál es la razón de la devolución para el pedido {selectedPedidoId}?</p>
            <div className="flex flex-col space-y-2 mt-2">
              {[
                "El producto llegó dañado o es defectuoso",
                "La talla o el tamaño es incorrecto",
                "Recibí un artículo equivocado",
                "El producto es diferente a la descripción o a las fotos",
                "La calidad no es la esperada",
                "Otra",
              ].map((reason) => (
                <label key={reason} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="returnReason"
                    value={reason}
                    onChange={(e) => {
                      setSelectedReturnReason(e.target.value);
                      setShowOtraReason(e.target.value === 'Otra');
                    }}
                    checked={selectedReturnReason === reason}
                    className="cursor-pointer"
                  />
                  <span>{reason}</span>
                </label>
              ))}

              {showOtraReason && (
                <textarea
                  placeholder="Por favor, especifique la razón"
                  className="border border-gray-700 rounded-md p-2 text-black mt-2"
                  value={otraReason}
                  onChange={(e) => setOtraReason(e.target.value)}
                />
              )}
            </div>
            <BotonGeneral onClick={handleEnviarSolicitud} className="mt-4">
              Enviar Solicitud
            </BotonGeneral>
          </div>
        </Modal>
      )}

      <hr className="border-white my-6" />
      <div className="text-sm  pbg-[#f5f5f5]-4 rounded-md">
        <p className="font-semibold mb-2">RESUMEN DE PEDIDOS:</p>
        <p><span className="font-bold">Total de Pedidos:</span> {filteredPedidos.length}</p>
      </div>
    </div>
  );
};

export default PedidosContent;
