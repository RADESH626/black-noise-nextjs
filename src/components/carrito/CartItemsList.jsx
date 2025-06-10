'use client'
import { motion } from "framer-motion";

function CartItemsList({ cartItems, updateQuantity, removeItem }) {
  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {cartItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="w-full h-56 bg-gray-700 relative">
            <img
              src={item.image || item.imagen}
              alt={item.name || item.nombre}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">nombre: {item.name || item.nombre}</p>
              <p className="font-semibold">precio: ${item.price.toFixed(2)}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                className="w-16 p-1 text-center bg-gray-700 rounded-md text-white"
              />
              <button
                onClick={() => removeItem(item.id)}
                className="bg-red-700 text-white font-semibold py-1 px-3 rounded-md text-sm hover:bg-red-800 transition duration-150"
              >
                Eliminar
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default CartItemsList;
