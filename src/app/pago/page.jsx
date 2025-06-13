"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrderSummary from "@/components/pago/OrderSummary";
import PaymentForm from "@/components/pago/PaymentForm";
import { getCartByUserId, clearUserCart } from "@/app/acciones/CartActions"; // Import CartActions
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

  const handleClearCart = async () => {
    if (!userId) {
      console.warn("User not authenticated. Cannot clear server cart.");
      setCartItems([]); // Clear local state anyway
      return;
    }
    const { success, message } = await clearUserCart(userId);
    if (success) {
      setCartItems([]);
    } else {
      console.error("Failed to clear server cart:", message);
      setError({ message: message || "Error al vaciar el carrito." });
    }
  };

  const handlePago = async ({ nombre, correo, direccion, metodoPago }) => {
    const pedidoCompleto = {
      cliente: { nombre, correo, direccion },
      productos: cartItems,
      fecha: new Date().toLocaleString(),
      proveedor: "Diseñador encargado",
      metodoPago,
      total: getTotal(),
    };

    localStorage.setItem("pedidoCompleto", JSON.stringify(pedidoCompleto));
    await handleClearCart(); // Use the new clear cart function
    router.push("/confirmacion");
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
