"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStorage } from "@/hooks/useCartStorage";
import OrderSummary from "@/components/pago/OrderSummary";
import PaymentForm from "@/components/pago/PaymentForm";

export default function Pago() {
  const router = useRouter();
  const { cartItems, clearCart, getTotal } = useCartStorage();

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/proceso-pago");
    }
  }, [cartItems, router]);

  const handlePago = ({ nombre, correo, direccion, metodoPago }) => {
    const pedidoCompleto = {
      cliente: { nombre, correo, direccion },
      productos: cartItems,
      fecha: new Date().toLocaleString(),
      proveedor: "Diseñador encargado",
      metodoPago,
      total: getTotal(),
    };

    localStorage.setItem("pedidoCompleto", JSON.stringify(pedidoCompleto));
    clearCart();
    router.push("/confirmacion");
  };

  return (
    <div
      style={{ backgroundColor: "#FDF9F9FF", color: "#000000FF" }}
      className="min-h-screen p-8"
    >
      <OrderSummary cartItems={cartItems} getTotal={getTotal} />
      <PaymentForm handlePago={handlePago} />
    </div>
  );
}
