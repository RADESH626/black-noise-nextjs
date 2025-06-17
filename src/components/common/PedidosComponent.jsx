'use client';
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { obtenerPedidosPagadosPorUsuarioId } from "@/app/acciones/PedidoActions";
// import PaymentModal from '@/components/pago/PaymentModal'; // No longer needed
import DesignImageDisplay from '@/components/common/DesignImageDisplay';

const PedidosContent = () => { // No longer needs onPaymentSuccess prop
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  // const { openModal, closeModal } = useModal(); // No longer needed

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError, ] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      if (status === 'authenticated' && userId) {
        setLoading(true);
        setError(null);
        // Use obtenerPedidosPagadosPorUsuarioId to only fetch paid orders
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

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {pedidos.map((pedido, index) => (
          <motion.div
            key={pedido._id} // Use pedido._id as key
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden"
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
                {/* The "Pagar" button is removed as orders are paid first */}
                <button
                  onClick={() => alert(`Ver detalles del pedido: ${pedido._id}`)}
                  className="bg-white text-purple-700 font-semibold py-1 px-4 rounded-md text-sm hover:bg-gray-200 transition duration-150"
                >
                  VER DETALLES
                </button>
              </div>
            </div>
            <div className="p-4 gradient-text-bg flex justify-between items-center">
              <div>
                <p className="font-semibold">Pedido ID: {pedido._id}</p>
                <p className="font-semibold">Estado: {pedido.estadoPago}</p>
                <p className="font-semibold">Total: ${pedido.total.toFixed(2)}</p> {/* Use pedido.total */}
                {/* Display other relevant order details here */}
              </div>
            </div>
          </motion.div>
        ))}
      </main>

      <hr className="border-white my-6" />
      {/* This section might need adjustment based on how order details are structured in the fetched pedido */}
      <div className="text-sm bg-[#1f2937] p-4 rounded-md">
        <p className="font-semibold mb-2">RESUMEN DE PEDIDOS:</p>
        <p><span className="font-bold">Total de Pedidos:</span> {pedidos.length}</p>
        {/* You might want to display aggregated info or details of a selected order here */}
      </div>
    </div>
  );
};

export default PedidosContent;
