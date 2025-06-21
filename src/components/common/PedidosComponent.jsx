'use client';
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { obtenerPedidosPagadosPorUsuarioId } from "@/app/acciones/PedidoActions";
// import PaymentModal from '@/components/pago/PaymentModal'; // No longer needed
import DesignImageDisplay from '@/components/common/DesignImageDisplay';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import Modal from '@/components/common/modales/Modal';

const PedidosContent = () => { // No longer needs onPaymentSuccess prop
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  // const { openModal, closeModal } = useModal(); // No longer needed

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelled, setShowCancelled] = useState(false);
  const [showDevolucionModal, setShowDevolucionModal] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const [showOtraReason, setShowOtraReason] = useState(false);
  const [selectedReturnReason, setSelectedReturnReason] = useState('');
  const [otraReason, setOtraReason] = useState('');

  const handleSolicitarDevolucion = (pedidoId) => {
    setSelectedPedidoId(pedidoId);
    setShowDevolucionModal(true);
  };

  const handleCloseDevolucionModal = () => {
    setShowDevolucionModal(false);
    setSelectedPedidoId(null);
  };

  const handleEnviarSolicitud = async () => {
    const returnReason = selectedReturnReason === 'Otra' ? otraReason : selectedReturnReason;
    console.log('Pedido ID:', selectedPedidoId);
    console.log('Razón de la devolución:', returnReason);

    if (!returnReason) {
      alert('Por favor, seleccione o especifique la razón de la devolución.');
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

  // handlePayOrder is no longer needed as orders are paid first
  // const handlePayOrder = (pedidoId, valorPedido) => {
  //   openModal(
  //     "Realizar Pago",
  //     <PaymentModal
  //       pedidoId={pedidoId}
  //       valorPedido={valorPedido}
  //       onClose={closeModal}
  //       onPaymentSuccess={onPaymentSuccess}
  //     />
  //   );
  // };

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
          <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-300">Mostrar Pedidos Cancelados</span>
        </label>
      </div>

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredPedidos.map((pedido, index) => {
          return (
            <motion.div
              key={pedido._id}
              initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gray-800 rounded-xl shadow-lg overflow-hidden ${pedido.estadoPedido === 'CANCELADO' ? 'border-2 border-red-500 opacity-70' : ''}`}
          >
            <div className="w-full h-56 bg-gray-700 relative">
              {pedido.items && pedido.items.length > 0 && pedido.items[0]?.designId?.imageData ? (
                <DesignImageDisplay
                  imageData={pedido.items[0].designId.imageData}
                  imageMimeType={pedido.items[0].designId.imageMimeType}
                  altText={pedido.items[0].designId.nombreDesing || "Producto"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/public/img/Fondos/Fondo 1.jpg" // Default image if no items or image data
                  alt="No hay imagen disponible"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-0 right-0 m-3">
                <BotonGeneral
                  onClick={() => alert(`Ver detalles del pedido: ${pedido._id}`)}
                  variant="info"
                  className="py-1 px-4 text-sm"
                >
                  VER DETALLES
                </BotonGeneral>
              </div>
            </div>
            <div className="p-4 gradient-text-bg flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold">Pedido ID: {pedido._id}</p>
                  <p className="font-semibold">Estado de Pago: {pedido.estadoPago}</p>
                  <p className="font-semibold">Estado de Pedido: {pedido.estadoPedido}</p>
                  <p className="font-semibold">Total: ${pedido.total.toFixed(2)}</p>
                  {pedido.proveedorId && (
                    <p className="font-semibold">Proveedor: {pedido.proveedorId.nombreEmpresa}</p>
                  )}
                  {pedido.userId?.direccion && (
                    <p className="font-semibold">Dirección: {pedido.userId.direccion}</p>
                  )}
                </div>
                <BotonGeneral
                  onClick={() => handleSolicitarDevolucion(pedido._id)}
                  variant="danger"
                  className="py-2 px-4 text-sm"
                >
                  Solicitar Devolución
                </BotonGeneral>
              </div>
              <div className="mt-4 border-t border-gray-700 pt-4">
                <p className="font-semibold mb-2">Ítems del Pedido:</p>
                {pedido.items && pedido.items.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-300">
                    {pedido.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        {item.designId?.nombreDesing} (Cantidad: {item.quantity})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">No hay ítems en este pedido.</p>
                )}
              </div>
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
                  onChange={(e) => setSelectedReturnReason(e.target.value)}
                />
                El producto llegó dañado o es defectuoso
              </label>
              <label>
                <input
                  type="radio"
                  name="returnReason"
                  value="La talla o el tamaño es incorrecto"
                  onChange={(e) => setSelectedReturnReason(e.target.value)}
                />
                La talla o el tamaño es incorrecto
              </label>
              <label>
                <input
                  type="radio"
                  name="returnReason"
                  value="Recibí un artículo equivocado"
                  onChange={(e) => setSelectedReturnReason(e.target.value)}
                />
                Recibí un artículo equivocado
              </label>
              <label>
                <input
                  type="radio"
                  name="returnReason"
                  value="El producto es diferente a la descripción o a las fotos"
                  onChange={(e) => setSelectedReturnReason(e.target.value)}
                />
                El producto es diferente a la descripción o a las fotos
              </label>
              <label>
                <input
                  type="radio"
                  name="returnReason"
                  value="La calidad no es la esperada"
                  onChange={(e) => setSelectedReturnReason(e.target.value)}
                />
                La calidad no es la esperada
              </label>
              <label>
                <input
                  type="radio"
                  name="returnReason"
                  value="Otra"
                  onChange={(e) => {
                    setShowOtraReason(e.target.checked);
                    setSelectedReturnReason('Otra');
                  }}
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
