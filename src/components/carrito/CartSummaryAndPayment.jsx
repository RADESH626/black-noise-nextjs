'use client'
import { motion } from "framer-motion";

function CartSummaryAndPayment({ totalConEnvio, cartItemsLength, handlePagarAhora, paymentSuccess }) {
  return (
    <motion.aside
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full bg-[#171717] p-6 flex flex-col justify-start rounded-xl shadow-lg"
    >
      <div className="flex items-center justify-between w-full">
        <p className="text-lg text-[#ffffff] font-semibold">Total: ${totalConEnvio}</p>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-[#1F57ACFF] text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:animate-pulse"
          >
            Agregar a Pedido
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={clearCart}
            className="bg-[#1F57ACFF] text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:animate-pulse"
          >
            Vaciar Carrito
          </motion.button>
        </div>
      </div>

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
