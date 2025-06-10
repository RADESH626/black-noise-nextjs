"use client";

import React, { useEffect, useState } from 'react';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import CartItem from './CartItem';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import useRouter
import { getCartByUserId, addDesignToCart, removeDesignFromCart, updateCartItemQuantity, clearUserCart } from "@/app/acciones/CartActions"; // Import CartActions

function CartComponent() {
  const router = useRouter(); // Initialize useRouter
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // Add paymentSuccess state

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
  }, [status, userId]); // Re-fetch cart when session status or userId changes

  const getTotal = () => { // Add getTotal function
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleAddItem = async (designId) => {
    if (!userId) {
      alert("Debes iniciar sesión para agregar ítems al carrito.");
      return;
    }
    setLoading(true); // Use loading for general cart operations
    const { success, message } = await addDesignToCart(userId, designId);
    if (success) {
      await fetchCart(); // Re-fetch cart to update UI
    } else {
      setError({ message: message || "Error al agregar el diseño al carrito." });
    }
    setLoading(false);
  };

  const handleRemoveItem = async (designId) => {
    if (!userId) {
      alert("Debes iniciar sesión para eliminar ítems del carrito.");
      return;
    }
    setLoading(true);
    const { success, message } = await removeDesignFromCart(userId, designId);
    if (success) {
      await fetchCart();
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
    if (quantity < 0) return; // Prevent negative quantities

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

  const handlePagarAhora = () => { // Add handlePagarAhora function
    router.push("/pago");
  };

  const handlePagoExitoso = async () => { // Add handlePagoExitoso function
    setPaymentSuccess(true);
    await handleClearCart();
    setTimeout(() => setPaymentSuccess(false), 3000);
  };

  const totalConEnvio = getTotal() + 50; // Calculate totalConEnvio

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000000] via-[#0A1828] to-[#000000] text-white">
        Cargando carrito...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000000] via-[#0A1828] to-[#000000] text-red-500">
        Error al cargar el carrito: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-black p-6 md:p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">Tu Carrito de Compras</h2>
      {paymentSuccess && (
        <div className="bg-green-500 text-white p-3 rounded-md mb-4 text-center">
          ¡Pago exitoso! Tu carrito ha sido vaciado.
        </div>
      )}
      <div className="space-y-4">
        {cartItems.length === 0 ? (
          <p className="text-gray-400 text-center">Tu carrito está vacío.</p>
        ) : (
          cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          ))
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="mt-8 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center text-white text-lg font-semibold mb-2">
            <span>Subtotal:</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-white text-lg font-semibold mb-4">
            <span>Envío:</span>
            <span>$50.00</span> {/* Assuming fixed shipping cost */}
          </div>
          <div className="flex justify-between items-center text-white text-xl font-bold mb-6">
            <span>Total a Pagar:</span>
            <span>${totalConEnvio.toFixed(2)}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <BotonGeneral onClick={handleClearCart} disabled={loading}>
              Vaciar Carrito
            </BotonGeneral>
            <BotonGeneral onClick={handlePagarAhora} disabled={loading}>
              Pagar Ahora
            </BotonGeneral>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartComponent;
