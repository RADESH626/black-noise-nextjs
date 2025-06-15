"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from '@/context/CartContext'; // Import CartProvider
import { PopUpProvider } from '@/context/PopUpContext'; // Import PopUpProvider

export default function SessionProviderWrapper({ children }) {
  return (
    <SessionProvider>
      <PopUpProvider> {/* Wrap with PopUpProvider */}
        <CartProvider> {/* Wrap with CartProvider */}
          {children}
        </CartProvider>
      </PopUpProvider>
    </SessionProvider>
  );
}
