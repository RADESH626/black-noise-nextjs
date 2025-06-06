"use client";

<<<<<<< HEAD
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Carrito() {
  const { cartItems, getTotal } = useCart();

  return (
    <PageLayout>
      <main className="min-h-screen flex justify-center p-5 bg-gradient-to-br from-black via-[#C255AA] to-black font-poppins text-white">
        <div className="max-w-6xl w-full bg-[#111] rounded-2xl shadow-lg overflow-hidden text-white flex">
          
          {/* Panel izquierdo - Menú lateral */}
          <aside className="w-1/4 bg-[#171717] p-6 flex flex-col mt-20">
            {/* Header de usuario */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-700 mb-4 border-2 border-pink-500"></div>
              <h2 className="text-xl font-bold text-white">NOMBRE DEL USUARIO</h2>
              <p className="text-xs text-gray-400">INFORMACIÓN USUARIO:</p>
              <p className="text-xs text-gray-400">CORREO</p>
              <p className="text-xs text-gray-400">NÚMERO DE LIKES</p>
              <p className="text-xs text-gray-400 mb-3">BIOGRAFÍA</p>

              <button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-105 transition-all duration-300 text-white px-4 py-1.5 rounded-full text-sm shadow-lg">
                EDITAR PERFIL
              </button>
            </div>

            {/* Menú de navegación */}
            <div className="flex justify-between mt-4 text-sm">
              <Link href="/perfil" className="px-3 py-1 rounded bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors">DISEÑOS</Link>
              <Link href="/pedido" className="px-3 py-1 rounded bg-pink-600 hover:bg-pink-500 transition-colors">PEDIDOS</Link>
              <Link href="/historial" className="px-3 py-1 rounded bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors">Historial</Link>
            </div>
          </aside>

          {/* Panel derecho - Contenido principal */}
          <section className="flex-1 p-6 flex flex-row gap-6">
            
            {/* Columna izquierda - tarjetas productos */}
            <div className="w-1/2 flex flex-col gap-4">
              {cartItems.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-[#1a1a1a] to-[#2b2b2b] p-4 rounded-xl flex gap-4 items-start shadow-lg">
                  <div className="w-12 h-12 bg-black rounded-full border-2 border-purple-500"></div>
                  <div className="flex-1">
                    <button className="text-xs mb-2 px-2 py-1 bg-[#2a2a2a] rounded-full">EDITAR</button>
                    <div className="text-sm text-pink-400 flex items-center gap-1 mb-2">
=======
import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { useCartStorage } from "@/hooks/useCartStorage";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Carrito() {
  const { cartItems, getTotal, clearCart } = useCartStorage();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const router = useRouter();

  // Datos ficticios usuario, cambia según cómo tengas el usuario
  const nombreUsuario = "Daniel Santiago";
  const correoUsuario = "daniel@email.com";

  const totalConEnvio = getTotal() + 50;

  const handlePagarAhora = () => {
    router.push("/pago");
  };

  const handlePagoExitoso = () => {
    setPaymentSuccess(true);
    clearCart();

    setTimeout(() => setPaymentSuccess(false), 3000);
  };

  return (
    <PageLayout>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex justify-center p-5 bg-gradient-to-br from-[#000000] via-[#0A1828] to-[#000000] font-poppins text-white"
      >
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl w-full bg-[#111111] rounded-2xl shadow-lg overflow-hidden text-white flex"
        >
          {/* Panel izquierdo */}
          <motion.aside
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-1/4 bg-[#171717] p-6 flex flex-col mt-20"
          >
            {/* contenido menú lateral */}
          </motion.aside>

          {/* Panel derecho */}
          <section className="flex-1 p-6 flex flex-row gap-6">
            {/* Lista productos */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-1/2 flex flex-col gap-4"
            >
              {cartItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-[#1a1a1a] to-[#2b2b2b] p-4 rounded-xl flex gap-4 items-start shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-[#000000] rounded-full border-2 border-[#1F57ACFF]"></div>
                  <div className="flex-1">
                    <button className="text-xs mb-2 px-2 py-1 bg-[#2a2a2a] rounded-full hover:bg-[#1F57ACFF] hover:text-white transition-colors duration-300">EDITAR</button>
                    <div className="text-sm text-[#1F57ACFF] flex items-center gap-1 mb-2">
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
                      ❤️ <span>2 mil</span>
                    </div>
                    <div className="text-xs">
                      <p><strong>nombre:</strong> {item.nombre}</p>
                      <p><strong>precio:</strong> ${item.price.toFixed(2)}</p>
                      <p><strong>categoría:</strong> camisa</p>
                    </div>
                  </div>
<<<<<<< HEAD
                </div>
              ))}
            </div>

            {/* Columna derecha - resumen y botón comprar */}
            <aside className="w-1/2 bg-[#171717] p-6 flex flex-col justify-start mt-20 rounded-xl shadow-lg">
              {/* Título y resumen de la compra */}
              <div className="flex flex-col text-white mb-6">
                <h2 className="text-xl font-bold text-center mb-2">TU PEDIDO</h2>
                <p className="text-sm text-gray-400 text-center mb-1">
                  Cantidad de productos: {cartItems.length}
                </p>
                <p className="text-sm text-gray-400 text-center mb-1">Costo de envío: $50</p>
                <p className="text-lg text-pink-400 text-center font-semibold mt-2">
                  Total: ${getTotal() + 50}
                </p>
              </div>

              {/* Botón de pagar */}
              <button
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-105 transition-all duration-300 text-white font-semibold py-2 rounded-full shadow-lg mb-4"
              >
                PAGAR AHORA
              </button>

              {/* Tarjetas de productos en el carrito */}
              <div className="mt-4 space-y-3">
                {cartItems.map((item, index) => (
                  <div key={index} className="bg-[#1e1e1e] p-3 rounded-lg flex items-center justify-between shadow-sm">
                    <div className="text-sm text-white">{item.nombre}</div>
                    <div className="text-pink-400 font-semibold">${item.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </aside>
          </section>
        </div>
      </main>
=======
                </motion.div>
              ))}
            </motion.div>

            {/* Resumen y pago */}
            <motion.aside
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-1/2 bg-[#171717] p-6 flex flex-col justify-start mt-20 rounded-xl shadow-lg"
            >
              <div className="flex flex-col text-white mb-6">
                <h2 className="text-xl font-bold text-center mb-2">TU PEDIDO</h2>
                <p className="text-sm text-[#9CA3AF] text-center mb-1">
                  Cantidad de productos: {cartItems.length}
                </p>
                <p className="text-sm text-[#9CA3AF] text-center mb-1">Costo de envío: $50</p>
                <p className="text-lg text-[#ffffff] text-center font-semibold mt-2">
                  Total: ${totalConEnvio}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={handlePagarAhora}
                className="bg-gradient-to-r from-[#1F57ACFF] to-[#1F57ACFF] text-white font-semibold py-2 rounded-full shadow-lg mb-4 hover:animate-pulse"
              >
                PAGAR AHORA
              </motion.button>

              {paymentSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-green-400 text-center font-semibold mt-4"
                >
                  Pago realizado con éxito 🎉
                </motion.div>
              )}
            </motion.aside>
          </section>
        </motion.div>
      </motion.main>
>>>>>>> e32d185aa7ca43c5c2af446b5ff65a84e8a01a7d
    </PageLayout>
  );
}
