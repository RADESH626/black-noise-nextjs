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
import PedidoCard from '@/components/common/PedidoCard'; // Importar PedidoCard
import logger from '@/utils/logger'; // Importar el logger

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
        logger.debug("PedidosContent: Intentando obtener pedidos para userId:", userId);
        const { pedidos: fetchedPedidos, error: fetchError } = await obtenerPedidosPagadosPorUsuarioId(userId);
        if (fetchError) {
          setError({ message: fetchError });
          setPedidos([]);
          logger.error("PedidosContent: Error al obtener pedidos:", fetchError);
        } else {
          setPedidos(fetchedPedidos || []);
          logger.debug("PedidosContent: Pedidos obtenidos y establecidos:", fetchedPedidos);
        }
        setLoading(false);
      } else if (status === 'unauthenticated') {
        setLoading(false);
        setPedidos([]);
        logger.debug("PedidosContent: Usuario no autenticado, no se obtienen pedidos.");
      }
    };

    fetchPedidos();
  }, [status, userId]);

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
          <PedidoCard
            key={pedido._id}
            pedido={pedido}
            userRole="client"
            onSolicitarDevolucion={(id, reason) => handleSolicitarDevolucion(id, reason)}
            onCancelarPedido={(id, reason) => handleCancelarPedido(id, reason)}
          />
        ))}
      </main>

      <hr className="border-white my-6" />
      <div className="text-sm  pbg-[#f5f5f5]-4 rounded-md">
        <p className="font-semibold mb-2">RESUMEN DE PEDIDOS:</p>
        <p><span className="font-bold">Total de Pedidos:</span> {filteredPedidos.length}</p>
      </div>
    </div>
  );
};

export default PedidosContent;
