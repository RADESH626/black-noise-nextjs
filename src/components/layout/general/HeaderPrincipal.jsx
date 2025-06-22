'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import BotonIniciarSesion from '@/components/common/botones/BotonIniciarSesion';

export default function HeaderPrincipal() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determinar si el header debe tener fondo blanco
  const shouldHaveBackground = isScrolled || isHovered;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ${
        shouldHaveBackground 
          ? 'bg-white shadow-md' 
          : 'bg-transparent'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            href="/" 
            className={`text-2xl font-bold transition-colors duration-300 ${
              shouldHaveBackground ? 'text-black' : 'text-white'
            }`}
          >
            BLACK NOISE
          </Link>
        </motion.div>

        {/* Botón Iniciar Sesión */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BotonIniciarSesion 
            isDarkMode={!shouldHaveBackground} 
          />
        </motion.div>
      </div>
    </header>
  );
}
