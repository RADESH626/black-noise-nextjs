"use client";

import React, { useEffect, useState } from 'react';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import CartItem from './CartItem';
import { useSession } from "next-auth/react";
import { guardarPedido } from "@/app/acciones/PedidoActions";
import { getCartByUserId, addDesignToCart, removeDesignFromCart, updateCartItemQuantity, clearUserCart } from "@/app/acciones/CartActions"; // Import CartActions

function CartComponent() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

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

  const handleAddItem = async (designId) => {
    if (!userId) {
      alert("Debes iniciar sesión para agregar ítems al carrito.");
      return;
    }
    setIsCreatingOrder(true); // Use this for general cart operations loading
    const { success, message } = await addDesignToCart(userId, designId);
    if (success) {
      await fetchCart(); // Re-fetch cart to update UI
    } else {
      setError({ message: message || "Error al agregar el diseño al carrito." });
    }
    setIsCreatingOrder(false);
  };

  const handleRemoveItem = async (designId) => {
    if (!userId) {
      alert("Debes iniciar sesión para eliminar ítems del carrito.");
      return;
    }
    setIsCreatingOrder(true);
    const { success, message } = await removeDesignFromCart(userId, designId);
    if (success) {
      await fetchCart();
    } else {
      setError({ message: message || "Error al eliminar el diseño del carrito." });
    }
    setIsCreatingOrder(false);
  };

  const handleUpdateQuantity = async (designId, quantity) => {
    if (!userId) {
      alert("Debes iniciar sesión para actualizar la cantidad del carrito.");
      return;
    }
    if (quantity < 0) return; // Prevent negative quantities

    setIsCreatingOrder(true);
    const { success, message } = await updateCartItemQuantity(userId, designId, quantity);
    if (success) {
      await fetchCart();
    } else {
      setError({ message: message || "Error al actualizar la cantidad del diseño." });
    }
    setIsCreatingOrder(false);
  };

  const handleClearCart = async () => {
    if (!userId) {
      alert("Debes iniciar sesión para vaciar el carrito.");
      return;
    }
    setIsCreatingOrder(true);
    const { success, message } = await clearUserCart(userId);
    if (success) {
      await fetchCart();
    } else {
      setError({ message: message || "Error al vaciar el carrito." });
    }
    setIsCreatingOrder(false);
  };

  const handleCreateOrder = async () => {
    if (!userId) {
      alert("Debes iniciar sesión para crear un pedido.");
      return;
    }
    if (cartItems.length === 0) {
      alert("El carrito está vacío. Agrega diseños antes de crear un pedido.");
      return;
    }

    setIsCreatingOrder(true);
    setError(null);

    const designIds = cartItems.map(item => item.id);
    const detallesPedido = cartItems.map(item => `${item.name} (x${item.quantity})`);
    const valorTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderData = {
      usuarioId: userId,
      designIds: designIds,
      detallesPedido: detallesPedido,
      valorTotal: valorTotal,
      estado: 'PENDIENTE', // Default state
    };

    try {
      const result = await guardarPedido(orderData);
      if (result.success) {
        alert("Pedido creado exitosamente!");
        await handleClearCart(); // Clear cart after successful order creation
      } else {
        setError({ message: result.error || "Error al crear el pedido." });
      }
    } catch (err) {
      console.error("Error creating order:", err);
      setError({ message: "Error de red o del servidor al crear el pedido." });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-black p-6 md:p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">Tu Carrito de Compras</h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        ))}
      </div>
      <div className="mt-8 pt-4 border-t border-700 flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Total: ${total.toFixed(2)}</h3>
        <div className="flex space-x-4">
          <BotonGeneral 
            onClick={handleCreateOrder} 
            disabled={isCreatingOrder || cartItems.length === 0}
          >
            {isCreatingOrder ? "Creando Pedido..." : "Agregar a Pedido"}
          </BotonGeneral>
          <BotonGeneral onClick={handleClearCart} disabled={cartItems.length === 0}>
            Vaciar Carrito
          </BotonGeneral>
        </div>
      </div>
    </div>
  );
}

export default CartComponent;
