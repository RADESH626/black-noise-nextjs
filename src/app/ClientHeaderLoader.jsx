'use client';
import { useEffect, useState } from 'react';
import HeaderPrincipal from '@/components/layout/general/HeaderPrincipal';

export default function ClientHeaderLoader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Lógica para determinar cuándo mostrar el header
    setIsVisible(true);
  }, []);

  return isVisible ? <HeaderPrincipal /> : null;
}