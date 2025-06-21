'use client'
import { useState, useEffect } from 'react';

function HeaderSoloLogo() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlHeader = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY) {
        // Scrolling hacia abajo: ocultar header
        setShowHeader(false);
      } else {
        // Scrolling hacia arriba: mostrar header
        setShowHeader(true);
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
      className={`fixed top-0 w-full z-50 bg-black text-white transition-transform duration-500 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="p-4 flex items-center justify-start">
        <h1 className="font-bold text-3xl hover:text-white transition-colors duration-500">
          BLACK NOISE
        </h1>
      </div>
    </header>
  );
}

export default HeaderSoloLogo;
