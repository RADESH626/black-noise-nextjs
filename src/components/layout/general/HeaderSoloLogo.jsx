"use client";

import React, { useState, useEffect } from 'react';

function HeaderSoloLogo() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Detectar scroll para ocultar/mostrar header
  const controlHeader = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY) {
        setShowHeader(false); // Ocultar si baja
      } else {
        setShowHeader(true); // Mostrar si sube
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlHeader);
      return () => {
        window.removeEventListener('scroll', controlHeader);
      };
    }
  }, [lastScrollY]);

  return (
    <header
      className={`flex flex-row justify-between items-center px-10 py-4 top-0 fixed w-full h-16 z-50 transition-transform duration-500 ${
        showHeader ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ backgroundColor: '#000000FF' }} // Igual que HeaderPrincipal
    >
      <h1
        className='font-bold text-3xl hover:text-white transition-colors duration-500'
        style={{ color: '#FFFFFFFF' }} // Blanco puro
      >
        BLACK NOISE
      </h1>
    </header>
  );
}

export default HeaderSoloLogo;