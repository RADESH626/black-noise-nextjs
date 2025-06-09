'use client';
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PedidosContent = () => {
  const [pedidoCompleto, setPedidoCompleto] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const datos = localStorage.getItem("pedidoCompleto");
    if (datos) {
      const parsed = JSON.parse(datos);
      setPedidoCompleto(parsed);

      // Suma price * quantity
      const totalPedido = parsed.productos.reduce(
        (acc, p) => acc + (p.price * (p.quantity || 1)), 0
      );
      setTotal(totalPedido + 50); // + envío
    }
  }, []);

  if (!pedidoCompleto) {
    return (
      <div className="min-h-full flex justify-center items-center text-gray-400">
        No hay pedidos aún.
      </div>
    );
  }

  const { cliente, productos, fecha, proveedor, metodoPago } = pedidoCompleto;

  return (
    <div className="bg-black text-white font-poppins p-4">
      <h2 className="text-center text-2xl font-bold mt-4">Tus Pedidos</h2>

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {productos.map((pedido, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="w-full h-56 bg-gray-700 relative">
              <img
                src={pedido.img || "/public/img/Fondos/Fondo 1.jpg"}
                alt={pedido.nombre}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0 m-3">
                <button
                  onClick={() => alert(`Ver detalles del pedido: ${pedido.nombre}`)}
                  className="bg-white text-purple-700 font-semibold py-1 px-4 rounded-md text-sm hover:bg-gray-200 transition duration-150"
                >
                  VER DETALLES
                </button>
              </div>
            </div>
            <div className="p-4 gradient-text-bg flex justify-between items-center text-white">
              <div>
                <p className="font-semibold">nombre: {pedido.nombre}</p>
                <p className="font-semibold">precio: ${pedido.price.toFixed(2)}</p>
                <p className="font-semibold">cantidad: {pedido.quantity}</p>
              </div>
              {/* No "Agregar al carrito" for orders */}
            </div>
          </motion.div>
        ))}
      </main>

      <hr className="border-white my-6" />
      <div className="text-sm bg-[#1f2937] p-4 rounded-md">
        <p className="font-semibold mb-2">DETALLES DEL PEDIDO:</p>
        <p><span className="font-bold">Prenda(s):</span> {productos.length}</p>
        <p><span className="font-bold">Correo:</span> {cliente.correo}</p>
        <p><span className="font-bold">Dirección:</span> {cliente.direccion}</p>
        <p><span className="font-bold">Fecha del pedido:</span> {fecha}</p>
        <p><span className="font-bold">Proveedor a cargo:</span> {proveedor}</p>
        <p><span className="font-bold">Método de pago:</span> {metodoPago}</p>
        <p><span className="font-bold">Total con envío:</span> ${total.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default PedidosContent;
