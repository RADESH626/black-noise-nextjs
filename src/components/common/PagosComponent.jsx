'use client';

import React, { useEffect, useState } from 'react';
import { obtenerPedidosPagadosPorUsuarioId } from '@/app/acciones/PedidoActions'; // Import the new function

const PagosComponent = ({ userId }) => {
  const [paidOrders, setPaidOrders] = useState([]); // State for paid orders
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaidOrders = async () => { // Rename fetch function
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchPaidOrders(); // Call the new fetch function
  }, [userId]);

  if (loading) {
    return <div className="text-center py-4">Cargando historial de compras...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  if (paidOrders.length === 0) {
    return <div className="text-center py-4 text-gray-500">No hay historial de compras registrado.</div>;
  }

  return (
    <div className="p-4 bg-black text-white">
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

          </div>
        ))}
      </main>
    </div>
  );
};

export default PagosComponent;
