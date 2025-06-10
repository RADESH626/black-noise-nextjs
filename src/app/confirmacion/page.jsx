"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStorage } from "@/hooks/useCartStorage";

export default function Pago() {
  const router = useRouter();
  const { cartItems, clearCart, getTotal } = useCartStorage();

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/carrito");
      return;
    }

    const cliente = {
      nombre: "Daniel Santiago",
      correo: "daniel@email.com",
      direccion: "Calle Ficticia 123",
    };

    const pedidoCompleto = {
      cliente,
      productos: cartItems,
      fecha: new Date().toLocaleString(),
      proveedor: "Diseñador encargado",
      metodoPago: "tarjeta",
      total: getTotal(),
    };

    localStorage.setItem("pedidoCompleto", JSON.stringify(pedidoCompleto));
    clearCart();

    const timer = setTimeout(() => {
      router.push("/confirmacion");
      // Limpieza opcional después de mostrar confirmación
      setTimeout(() => {
        localStorage.removeItem("pedidoCompleto");
      }, 1000); // Espera 1 segundo después de redirigir
    }, 3000);

    return () => clearTimeout(timer);
  }, [cartItems, clearCart, router, getTotal]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100 text-black">
      <h1 className="text-3xl font-bold mb-4">¡Pago exitoso!</h1>
      <p className="text-lg">Redirigiendo a la confirmación del pedido...</p>
    </div>
  );
}
