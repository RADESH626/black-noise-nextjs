'use client'
import { motion } from "framer-motion";

function CartItemsList({ cartItems }) {
  return (
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
              ❤️ <span>2 mil</span>
            </div>
            <div className="text-xs">
              <p><strong>nombre:</strong> {item.nombre}</p>
              <p><strong>precio:</strong> ${item.price.toFixed(2)}</p>
              <p><strong>categoría:</strong> camisa</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default CartItemsList;
