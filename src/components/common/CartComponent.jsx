"use client";

import React, { useCallback, useRef } from 'react';
import Link from 'next/link';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import CartItem from './CartItem';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import useRouter
import { addDesignToCart, removeDesignFromCart, updateCartItemQuantity, clearUserCart } from "@/app/acciones/CartActions";
import { procesarPagoYCrearPedido } from "@/app/acciones/PagoActions"; // Import the payment action
import { usePopUp } from '@/context/PopUpContext'; // Import usePopUp
import { useCart } from '@/context/CartContext'; // Import useCart
import OrderSummary from "@/components/pago/OrderSummary"; // Import OrderSummary
import PaymentForm from "@/components/pago/PaymentForm"; // Import PaymentForm

function CartComponent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showPopUp } = usePopUp(); // Use the PopUp hook (keep for other popups)
  const { cartItems, loadingCart, cartError, updateCart, fetchCart } = useCart(); // Use cart context
  const userId = session?.user?.id;

  const [showPaymentSection, setShowPaymentSection] = useState(false); // New state for payment section visibility
  const [paymentError, setPaymentError] = useState(null); // New state for payment errors

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleClosePayment = useCallback(() => {
    setShowPaymentSection(false);
    setPaymentError(null); // Clear any payment errors when closing
  }, []);

  const addItemDebounceRef = useRef(null);
  const removeItemDebounceRef = useRef(null);
  const updateQuantityDebounceRef = useRef(null);
  const clearCartDebounceRef = useRef(null);

  const handleAddItem = useCallback((designId, itemToAdd) => {
    if (!userId) {
      showPopUp("Debes iniciar sesión para agregar ítems al carrito.", "error");
      return;
    }

    const existingItem = cartItems.find(item => item.id === designId);
    let updatedCartItems;
    if (existingItem) {
      updatedCartItems = cartItems.map(item =>
        item.id === designId ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCartItems = [...cartItems, { ...itemToAdd, id: designId, quantity: 1 }];
    }

    const originalCartItems = [...cartItems]; // Store current state for rollback
    updateCart(updatedCartItems); // Optimistic UI update

    if (addItemDebounceRef.current) {
      clearTimeout(addItemDebounceRef.current);
    }

    addItemDebounceRef.current = setTimeout(async () => {
      const { success, message, data: serverUpdatedCart } = await addDesignToCart(userId, designId);
      if (!success) {
        showPopUp(message || "Error al agregar el diseño al carrito en el servidor.", "error");
        updateCart(originalCartItems); // Rollback on error
      }
    }, 1000); // Debounce for 1 second
  }, [userId, cartItems, updateCart, showPopUp]);

  const handleRemoveItem = useCallback((designId) => {
    if (!userId) {
      showPopUp("Debes iniciar sesión para eliminar ítems del carrito.", "error");
      return;
    }

    const originalCartItems = [...cartItems]; // Store current state for rollback
    const updatedCartItems = cartItems.filter(item => item.id !== designId);
    updateCart(updatedCartItems); // Optimistic UI update

    if (removeItemDebounceRef.current) {
      clearTimeout(removeItemDebounceRef.current);
    }

    removeItemDebounceRef.current = setTimeout(async () => {
      const { success, message, data: serverUpdatedCart } = await removeDesignFromCart(userId, designId);
      if (!success) {
        showPopUp(message || "Error al eliminar el diseño del carrito en el servidor.", "error");
        updateCart(originalCartItems); // Rollback on error
      }
    }, 1000); // Debounce for 1 second
  }, [userId, cartItems, updateCart, showPopUp]);

  const handleUpdateQuantity = useCallback((designId, quantityInput) => {
    if (!userId) {
      showPopUp("Debes iniciar sesión para actualizar la cantidad del carrito.", "error");
      return;
    }

    const newQuantity = parseInt(quantityInput);

    if (isNaN(newQuantity) || newQuantity < 0) {
      return;
    }

    const originalCartItems = [...cartItems]; // Store current state for rollback

    // Optimistic UI update: Update the cart state immediately
    let updatedCartItems;
    if (newQuantity === 0) {
      updatedCartItems = cartItems.filter(item => item.id !== designId);
    } else {
      updatedCartItems = cartItems.map(item =>
        item.id === designId ? { ...item, quantity: newQuantity } : item
      );
    }
    updateCart(updatedCartItems);

    // Clear any existing debounce timeout
    if (updateQuantityDebounceRef.current) {
      clearTimeout(updateQuantityDebounceRef.current);
    }

    // Set a new debounce timeout to call the server action
    updateQuantityDebounceRef.current = setTimeout(async () => {
      const { success, message, data: serverUpdatedCart } = await updateCartItemQuantity(userId, designId, newQuantity);
      if (!success) {
        showPopUp(message || "Error al actualizar la cantidad del diseño en el servidor.", "error");
        updateCart(originalCartItems); // Revert UI if server update fails
      }
    }, 1000); // Debounce for 1 second
  }, [userId, cartItems, updateCart, showPopUp]);

  const handleClearCart = useCallback(() => {
    if (!userId) {
      showPopUp("Debes iniciar sesión para vaciar el carrito.", "error");
      return;
    }

    const originalCartItems = [...cartItems]; // Store current state for rollback
    updateCart([]); // Optimistic UI update: clear cart immediately

    if (clearCartDebounceRef.current) {
      clearTimeout(clearCartDebounceRef.current);
    }

    clearCartDebounceRef.current = setTimeout(async () => {
      const { success, message, data: updatedCart } = await clearUserCart(userId);
      if (!success) {
        showPopUp(message || "Error al vaciar el carrito en el servidor.", "error");
        updateCart(originalCartItems); // Rollback on error
      }
    }, 1000); // Debounce for 1 second
  }, [userId, cartItems, updateCart, showPopUp]);

  const handleProcessPayment = async ({ nombre, correo, direccion, metodoPago, cardNumber, expiryDate, cvv }) => {
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
      updateCart([]); // Clear local cart state via context
      setShowPaymentSection(false); // Close the payment section on successful payment
      router.push(`/confirmacion?pedidoId=${pedidoId}`); // Pass pedidoId to confirmation page
    } else {
      setPaymentError({ message: message || "Error al procesar el pago." });
      console.error("Error al procesar el pago:", message);
    }
  };

  const handleProceedToPayment = () => {
    if (!userId) {
      showPopUp("Debes iniciar sesión para proceder al pago.", "error");
      return;
    }
    if (cartItems.length === 0) {
      showPopUp("Tu carrito está vacío. Agrega diseños antes de proceder al pago.", "error");
      return;
    }
    setShowPaymentSection(true); // Show payment section
  };

  const totalAPagar = getTotal();

  if (loadingCart) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#000000] via-[#0A1828] to-[#000000] text-white">
        Cargando carrito...
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#000000] via-[#0A1828] to-[#000000] text-red-500">
        Error al cargar el carrito: {cartError.message}
      </div>
    );
  }

  if (showPaymentSection) {
    return (
      <div
        style={{ backgroundColor: "#FDF9F9FF", color: "#000000FF" }}
        className="min-h-screen p-8 relative"
      >
        <button
          onClick={handleClosePayment}
          className="absolute top-4 right-4 text-black text-2xl font-bold"
          aria-label="Cerrar"
        >
          &times;
        </button>
        <OrderSummary cartItems={cartItems} getTotal={getTotal} />
        {paymentError && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4 text-center">
            {paymentError.message}
          </div>
        )}
        <PaymentForm handlePago={handleProcessPayment} />
      </div>
    );
  }

  return (
    <div className="bg-black p-6 md:p-8 shadow-lg h-screen justify-between flex flex-col overflow-hidden">
      <h2 className="text-2xl font-bold mb-6 text-white">Tu Carrito de Compras</h2>

      {cartError && (
        <div className="bg-red-500 text-white p-3 rounded-md mb-4 text-center">
          {cartError.message}
        </div>
      )}
      <div className="space-y-4 justify-center items-center flex overflow-y-auto flex-col h-full ">
        <div className="w-full max-w-3xl mx-auto space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full ">
              <div className="flex flex-col items-center justify-center h-full ">
                <p className="text-gray-400 text-center ">Tu carrito está vacío.</p>
                <Link href="/catalogo" className="text-blue-500 hover:underline">
                  Volver a la tienda
                </Link>
              </div>
            </div>
          ) : (
            cartItems.map((item, index) => {
              const imageUrl = item.imageData && item.imageMimeType
                ? `data:${item.imageMimeType};base64,${item.imageData}`
                : null;
              return (
                <CartItem
                  key={item.id ? String(item.id) : `${item.name || 'unknown'}-${index}`}
                  item={{ ...item, image: imageUrl }}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                />
              );
            })
          )}
        </div>
      </div>

      {cartItems.length > 0 && (
        <div className="mt-8 pt-4 border-t border-gray-700 ">
          <div className="flex justify-between items-center text-white text-lg font-semibold mb-2">
            <span>Subtotal:</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-white text-xl font-bold mb-6">
            <span>Total a Pagar:</span>
            <span>${totalAPagar.toFixed(2)}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <BotonGeneral onClick={handleClearCart} disabled={loadingCart}>
              Vaciar Carrito
            </BotonGeneral>
            <BotonGeneral onClick={handleProceedToPayment} disabled={loadingCart}>
              Proceder al Pago
            </BotonGeneral>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartComponent;
