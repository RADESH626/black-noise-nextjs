"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProcesoPago() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the cart page as payment processing is now handled there
    router.replace("/carrito");
  }, [router]);

  return (
    <div style={{ backgroundColor: "#FDF9F9FF" }} className="flex flex-col items-center justify-center p-8 min-h-screen">
      <h1 style={{ color: "#111010FF" }} className="text-3xl font-bold mb-6">Redirigiendo al Carrito...</h1>
      <p style={{ color: "#000000FF" }}>El proceso de pago se ha movido al carrito de compras.</p>
    </div>
  );
}
