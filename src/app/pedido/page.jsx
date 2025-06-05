<<<<<<< HEAD
"use client";

import React from "react";
import PageLayout from '@/components/layout/PageLayout';

const Pedidos = () => {
  const pedidos = [
    {
      imagen: "/img/Camisas/Camisa 1.jpg",
      nombre: "camisa azul",
      precio: "20.000",
      categoria: "camisa",
      likes: "2mil",
    },
    {
      imagen: "/img/Camisas/Camisa 2.jpg",
      nombre: "camisa azul",
      precio: "20.000",
      categoria: "camisa",
      likes: "2mil",
    },
    {
      imagen: "/img/Camisas/Camisa 3.jpg",
      nombre: "camisa azul",
      precio: "20.000",
      categoria: "camisa",
      likes: "2mil",
    },
  ];
=======
'use client';
import React, { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { motion } from "framer-motion";

const Pedidos = () => {
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
      <PageLayout>
        <div className="min-h-screen flex justify-center items-center text-white">
          No hay pedidos aún.
        </div>
      </PageLayout>
    );
  }

  const { cliente, productos, fecha, proveedor, metodoPago } = pedidoCompleto;
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d

  return (
    <PageLayout>
      <div className="min-h-screen bg-black text-white font-poppins p-4">
<<<<<<< HEAD
        {/* Tabs */}
        <div className="flex justify-center mt-6 gap-4">
          <button className="bg-black text-white border-b-2 border-white px-4 py-1">
            DISEÑOS
          </button>
          <button className="bg-black text-white border-b-2 border-white px-4 py-1">
            PEDIDOS
          </button>
          <button className="bg-pink-500 text-white px-4 py-1 rounded-full">
            Historial
          </button>
        </div>

        {/* Tarjetas de pedidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-6">
          {pedidos.map((pedido, index) => (
            <div
              key={index}
              className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#2e1065] via-[#9333ea] to-[#a855f7] p-1"
            >
              <div className="bg-gray-900 rounded-2xl p-2 flex flex-col h-full">
                <div className="bg-gray-800 h-40 rounded-md flex items-center justify-center">
                  <img
                    src={pedido.imagen}
                    alt={pedido.nombre}
                    className="h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-black rounded-full"></div>
                    <span>❤ {pedido.likes}</span>
                  </div>
                </div>
                <div className="text-xs mt-2">
                  <p><span className="font-semibold">nombre:</span> {pedido.nombre}</p>
                  <p><span className="font-semibold">precio:</span> {pedido.precio}</p>
                  <p><span className="font-semibold">categoría:</span> {pedido.categoria}</p>
                </div>
                <button className="mt-auto bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md py-1 mt-3">
                  Info
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detalles del pedido */}
        <hr className="border-white my-6" />
        <div className="text-sm">
          <p className="font-semibold">DETALLES DEL PEDIDO:</p>
          <p>prenda:</p>
          <p>correo:</p>
          <p>dirección:</p>
          <p>fecha del pedido:</p>
          <p>proveedor a cargo:</p>
=======
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
              {pedido.img && (
                <img
                  src={pedido.img}
                  alt={pedido.nombre}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
              )}

              <h4 className="font-semibold text-lg">{pedido.nombre}</h4>
              <p className="text-sm">Precio: ${pedido.price.toFixed(2)}</p>
              <p className="text-sm">Cantidad: {pedido.quantity}</p>
              <p className="text-sm">Categoría: camisa</p>
              <p className="text-sm">❤️ 2mil</p>
            </motion.div>
          ))}
        </div>

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
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
        </div>
      </div>
    </PageLayout>
  );
};

export default Pedidos;
