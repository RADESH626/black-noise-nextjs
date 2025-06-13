'use client';

import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { obtenerPedidosPagadosPorUsuarioId } from '@/app/acciones/PedidoActions'; // Import the new function

const PagosComponent = ({ userId }) => {
  const [paidOrders, setPaidOrders] = useState([]); // State for paid orders
=======
import { obtenerPagosPorUsuarioId } from '@/app/acciones/PagoActions';

const PagosComponent = ({ userId }) => {
  const [pagos, setPagos] = useState([]);
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
<<<<<<< HEAD
    const fetchPaidOrders = async () => { // Rename fetch function
=======
    const fetchPagos = async () => {
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
<<<<<<< HEAD
        // Call the new function to get paid orders
        const response = await obtenerPedidosPagadosPorUsuarioId(userId);
        if (response.pedidos) { // Check for 'pedidos' array in response
          setPaidOrders(response.pedidos);
        } else {
          // Handle case where response might have an error property
          setError(response.message || response.error || 'Error al cargar el historial de compras.');
        }
      } catch (err) {
        setError('Error de red o del servidor al cargar el historial de compras.');
        console.error('Error fetching paid orders:', err);
=======
        const response = await obtenerPagosPorUsuarioId(userId);
        if (response.success) {
          setPagos(response.pagos);
        } else {
          setError(response.message || 'Error al cargar los pagos.');
        }
      } catch (err) {
        setError('Error de red o del servidor al cargar los pagos.');
        console.error('Error fetching payments:', err);
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
      } finally {
        setLoading(false);
      }
    };

<<<<<<< HEAD
    fetchPaidOrders(); // Call the new fetch function
  }, [userId]);

  if (loading) {
    return <div className="text-center py-4">Cargando historial de compras...</div>;
=======
    fetchPagos();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-4">Cargando pagos...</div>;
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

<<<<<<< HEAD
  if (paidOrders.length === 0) {
    return <div className="text-center py-4 text-gray-500">No hay historial de compras registrado.</div>;
=======
  if (pagos.length === 0) {
    return <div className="text-center py-4 text-gray-500">No hay pagos registrados.</div>;
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
  }

  return (
    <div className="p-4 bg-black text-white">
<<<<<<< HEAD
      <h2 className="text-2xl font-bold mb-4 text-center">Historial de Compras</h2>
      <main className="grid grid-cols-1 gap-6"> {/* Use a single column grid for order list */}
        {paidOrders.map((order) => (
          <div key={order._id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden p-4">
            <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
              <div>
                <p className="font-semibold">Pedido ID: {order._id}</p>
                <p className="font-semibold">Fecha del Pedido: {new Date(order.createdAt).toLocaleDateString()}</p> {/* Assuming createdAt exists */}
                <p className="font-semibold">Estado de Pago: {order.estadoPago}</p>
                <p className="font-semibold">Valor Total: ${order.valorPedido?.toFixed(2)}</p> {/* Use valorPedido */}
              </div>
              {/* Optional: Add a button for order details if needed */}
              {/* <button className="bg-white text-purple-700 font-semibold py-1 px-4 rounded-md text-sm hover:bg-gray-200 transition duration-150">VER DETALLES</button> */}
            </div>

            {/* Display items within the order */}
            <div className="mb-3">
              <h3 className="font-semibold mb-2">Items:</h3>
              <ul className="list-disc list-inside ml-4">
                {order.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-sm text-gray-300">
                    {item.designId?.nombreDesing || 'Diseño desconocido'} - Cantidad: {item.quantity}
                    {/* Optional: Display design image if available */}
                    {/* {item.designId?.imagenDesing && <img src={item.designId.imagenDesing} alt="Design Image" className="w-10 h-10 inline-block ml-2 object-cover" />} */}
                  </li>
                ))}
              </ul>
            </div>

            {/* Optional: Display payment details if available and relevant */}
            {/* Assuming payment details might be linked or embedded */}
            {/* <div className="border-t border-gray-700 pt-3">
                <h3 className="font-semibold mb-2">Detalles de Pago:</h3>
                 Render payment details here if available
            </div> */}

=======
      <h2 className="text-2xl font-bold mb-4 text-center">Mis Pagos</h2>
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pagos.map((pago) => (
          <div key={pago._id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="w-full h-56 bg-gray-700 relative">
              <img
                src="/public/img/Fondos/Fondo 1.jpg"
                alt={`Pago ${pago._id}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0 m-3">
                <button
                  onClick={() => alert(`Ver detalles del pago: ${pago._id}`)}
                  className="bg-white text-purple-700 font-semibold py-1 px-4 rounded-md text-sm hover:bg-gray-200 transition duration-150"
                >
                  VER DETALLES
                </button>
              </div>
            </div>
            <div className="p-4 gradient-text-bg flex justify-between items-center text-white">
              <div>
                <p className="font-semibold">ID de Pago: {pago._id}</p>
                <p className="font-semibold">Monto: ${pago.monto.toFixed(2)}</p>
                <p className="font-semibold">Método: {pago.metodoPago}</p>
                <p className="font-semibold">Estado: {pago.estado}</p>
                <p className="font-semibold">Fecha: {new Date(pago.fechaPago).toLocaleDateString()}</p>
                {pago.referenciaTransaccion && (
                  <p className="font-semibold">Referencia: {pago.referenciaTransaccion}</p>
                )}
              </div>
            </div>
>>>>>>> 23672fd20f631b662f6c2b26b31a77a6288784c6
          </div>
        ))}
      </main>
    </div>
  );
};

export default PagosComponent;
