"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { obtenerPedidoPorProveedorId } from "@/app/acciones/PedidoActions";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function VerPedidoProveedorPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id: pedidoId } = React.use(params);
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || !session.user || !session.user.isSupplier) {
      router.push("/login"); // Redirect if not authenticated or not a supplier
      return;
    }

    const fetchPedido = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await obtenerPedidoPorProveedorId(pedidoId, session.user.proveedorId);
        if (result.success) {
          setPedido(result.pedido);
        } else {
          setError(result.message || "Error al cargar el pedido.");
        }
      } catch (err) {
        console.error("Error fetching supplier order:", err);
        setError("Error al cargar el pedido. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    if (session.user.isSupplier && session.user.proveedorId && pedidoId) {
      fetchPedido();
    }
  }, [session, status, router, pedidoId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!pedido) {
    return <ErrorMessage message="Pedido no encontrado o no tienes permiso para verlo." />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detalles del Pedido #{pedido._id.toString()}</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="mb-2"><strong>Fecha del Pedido:</strong> {new Date(pedido.fechaPedido).toLocaleDateString()}</p>
        <p className="mb-2"><strong>Estado:</strong> {pedido.estado}</p>
        <p className="mb-2"><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>
        <h2 className="text-xl font-semibold mt-4 mb-2">Diseños en el Pedido:</h2>
        <ul>
          {pedido.disenos.map((diseno, index) => (
            <li key={index} className="mb-2 border-b pb-2">
              <p><strong>Nombre del Diseño:</strong> {diseno.nombre}</p>
              <p><strong>Cantidad:</strong> {diseno.cantidad}</p>
              <p><strong>Precio Unitario:</strong> ${diseno.precioUnitario.toFixed(2)}</p>
              <p><strong>Subtotal:</strong> ${(diseno.cantidad * diseno.precioUnitario).toFixed(2)}</p>
            </li>
          ))}
        </ul>
        {/* Add more order details as needed, ensuring no user-specific info is displayed */}
      </div>
    </div>
  );
}
