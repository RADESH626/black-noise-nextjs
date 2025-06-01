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
      <div className="min-h-screen bg-black text-[#ffffff] font-poppins p-4"
       style={{ background: 'linear-gradient(to bottom, #070707FF, #0A1828, #000000FF)' }}>
        <div className="flex justify-center mt-6 gap-4">
          <button className="bg-[#000000] text-[#ffffff] border-b-2 border-[#ffffff] px-4 py-1">
            DISEÑOS
          </button>
          <button className="bg-[#000000] text-[#ffffff] border-b-2 border-[#ffffff] px-4 py-1">
            PEDIDOS
          </button>
          <button className="bg-[#1F57ACFF] text-[#ffffff] px-4 py-1 rounded-full">
            Historial
          </button>
        </div>

        {/* Tarjetas de pedidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-6">
          {pedidos.map((pedido, index) => (
            <div
              key={index}
              className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#ffffff] via-[#7a7e7b] to-[#dae0e9] p-1"
            >
              <div className="bg-[#1f2937] rounded-2xl p-2 flex flex-col h-full">
                <div className="bg-[#27272a] h-40 rounded-md flex items-center justify-center">
                  <img
                    src={pedido.imagen}
                    alt={pedido.nombre}
                    className="h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-[#000000] rounded-full"></div>
                    <span>❤ {pedido.likes}</span>
                  </div>
                </div>
                <div className="text-xs mt-2">
                  <p><span className="font-semibold">nombre:</span> {pedido.nombre}</p>
                  <p><span className="font-semibold">precio:</span> {pedido.precio}</p>
                  <p><span className="font-semibold">categoría:</span> {pedido.categoria}</p>
                </div>
                <button className="mt-auto bg-gradient-to-r from-[#1F57ACFF] to-[#1F57ACFF] text-[#ffffff] rounded-md py-1 mt-3">
                  Info
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detalles del pedido */}
        <hr className="border-[#ffffff] my-6" />
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
