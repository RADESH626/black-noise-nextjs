'use client'
import { motion } from "framer-motion";

function CartLeftPanel() {
  return (
    <motion.aside
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-1/4 bg-[#171717] p-6 flex flex-col mt-20"
    >
      {/* contenido menú lateral */}
    </motion.aside>
  );
}

export default CartLeftPanel;
