"use client";

import React, { useEffect, useState } from 'react';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import CartItem from './CartItem';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import useRouter
import { getCartByUserId, addDesignToCart, removeDesignFromCart, updateCartItemQuantity, clearUserCart } from "@/app/acciones/CartActions";
import { procesarPagoYCrearPedido } from "@/app/acciones/PagoActions"; // Import the payment action
import { usePopUp } from '@/context/PopUpContext'; // Import usePopUp

function CartComponent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showPopUp, hidePopUp } = usePopUp(); // Use the PopUp hook
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
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [status, userId]);

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleAddItem = async (designId) => {
    if (!userId) {
      alert("Debes iniciar sesión para agregar ítems al carrito.");
      return;
    }
    setLoading(true);
    const { success, message } = await addDesignToCart(userId, designId);
    if (success) {
      await fetchCart();
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

  const handleUpdateQuantity = async (designId, quantityInput) => {
    if (!userId) {
      alert("Debes iniciar sesión para actualizar la cantidad del carrito.");
      return;
    }

    const newQuantity = parseInt(quantityInput);

    // If the input is empty or results in NaN, treat it as 0 or prevent update
    if (isNaN(newQuantity) || newQuantity < 0) {
      // Optionally, you could set the quantity to 0 or show an error
      // For now, we'll just return if it's invalid to prevent the API call with NaN
      return;
    }

    setLoading(true);
    const { success, message } = await updateCartItemQuantity(userId, designId, newQuantity);
    if (success) {
      setCartItems(prevItems => {
        if (newQuantity === 0) {
          // Remove item if quantity is 0
          return prevItems.filter(item => item.id !== designId);
        } else {
          // Update quantity for the specific item
          return prevItems.map(item =>
            item.id === designId ? { ...item, quantity: newQuantity } : item
          );
        }
      });
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

  const handleProceedToPayment = async () => {
    if (!userId) {
      alert("Debes iniciar sesión para proceder al pago.");
      return;
    }
    if (cartItems.length === 0) {
      alert("Tu carrito está vacío. Agrega diseños antes de proceder al pago.");
      return;
    }

    // Redirigir a la página de pago, pasando los ítems del carrito y el total
    // Se recomienda usar localStorage o un contexto para pasar datos complejos
    // o una ruta dinámica si los datos son pequeños y seguros para la URL.
    // Para este caso, simularemos una redirección simple a la página de pago.
    // La página de pago (`src/app/pago/page.jsx`) se encargará de recolectar
    // los detalles de pago y llamar a `procesarPagoYCrearPedido`.

    // Guardar los datos del carrito en localStorage para que la página de pago los recupere
    localStorage.setItem('currentCartItems', JSON.stringify(cartItems));
    localStorage.setItem('currentCartTotal', JSON.stringify(totalConEnvio));

    router.push("/pago"); // Redirigir a la página de pago
  };

  const totalAPagar = getTotal(); // Renamed from totalConEnvio

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
      {error && ( // Display error message if present
        <div className="bg-red-500 text-white p-3 rounded-md mb-4 text-center">
          {error.message}
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
          {/* Envío section removed as per user request */}
          <div className="flex justify-between items-center text-white text-xl font-bold mb-6">
            <span>Total a Pagar:</span>
            <span>${totalAPagar.toFixed(2)}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <BotonGeneral onClick={handleClearCart} disabled={loading}>
              Vaciar Carrito
            </BotonGeneral>
            <BotonGeneral onClick={handleProceedToPayment} disabled={loading}>
              Proceder al Pago
            </BotonGeneral>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartComponent;
