"use client";
import React, { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { motion } from "framer-motion";

const Pedidos = () => {
  const [pedidoCompleto, setPedidoCompleto] = useState(null);

  useEffect(() => {
    const datos = localStorage.getItem("pedidoCompleto");
    if (datos) {
      setPedidoCompleto(JSON.parse(datos));
    }
  }, []);

  if (!pedidoCompleto) {
    return (
      <PageLayout>
        <div className="min-h-screen flex justify-center items-center text-white">
          No hay pedidos aún.
        </div>
      </PageLayout>
    );
  }

  const { cliente, productos, fecha, proveedor } = pedidoCompleto;

  return (
    <PageLayout>
      <div className="min-h-screen bg-black text-white font-poppins p-4">
        <h2 className="text-center text-2xl font-bold mt-4">Tus Pedidos</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {productos.map((pedido, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white text-black p-4 rounded-xl"
            >
              <h4 className="font-semibold text-lg">{pedido.nombre}</h4>
              <p className="text-sm">Precio: ${pedido.price.toFixed(2)}</p>
              <p className="text-sm">Categoría: camisa</p>
              <p className="text-sm">❤️ 2mil</p>
            </motion.div>
          ))}
        </div>

        {/* Detalles del pedido */}
        <hr className="border-white my-6" />
        <div className="text-sm bg-[#1f2937] p-4 rounded-md">
          <p className="font-semibold mb-2">DETALLES DEL PEDIDO:</p>
          <p><span className="font-bold">Prenda(s):</span> {productos.length}</p>
          <p><span className="font-bold">Correo:</span> {cliente.correo}</p>
          <p><span className="font-bold">Dirección:</span> {cliente.direccion}</p>
          <p><span className="font-bold">Fecha del pedido:</span> {fecha}</p>
          <p><span className="font-bold">Proveedor a cargo:</span> {proveedor}</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Pedidos;
