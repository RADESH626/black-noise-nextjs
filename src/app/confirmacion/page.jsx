"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Confirmacion() {
  const router = useRouter();
  const [pedidoCompleto, setPedidoCompleto] = useState(null);

  useEffect(() => {
    const storedPedido = localStorage.getItem("pedidoCompleto");
    if (storedPedido) {
      setPedidoCompleto(JSON.parse(storedPedido));
      // Clear the stored order after a short delay to allow display
      const clearTimer = setTimeout(() => {
        localStorage.removeItem("pedidoCompleto");
      }, 2000); // Clear after 2 seconds

      // Redirect after a longer delay
      const redirectTimer = setTimeout(() => {
        router.push("/"); // Redirect to home or a thank you page
      }, 5000); // Redirect after 5 seconds

      return () => {
        clearTimeout(clearTimer);
        clearTimeout(redirectTimer);
      };
    } else {
      // If no order found in localStorage, redirect to home or cart
      router.push("/carrito");
    }
  }, [router]);

  if (!pedidoCompleto) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-green-100 text-black">
        <h1 className="text-3xl font-bold mb-4">Cargando confirmación...</h1>
        <p className="text-lg">Si no se carga, redirigiendo al carrito...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 text-black p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">¡Pago exitoso!</h1>
      <p className="text-lg mb-6 text-center">Tu pedido ha sido confirmado.</p>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
        {pedidoCompleto.cliente && (
          <div className="mb-4">
            <p><strong>Cliente:</strong> {pedidoCompleto.cliente.nombre}</p>
            <p><strong>Correo:</strong> {pedidoCompleto.cliente.correo}</p>
            <p><strong>Dirección:</strong> {pedidoCompleto.cliente.direccion}</p>
          </div>
        )}
        <div className="mb-4">
          <p><strong>Fecha:</strong> {pedidoCompleto.fecha}</p>
          <p><strong>Método de Pago:</strong> {pedidoCompleto.metodoPago}</p>
        </div>
        <h3 className="text-lg font-semibold mb-2">Productos:</h3>
        <ul className="list-disc list-inside mb-4">
          {pedidoCompleto.productos && pedidoCompleto.productos.map((item, index) => (
            <li key={index}>{item.name} (x{item.quantity}) - ${item.price.toFixed(2)}</li>
          ))}
        </ul>
        <p className="text-xl font-bold text-right">Total: ${pedidoCompleto.total.toFixed(2)}</p>
      </div>

      <p className="mt-8 text-lg text-center">Redirigiendo en breve...</p>
    </div>
  );
}
