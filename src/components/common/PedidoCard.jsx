"use client";

import React, { useState, useEffect, useRef } from "react";
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
  onCostoEnvioInputChange, // Nueva prop
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

  if (pedido.items && pedido.items.length > 0) {
    pedido.items.forEach((item, index) => {
      if (!item.designId?.imagen) {
      }
    });
  }

  const { showPopUp, showConfirmDialog, openModal } = useDialog();
  const [isUpdating, setIsUpdating] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const cancelReasonRef = useRef(null); // Ref para el textarea
  const [modalKey, setModalKey] = useState(0); // Nuevo estado para forzar re-render del modal

  // handleCostoEnvioChangeInternal ahora llama a la prop del padre
  const handleCostoEnvioChangeInternal = (value) => {
    onCostoEnvioInputChange(pedido._id.toString(), parseFloat(value) || 0);
  };

  const handleUpdateCostoEnvioInternal = async () => {
    setIsUpdating(true);
    try {
      // onUpdateCostoEnvio ahora usa el valor de pedido.costoEnvio que ya fue actualizado por el padre
      await onUpdateCostoEnvio(pedido._id.toString(), pedido.costoEnvio);
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

  const handleCancelarPedidoInternal = async () => {
    const confirmed = await showConfirmDialog(
      `¿Estás seguro de que quieres cancelar este pedido? Esta acción no se puede deshacer.`,
      "Confirmar Cancelación"
    );

    if (confirmed) {
      try {
        await onCancelarPedido(pedido._id, ""); // Razón vacía
      } finally {
        // No es necesario resetear cancelReason ya que no se usa
      }
    } else {
      showPopUp("La cancelación del pedido ha sido anulada.", "info");
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
                {pedido.proveedorId?.nombreEmpresa && (
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
                {pedido.metodoEntrega === 'DOMICILIO' && pedido.direccionEnvio && (
                  <div>
                    <p className="font-medium">Dirección de Envío:</p>
                    <p>{pedido.direccionEnvio}</p>
                  </div>
                )}
                {pedido.destinatario?.nombre && (
                  <div>
                    <p className="font-medium">Destinatario:</p>
                    <p>{pedido.destinatario.nombre}</p>
                    <p>{pedido.destinatario.correo}</p>
                    {pedido.destinatario.direccion && <p>{pedido.destinatario.direccion}</p>}
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
                {pedido.motivo_devolucion && (
                  <div>
                    <p className="font-medium">Motivo Devolución:</p>
                    <p>{pedido.motivo_devolucion}</p>
                  </div>
                )}
                {pedido.motivo_rechazo_devolucion && (
                  <div>
                    <p className="font-medium">Motivo Rechazo Devolución:</p>
                    <p>{pedido.motivo_rechazo_devolucion}</p>
                  </div>
                )}
                {pedido.es_pedido_refabricado && (
                  <div>
                    <p className="font-medium">Pedido Refabricado:</p>
                    <p>Sí</p>
                  </div>
                )}
                {pedido.pedido_original_id && (
                  <div>
                    <p className="font-medium">ID Pedido Original:</p>
                    <p>{pedido.pedido_original_id.toString()}</p>
                  </div>
                )}
                {pedido.costos_negociados !== undefined && (
                  <div>
                    <p className="font-medium">Costos Negociados:</p>
                    <p>${pedido.costos_negociados.toFixed(2)}</p>
                  </div>
                )}
                {pedido.fue_cancelado && (
                  <div>
                    <p className="font-medium">Fue Cancelado:</p>
                    <p>Sí</p>
                  </div>
                )}
                {pedido.fecha_cancelacion && (
                  <div>
                    <p className="font-medium">Fecha Cancelación:</p>
                    <p>{new Date(pedido.fecha_cancelacion).toLocaleDateString()}</p>
                  </div>
                )}
                {pedido.razon_cancelacion && (
                  <div>
                    <p className="font-medium">Razón Cancelación:</p>
                    <p>{pedido.razon_cancelacion}</p>
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
                  value={pedido.costoEnvio || 0} // Leer directamente de la prop
                  onChange={(e) => handleCostoEnvioChangeInternal(e.target.value)}
                  className="w-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Costo"
                />
                <button
                  onClick={handleUpdateCostoEnvioInternal}
                  disabled={isUpdating} // Solo deshabilitar si se está actualizando
                  className={`bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded-md text-sm transition-colors duration-200 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                {(pedido.estadoPedido.trim().toUpperCase() === EstadoPedido.ENTREGADO ||
                  pedido.estadoPedido.trim().toUpperCase() === EstadoPedido.LISTO ||
                  pedido.estadoPedido.trim().toUpperCase() === EstadoPedido.LISTO_PARA_RECOGER) && (
                  <BotonGeneral
                    onClick={() => onSolicitarDevolucion(pedido._id.toString())}
                    variant="danger"
                    className="py-2 px-4 text-sm"
                  >
                    Solicitar Devolución
                  </BotonGeneral>
                )}
                {pedido.estadoPedido.trim().toUpperCase() === EstadoPedido.PENDIENTE && (
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
    </motion.div>
  );
}
