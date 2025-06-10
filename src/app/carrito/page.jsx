"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import PageLayout from "@/components/layout/PageLayout";
import { useCartStorage } from "@/hooks/useCartStorage";
import { useRouter } from "next/navigation";
import CartLeftPanel from "@/components/carrito/CartLeftPanel";
import CartItemsList from "@/components/carrito/CartItemsList";
import CartSummaryAndPayment from "@/components/carrito/CartSummaryAndPayment";

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
          <CartLeftPanel />

          {/* Panel derecho */}
          <section className="flex-1 p-6 flex flex-col justify-between gap-6">
            <CartItemsList cartItems={cartItems} />
            <CartSummaryAndPayment
              totalConEnvio={totalConEnvio}
              cartItemsLength={cartItems.length}
              handlePagarAhora={handlePagarAhora}
              paymentSuccess={paymentSuccess}
            />
          </section>
        </motion.div>
      </motion.main>
    </PageLayout>
  );
}
