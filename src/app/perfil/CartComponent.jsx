"use client";

import React, { useEffect, useState } from 'react';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import { useCartStorage } from "@/hooks/useCartStorage";
import { useSession } from "next-auth/react";
import { guardarPedido } from "@/app/acciones/PedidoActions";

function CartComponent() {
  const { cartItems, removeItem, updateQuantity, clearCart } = useCartStorage();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  useEffect(() => {
    setLoading(false); 
  }, []);

  const handleCreateOrder = async () => {
    if (!session?.user?.id) {
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
      usuarioId: session.user.id,
      designIds: designIds,
      detallesPedido: detallesPedido,
      valorTotal: valorTotal,
      estado: 'PENDIENTE', // Default state
    };

    try {
      const result = await guardarPedido(orderData);
      if (result.success) {
        alert("Pedido creado exitosamente!");
        clearCart(); // Clear cart after successful order creation
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

  if (loading) {
    return <div className="text-center text-white">Cargando carrito...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error al cargar el carrito: {error.message}</div>;
  }

  if (!cartItems || cartItems.length === 0) {
    return <div className="text-center text-gray-400">El carrito está vacío.</div>;
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-black p-6 md:p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">Tu Carrito de Compras</h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
              )}
              <div>
                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                <p className="text-gray-400">Precio: ${item.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                className="w-20 p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
              <BotonGeneral onClick={() => removeItem(item.id)}>
                Eliminar
              </BotonGeneral>
            </div>
          </div>
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
          <BotonGeneral onClick={clearCart} disabled={cartItems.length === 0}>
            Vaciar Carrito
          </BotonGeneral>
        </div>
      </div>
    </div>
  );
}

export default CartComponent;
