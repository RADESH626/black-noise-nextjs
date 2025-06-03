import React, { useState } from 'react';
import NewOrderModal from '../../components/common/modales/NewOrderModal';

function PedidosComponent({ orders }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewOrder = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <button
          onClick={handleNewOrder}
          className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center 
                     text-white text-2xl font-bold shadow-lg hover:bg-purple-700 
                     transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          aria-label="Crear nuevo pedido"
        >
          <img src="/icons/icono +.svg" alt="Add" className="w-6 h-6" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> 
        {orders.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">
            No tienes pedidos realizados aún.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 gradient-text-bg">
                <p className="font-semibold">ID Pedido: {order._id}</p>
                <p className="font-semibold">Fecha: {new Date(order.fechaPedido).toLocaleDateString()}</p>
                <p className="font-semibold">Estado: {order.estado}</p>
                <p className="font-semibold">Total: ${order.total}</p>
                {/* Detalles del pedido */}
                <div className="mt-2 text-gray-400">
                  <h4 className="font-medium">Detalles:</h4>
                  {order.detallesPedido && order.detallesPedido.length > 0 ? (
                    order.detallesPedido.map((detail, index) => (
                      <p key={index} className="text-sm ml-2">
                        - {detail}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm ml-2">No hay detalles de productos disponibles.</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <NewOrderModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export default PedidosComponent;
