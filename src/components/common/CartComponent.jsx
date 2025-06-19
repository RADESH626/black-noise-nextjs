"use client";

import React, { useCallback, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import CartItem from './CartItem';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addDesignToCart, removeDesignFromCart, updateCartItemQuantity, clearUserCart } from "@/app/acciones/CartActions";
import { procesarPagoYCrearPedido } from "@/app/acciones/PagoActions";
import { useDialog } from '@/context/DialogContext';
import { useCart } from '@/context/CartContext';
import OrderSummary from "@/components/pago/OrderSummary";
import UserDataForm from "@/components/pago/UserDataForm";
import CardDataModal from "@/components/pago/CardDataModal";
import OrderConfirmationDialogContent from "@/components/pago/OrderConfirmationDialogContent";

function CartComponent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showPopUp } = useDialog();
  const { cartItems, loadingCart, cartError, updateCart, fetchCart } = useCart();
  const userId = session?.user?.id;

  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [cardData, setCardData] = useState(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const dialogRef = useRef(null);

  useEffect(() => {
    if (showPaymentSection) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [showPaymentSection]);

  const getTotal = () => {
    let subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    // Removed: if (userData?.isDelivery) { subtotal += userData.deliveryCost; }
    return subtotal;
  };

  const handleClosePayment = useCallback(() => {
    setShowPaymentSection(false);
    setPaymentError(null);
    setUserData(null);
    setCardData(null);
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

    const originalCartItems = [...cartItems];
    updateCart(updatedCartItems);

    if (addItemDebounceRef.current) {
      clearTimeout(addItemDebounceRef.current);
    }

    addItemDebounceRef.current = setTimeout(async () => {
      const { success, message, data: serverUpdatedCart } = await addDesignToCart(userId, designId);
      if (!success) {
        showPopUp(message || "Error al agregar el diseño al carrito en el servidor.", "error");
        updateCart(originalCartItems);
      }
    }, 1000);
  }, [userId, cartItems, updateCart, showPopUp]);

  const handleRemoveItem = useCallback((designId) => {
    if (!userId) {
      showPopUp("Debes iniciar sesión para eliminar ítems del carrito.", "error");
      return;
    }

    const originalCartItems = [...cartItems];
    const updatedCartItems = cartItems.filter(item => item.id !== designId);
    updateCart(updatedCartItems);

    if (removeItemDebounceRef.current) {
      clearTimeout(removeItemDebounceRef.current);
    }

    removeItemDebounceRef.current = setTimeout(async () => {
      const { success, message, data: serverUpdatedCart } = await removeDesignFromCart(userId, designId);
      if (!success) {
        showPopUp(message || "Error al eliminar el diseño del carrito en el servidor.", "error");
        updateCart(originalCartItems);
      }
    }, 1000);
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

    const originalCartItems = [...cartItems];

    let updatedCartItems;
    if (newQuantity === 0) {
      updatedCartItems = cartItems.filter(item => item.id !== designId);
    } else {
      updatedCartItems = cartItems.map(item =>
        item.id === designId ? { ...item, quantity: newQuantity } : item
      );
    }
    updateCart(updatedCartItems);

    if (updateQuantityDebounceRef.current) {
      clearTimeout(updateQuantityDebounceRef.current);
    }

    updateQuantityDebounceRef.current = setTimeout(async () => {
      const { success, message, data: serverUpdatedCart } = await updateCartItemQuantity(userId, designId, newQuantity);
      if (!success) {
        showPopUp(message || "Error al actualizar la cantidad del diseño en el servidor.", "error");
        updateCart(originalCartItems);
      }
    }, 1000);
  }, [userId, cartItems, updateCart, showPopUp]);

  const handleClearCart = useCallback(() => {
    if (!userId) {
      showPopUp("Debes iniciar sesión para vaciar el carrito.", "error");
      return;
    }

    const originalCartItems = [...cartItems];
    updateCart([]);

    if (clearCartDebounceRef.current) {
      clearTimeout(clearCartDebounceRef.current);
    }

    clearCartDebounceRef.current = setTimeout(async () => {
      const { success, message, data: updatedCart } = await clearUserCart(userId);
      if (!success) {
        showPopUp(message || "Error al vaciar el carrito en el servidor.", "error");
        updateCart(originalCartItems);
      }
    }, 1000);
  }, [userId, cartItems, updateCart, showPopUp]);

  const handleUserDataChange = useCallback((data) => {
    setUserData(data);
  }, []); // Empty dependency array means this function is stable

  const handleCardDataSubmit = (data) => {
    setCardData(data);
    showPopUp("Información de la tarjeta guardada.", "success");
    setIsCardModalOpen(false); // Close the modal after successful submission
  };

  const handleProcessPayment = async () => {
    if (!userData || !userData.nombre || !userData.correo || (userData.isDelivery && !userData.direccion)) {
      setPaymentError("Por favor completa tus datos personales y de entrega.");
      return;
    }

    if (!cardData || !cardData.tarjeta || !cardData.mes || !cardData.anio || !cardData.cvv) {
      setPaymentError("Por favor ingresa los datos de tu tarjeta.");
      return;
    }
    setPaymentError(null);

    const paymentDetails = {
      userId,
      nombre: userData.nombre,
      correo: userData.correo,
      direccion: userData.direccion,
      metodoPago: "tarjeta",
      total: getTotal(),
      tarjeta: cardData.tarjeta,
      mes: cardData.mes,
      anio: cardData.anio,
      cvv: cardData.cvv,
      metodoEntrega: userData.isDelivery ? 'DOMICILIO' : 'RECOGIDA',
      costoEnvio: 0, // Set to 0 as per new requirement
    };

    const { success, message, pedidoId } = await procesarPagoYCrearPedido(cartItems, paymentDetails);

    if (success) {
      updateCart([]);
      setShowPaymentSection(false);
      showPopUp(
        "¡Pedido exitoso! Recibirás un correo de confirmación con los detalles de tu pedido.",
        "success",
        false // Make it disappear automatically
      );
    } else {
      setPaymentError({ message: message || "Error al procesar el pago." });
      console.error("Error al procesar el pago:", message);
    }
  };

  const handleProceedToPayment = (event) => {
    event.preventDefault();
    if (!userId) {
      showPopUp("Debes iniciar sesión para proceder al pago.", "error");
      return;
    }
    if (cartItems.length === 0) {
      showPopUp("Tu carrito está vacío. Agrega diseños antes de proceder al pago.", "error");
      return;
    }
    setShowPaymentSection(true);
  };

  const totalAPagar = getTotal();

  if (loadingCart) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: "#000000", backgroundImage: "linear-gradient(to bottom, #000000, #1f2937, #000000)", color: "#FFFFFF" }}>
        Cargando carrito...
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: "#000000", backgroundImage: "linear-gradient(to bottom, #000000, #1f2937, #000000)", color: "#EF4444" }}>
        Error al cargar el carrito: {cartError.message}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 shadow-lg h-screen justify-between flex flex-col overflow-hidden" style={{ background: 'linear-gradient(to bottom, #000000, #1f2937, #000000)', color: '#FFFFFF' }}>
      
      <h2 className="text-2xl font-bold mb-6" style={{ color: "#FFFFFF" }}>Tu Carrito de Compras</h2>

      {cartError && (
        <div className="p-3 rounded-md mb-4 text-center" style={{ backgroundColor: "#EF4444", color: "#FFFFFF" }}>
          {cartError.message}
        </div>
      )}
      <div className="space-y-4 flex overflow-y-auto flex-col h-full w-full">
        <div className="w-full space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full ">
              <div className="flex flex-col items-center justify-center h-full ">
                <p className="text-center" style={{ color: "#9CA3AF" }}>Tu carrito está vacío.</p>
                <Link href="/catalogo" className="hover:underline" style={{ color: "#3B82F6" }}>
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
        <div className="mt-8 pt-4 border-t" style={{ borderColor: "#FFFFFFFF" }}>
          <div className="flex justify-between items-center text-lg font-semibold mb-2" style={{ color: "#FFFFFF" }}>
            <span>Subtotal:</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xl font-bold mb-6" style={{ color: "#FFFFFF" }}>
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

      {/* Dialog for Payment Section */}
      <dialog ref={dialogRef} className="relative p-8 rounded-lg shadow-lg max-w-2xl w-11/12 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "#FDF9F1", color: "#000000", margin: "auto" }}>
        <button
          onClick={handleClosePayment}
          className="absolute top-4 right-4 text-2xl font-bold"
          style={{ color: "#000000" }}
          aria-label="Cerrar"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "#111010" }}>Confirmar Pedido y Pago</h2>
        
        <UserDataForm onUserDataChange={handleUserDataChange} />

        <div className="p-6 rounded shadow-md w-full mb-6" style={{ backgroundColor: "#F7F1F1" }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: "#111010" }}>Información de Pago</h3>
          <button
            type="button"
            onClick={() => setIsCardModalOpen(true)}
            style={{ backgroundColor: "#154780", color: "#ffffff" }}
            className="w-full font-semibold py-3 rounded hover:bg-blue-700 transition"
          >
            {cardData ? 'Editar Datos de Tarjeta' : 'Ingresar Datos de Tarjeta'}
          </button>
          {cardData && (
            <p className="mt-2 text-sm" style={{ color: "#000000" }}>
              Tarjeta ingresada: **** **** **** {cardData.tarjeta.slice(-4)}
            </p>
          )}
        </div>

        <OrderSummary cartItems={cartItems} getTotal={() => getTotal()} />

        {paymentError && (
          <p className="p-3 rounded-md mb-4 text-center" style={{ backgroundColor: "#EF4444", color: "#FFFFFF" }}>
            {paymentError.message}
          </p>
        )}

        <button
          type="button"
          onClick={handleProcessPayment}
          style={{ backgroundColor: "#154780", color: "#ffffff" }}
          className="w-full font-semibold py-3 rounded hover:bg-blue-700 transition"
        >
          Confirmar Pedido y Pagar
        </button>
      </dialog>

      <CardDataModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        onCardDataSubmit={handleCardDataSubmit}
      />
    </div>
  );
}

export default CartComponent;