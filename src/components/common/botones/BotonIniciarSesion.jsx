'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BotonIniciarSesion({ 
  children, 
  className = '',
  isDarkMode = true // Por defecto modo oscuro (fondo transparente, letras blancas)
}) {
  return (
    <Link href="/login">
      <motion.button
        className={`border-2 font-bold py-2 px-6 rounded-full transition-all duration-300 ${
          isDarkMode 
            ? 'border-white text-white hover:bg-white hover:text-black' 
            : 'border-black text-black hover:bg-black hover:text-white'
        } ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children || 'Iniciar Sesión'}
      </motion.button>
    </Link>
  );
}
