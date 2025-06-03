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

  return (
    <PageLayout>
      <div className="min-h-screen bg-black text-white font-poppins p-4">
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
        </div>
      </div>
    </PageLayout>
  );
};

export default Pedidos;
