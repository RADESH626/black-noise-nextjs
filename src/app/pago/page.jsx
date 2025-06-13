"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrderSummary from "@/components/pago/OrderSummary";
import PaymentForm from "@/components/pago/PaymentForm";
import { getCartByUserId } from "@/app/acciones/CartActions"; // Import CartActions
import { procesarPagoYCrearPedido } from "@/app/acciones/PagoActions"; // Import procesarPagoYCrearPedido
import { useSession } from "next-auth/react"; // Import useSession

export default function Pago() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    if (status === 'authenticated' && userId) {
      setLoading(true);
      setError(null);
      const { cart, error: fetchError } = await getCartByUserId(userId);
      if (fetchError) {
        setError({ message: fetchError });
        setCartItems([]);
      } else {
        setCartItems(cart?.items || []);
      }
      setLoading(false);
    } else if (status === 'unauthenticated') {
      setLoading(false);
      setCartItems([]); // Clear cart if user is unauthenticated
    }
  };

  useEffect(() => {
    fetchCart();
  }, [status, userId]);

  useEffect(() => {
    if (!loading && cartItems.length === 0) {
      router.push("/proceso-pago");
    }
  }, [cartItems, router, loading]);

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };


  const handlePago = async ({ nombre, correo, direccion, metodoPago, cardNumber, expiryDate, cvv }) => {
    const paymentDetails = {
      userId,
      nombre,
      correo,
      direccion,
      metodoPago,
      total: getTotal(),
      cardNumber,
      expiryDate,
      cvv,
    };

    const { success, message, pedidoId } = await procesarPagoYCrearPedido(cartItems, paymentDetails);

    if (success) {
      setCartItems([]); // Clear local cart state
      router.push(`/confirmacion?pedidoId=${pedidoId}`); // Pass pedidoId to confirmation page
    } else {
      setError({ message: message || "Error al procesar el pago." });
      console.error("Error al procesar el pago:", message);
    }
  };

  if (loading) {
    return <div className="text-center text-black">Cargando carrito...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error al cargar el carrito: {error.message}</div>;
  }

  if (cartItems.length === 0) {
    return <div className="text-center text-black">El carrito está vacío. Redirigiendo...</div>;
  }

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
