"use client";

import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { useRouter } from "next/navigation";
import CartLeftPanel from "@/components/carrito/CartLeftPanel";
import CartItemsList from "@/components/carrito/CartItemsList";
import CartSummaryAndPayment from "@/components/carrito/CartSummaryAndPayment";
import { useSession } from "next-auth/react"; // Import useSession
import { getCartByUserId, removeDesignFromCart, updateCartItemQuantity, clearUserCart } from "@/app/acciones/CartActions"; // Import CartActions

export default function Carrito() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleRemoveItem = async (designId) => {
    if (!userId) {
      alert("Debes iniciar sesión para eliminar ítems del carrito.");
      return;
    }
    setLoading(true); // Use loading for cart operations
    const { success, message } = await removeDesignFromCart(userId, designId);
    if (success) {
      await fetchCart(); // Re-fetch cart to update UI
    } else {
      setError({ message: message || "Error al eliminar el diseño del carrito." });
    }
    setLoading(false);
  };

  const handleUpdateQuantity = async (designId, quantity) => {
    if (!userId) {
      alert("Debes iniciar sesión para actualizar la cantidad del carrito.");
      return;
    }
    if (quantity < 0) return;

    setLoading(true);
    const { success, message } = await updateCartItemQuantity(userId, designId, quantity);
    if (success) {
      await fetchCart();
    } else {
      setError({ message: message || "Error al actualizar la cantidad del diseño." });
    }
    setLoading(false);
  };

  const handleClearCart = async () => {
    if (!userId) {
      alert("Debes iniciar sesión para vaciar el carrito.");
      return;
    }
    setLoading(true);
    const { success, message } = await clearUserCart(userId);
    if (success) {
      await fetchCart();
    } else {
      setError({ message: message || "Error al vaciar el carrito." });
    }
    setLoading(false);
  };

  // Datos ficticios usuario, cambia según cómo tengas el usuario
  const nombreUsuario = "Daniel Santiago";
  const correoUsuario = "daniel@email.com";

  const totalConEnvio = getTotal() + 50;

  const handlePagarAhora = () => {
    router.push("/pago");
  };

  const handlePagoExitoso = async () => { // Make async to await clearCart
    setPaymentSuccess(true);
    await handleClearCart(); // Use the new clear cart function

    setTimeout(() => setPaymentSuccess(false), 3000);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000000] via-[#0A1828] to-[#000000] text-white">
          Cargando carrito...
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000000] via-[#0A1828] to-[#000000] text-red-500">
          Error al cargar el carrito: {error.message}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex justify-center p-5 bg-gradient-to-br from-[#000000] via-[#0A1828] to-[#000000] font-poppins text-white"
      >
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl w-full bg-[#111111] rounded-2xl shadow-lg overflow-hidden text-white flex"
        >
          <CartLeftPanel />

          {/* Panel derecho */}
          <section className="flex-1 p-6 flex flex-col justify-between gap-6">
            <CartItemsList
              cartItems={cartItems}
              updateQuantity={handleUpdateQuantity}
              removeItem={handleRemoveItem}
            />
            <CartSummaryAndPayment
              totalConEnvio={totalConEnvio}
              cartItemsLength={cartItems.length}
              handlePagarAhora={handlePagarAhora}
              paymentSuccess={paymentSuccess}
              handleClearCart={handleClearCart} // Pass clearCart function
            />
          </section>
        </motion.div>
      </motion.main>
    </PageLayout>
  );
}
