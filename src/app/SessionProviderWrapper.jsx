"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from '@/context/CartContext'; // Import CartProvider
import { DialogProvider } from '@/context/DialogContext'; // Import DialogProvider

export default function SessionProviderWrapper({ children }) {
  return (
    <SessionProvider>
      <DialogProvider> {/* Wrap with DialogProvider */}
        <CartProvider> {/* Wrap with CartProvider */}
          {children}
        </CartProvider>
      </DialogProvider>
    </SessionProvider>
  );
}
