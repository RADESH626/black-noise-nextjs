'use client'
import { motion } from "framer-motion";

function CartSummaryAndPayment({ totalConEnvio, cartItemsLength, handlePagarAhora, paymentSuccess }) {
  return (
    <motion.aside
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-1/2 bg-[#171717] p-6 flex flex-col justify-start mt-20 rounded-xl shadow-lg"
    >
      <div className="flex flex-col text-white mb-6">
        <h2 className="text-xl font-bold text-center mb-2">TU PEDIDO</h2>
        <p className="text-sm text-[#9CA3AF] text-center mb-1">
          Cantidad de productos: {cartItemsLength}
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
  );
}

export default CartSummaryAndPayment;
