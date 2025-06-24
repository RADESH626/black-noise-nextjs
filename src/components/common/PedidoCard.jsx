"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { EstadoPedido } from "@/models/enums/PedidoEnums";
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import Modal from '@/components/common/modales/Modal';
import { useDialog } from "@/context/DialogContext";
import logger from '@/utils/logger'; // Importar el logger

export default function PedidoCard({ 
  pedido, 
  userRole, 
  onUpdateCostoEnvio, 
  onEstadoPedidoChange, 
  onSolicitarDevolucion, 
  onCancelarPedido,
  expandedOrders, // Recibir como prop
  handleToggleExpand, // Recibir como prop
  expandedDesigns: propExpandedDesigns, // Recibir como prop
  handleToggleDesignExpand // Recibir como prop
}) {
  // Asegurarse de que expandedOrders y expandedDesigns sean siempre un Set
  const currentExpandedOrders = expandedOrders instanceof Set ? expandedOrders : new Set();
  const currentExpandedDesigns = propExpandedDesigns instanceof Set ? propExpandedDesigns : new Set();

  logger.debug("PedidoCard: Renderizando para pedido:", pedido._id);
  if (pedido.items && pedido.items.length > 0) {
    pedido.items.forEach((item, index) => {
      logger.debug(`PedidoCard: Item ${index} - designId:`, item.designId?._id);
      logger.debug(`PedidoCard: Item ${index} - designId.imagen:`, item.designId?.imagen ? 'PRESENTE' : 'AUSENTE');
      if (!item.designId?.imagen) {
        logger.debug(`PedidoCard: Detalles de designId sin imagen en cliente:`, {
          _id: item.designId?._id,
          nombreDesing: item.designId?.nombreDesing,
          imagenValue: item.designId?.imagen // Mostrar el valor exacto, que debería ser null/undefined
        });
      }
    });
  }

  const { showPopUp, showConfirmDialog, showDialog } = useDialog();
  const [editableCostoEnvio, setEditableCostoEnvio] = useState(pedido.costoEnvio || 0);
  const [isUpdating, setIsUpdating] = useState(false);
  // const [expandedOrders, setExpandedOrders] = useState(new Set()); // Eliminado, ahora es una prop
  // const [expandedDesigns, setExpandedDesigns] = new Set(); // Eliminado, ahora es una prop
  const [cancelReason, setCancelReason] = useState('');
  const [showOtraReason, setShowOtraReason] = useState(false);
  const [selectedReturnReason, setSelectedReturnReason] = useState('');
  const [otraReason, setOtraReason] = useState('');
  const [showDevolucionModal, setShowDevolucionModal] = useState(false);

  // handleToggleExpand y handleToggleDesignExpand ahora se reciben como props, no se definen aquí.
  // Se asume que las funciones pasadas desde el padre manejarán la lógica de actualización del Set.

  const handleCostoEnvioChangeInternal = (value) => {
    setEditableCostoEnvio(parseFloat(value) || 0);
  };

  const handleUpdateCostoEnvioInternal = async () => {
    setIsUpdating(true);
    try {
      await onUpdateCostoEnvio(pedido._id.toString(), editableCostoEnvio);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEstadoPedidoChangeInternal = async (newEstado) => {
    const confirmed = await showConfirmDialog(
      `¿Estás seguro de que quieres cambiar el estado del pedido a "${newEstado.replace(/_/g, ' ')}"?`
    );

    if (confirmed) {
      setIsUpdating(true);
      try {
        await onEstadoPedidoChange(pedido._id.toString(), newEstado, pedido.estadoPedido);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleSolicitarDevolucionInternal = () => {
    setShowDevolucionModal(true);
  };

  const handleCloseDevolucionModal = () => {
    setShowDevolucionModal(false);
    setSelectedReturnReason('');
    setOtraReason('');
    setShowOtraReason(false);
  };

  const handleEnviarSolicitudInternal = async () => {
    const returnReason = selectedReturnReason === 'Otra' ? otraReason.trim() : selectedReturnReason;

    if (!returnReason) {
      showPopUp('Por favor, seleccione o especifique la razón de la devolución.', 'error');
      return;
    }

    try {
      await onSolicitarDevolucion(pedido._id, returnReason);
    } finally {
      handleCloseDevolucionModal();
    }
  };

  const handleCancelarPedidoInternal = () => {
    showDialog({
      title: "Cancelar Pedido",
      content: (
        <div>
          <p className="mb-4">Por favor, especifique la razón de la cancelación para el pedido {pedido._id}:</p>
          <textarea
            placeholder="Escriba aquí la razón de la cancelación..."
            className="border border-gray-700 rounded-md p-2 text-black w-full h-24"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </div>
      ),
      type: "confirm",
      onConfirm: () => handleConfirmCancelacionInternal(),
      onCancel: () => setCancelReason(''),
      confirmBtnText: "Confirmar Cancelación",
      cancelBtnText: "Volver"
    });
  };

  const handleConfirmCancelacionInternal = async () => {
    if (!cancelReason.trim()) {
      showPopUp('Por favor, especifique la razón de la cancelación.', 'error');
      return;
    }
    try {
      await onCancelarPedido(pedido._id, cancelReason.trim());
    } finally {
      setCancelReason('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`bg-gray-800 rounded-xl shadow-lg overflow-hidden ${pedido.estadoPedido === EstadoPedido.CANCELADO ? 'border-2 border-red-500 opacity-70' : ''}`}
    >
      <div className="flex flex-col bg-gray-400 rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all duration-200 gap-4" suppressHydrationWarning={true}>
        {/* Sección de Resumen */}
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
              className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${currentExpandedOrders.has(pedido._id.toString()) ? 'rotate-180' : ''
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
        {currentExpandedOrders.has(pedido._id.toString()) && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-4">
              {/* informacion basica del pedido */}
              <div className="flex flex-col gap-2 bg-gray-500 text-white rounded p-2">
                {userRole === 'admin' && pedido.proveedorId?.nombreEmpresa && (
                  <div>
                    <p className="font-medium">Proveedor:</p>
                    <p>{pedido.proveedorId.nombreEmpresa}</p>
                  </div>
                )}
                {(userRole === 'admin' || userRole === 'supplier') && pedido.userId?.Nombre && (
                  <div>
                    <p className="font-medium">Usuario:</p>
                    <p>{pedido.userId.Nombre}</p>
                  </div>
                )}
                {(userRole === 'admin' || userRole === 'supplier') && pedido.userId?.direccion && (
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
                            {item.designId?.imagen ? (
                              <img
                                src={item.designId.imagen}
                                alt={item.designId.nombreDesing || 'Diseño'}
                                className="w-8 h-8 object-cover rounded-full border border-gray-300"
                              />
                            ) : (
                              <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full border border-gray-300 text-gray-600 text-xs">
                                No Img
                              </div>
                            )}
                            <p className="font-semibold">{item.designId?.nombreDesing || 'Diseño Desconocido'}</p>
                          </div>
                          <p className="text-sm text-gray-600">Cantidad: <span className="font-bold text-white">{item.quantity}</span></p>
                          <svg
                            className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${currentExpandedDesigns.has(item.designId?._id?.toString() || `design-${index}`) ? 'rotate-180' : ''
                              }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                        {currentExpandedDesigns.has(item.designId?._id?.toString() || `design-${index}`) && (
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

            {userRole === 'supplier' && pedido.metodoEntrega === 'DOMICILIO' && (
              <div className="flex items-center space-x-2 bg-gray-500 p-2 rounded text-black">
                <label htmlFor={`costoEnvio-${pedido._id.toString()}`} className="font-medium ">Costo de Envío:</label>
                <input
                  id={`costoEnvio-${pedido._id.toString()}`}
                  type="number"
                  min={0}
                  max={100}
                  value={editableCostoEnvio}
                  onChange={(e) => handleCostoEnvioChangeInternal(e.target.value)}
                  className="w-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Costo"
                />
                <button
                  onClick={handleUpdateCostoEnvioInternal}
                  disabled={isUpdating || editableCostoEnvio === pedido.costoEnvio}
                  className={`bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded-md text-sm transition-colors duration-200 ${isUpdating || editableCostoEnvio === pedido.costoEnvio ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUpdating ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            )}

            {userRole === 'supplier' && (
              <div className="flex items-center space-x-2 bg-gray-500 p-2 rounded text-black">
                <label htmlFor={`estadoPedido-${pedido._id.toString()}`} className="font-medium">Estado:</label>
                <select
                  id={`estadoPedido-${pedido._id.toString()}`}
                  value={pedido.estadoPedido}
                  onChange={(e) => handleEstadoPedidoChangeInternal(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md  focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.values(EstadoPedido).map((estado) => (
                    <option key={estado} value={estado}>
                      {estado.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {userRole === 'client' && (
              <div className="flex justify-end gap-2">
                {(pedido.estadoPedido === EstadoPedido.ENTREGADO || pedido.estadoPedido === EstadoPedido.LISTO) && (
                  <BotonGeneral
                    onClick={handleSolicitarDevolucionInternal}
                    variant="danger"
                    className="py-2 px-4 text-sm"
                  >
                    Solicitar Devolución
                  </BotonGeneral>
                )}
                {pedido.estadoPedido === EstadoPedido.PENDIENTE && (
                  <BotonGeneral
                    onClick={handleCancelarPedidoInternal}
                    variant="danger"
                    className="py-2 px-4 text-sm"
                  >
                    Cancelar Pedido
                  </BotonGeneral>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {showDevolucionModal && (
        <Modal
          title="Solicitar Devolución"
          onClose={handleCloseDevolucionModal}
        >
          <div>
            <p>¿Cuál es la razón de la devolución para el pedido {pedido._id}?</p>
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
            <BotonGeneral onClick={handleEnviarSolicitudInternal} className="mt-4">
              Enviar Solicitud
            </BotonGeneral>
          </div>
        </Modal>
      )}
    </motion.div>
  );
}
