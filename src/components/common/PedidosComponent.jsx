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

  const filteredPedidos = pedidos.filter(pedido => showCancelled || pedido.estado !== EstadoPedido.CANCELADO);

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

  const handleSolicitarDevolucion = (pedidoId) => {
    setSelectedPedidoId(pedidoId);
    setShowDevolucionModal(true);
  };

  // Se elimina el estado cancelReason ya que no se usará un input para la razón de cancelación
  // const [cancelReason, setCancelReason] = useState(''); 
  const { showConfirmDialog } = useDialog(); // Usar showConfirmDialog en lugar de showDialog

  const handleCancelarPedido = async (pedidoId) => {
    setSelectedPedidoId(pedidoId);
    const confirmed = await showConfirmDialog(
      `¿Estás seguro de que quieres cancelar este pedido? Esta acción no se puede deshacer.`,
      "Confirmar Cancelación"
    );

    if (confirmed) {
      try {
        const { cancelarPedido } = await import('@/app/acciones/PedidoActions');
        const result = await cancelarPedido(pedidoId, ""); // Razón vacía
        if (result.success) {
          showPopUp('Pedido cancelado correctamente', 'success');
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
        setSelectedPedidoId(null);
      }
    } else {
      showPopUp("La cancelación del pedido ha sido anulada.", "info");
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
        {/* <label className="inline-flex items-center cursor-pointer">
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
        </label> */}
      </div>

      <main className="grid grid-cols-1 gap-6 mt-8">
        {filteredPedidos.map((pedido, index) => (
          <PedidoCard
            key={pedido._id}
            pedido={pedido}
            userRole="client"
            onSolicitarDevolucion={handleSolicitarDevolucion}
            onCancelarPedido={(id, reason) => handleCancelarPedido(id, reason)}
            expandedOrders={expandedOrders}
            handleToggleExpand={handleToggleExpand}
            expandedDesigns={expandedDesigns}
            handleToggleDesignExpand={handleToggleDesignExpand}
          />
        ))}
      </main>

      <hr className="border-white my-6 text-black" />
      <div className="text-sm rounded-md">
        <p className="font-semibold mb-2">RESUMEN DE PEDIDOS:</p>
        <p><span className="font-bold">Total de Pedidos:</span> {filteredPedidos.length}</p>
      </div>

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
    </div>
  );
};

export default PedidosContent;
