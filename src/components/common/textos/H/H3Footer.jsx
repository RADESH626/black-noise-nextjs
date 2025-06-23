import { motion } from 'framer-motion';

export default function H3Footer({ children }) {
  return (
    <motion.h3 
      className="text-xl font-bold text-white uppercase mb-4 tracking-wider"
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.h3>
  );
}