"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ObtenerPedidoPorId } from "@/app/acciones/PedidoActions"; // Import the server action
import DesignImageDisplay from "@/components/common/DesignImageDisplay"; // Import for displaying images

export default function Confirmacion() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pedidoId = searchParams.get('pedidoId');

  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedido = async () => {
      if (!pedidoId) {
        setError("No se encontró el ID del pedido.");
        setLoading(false);
        router.push("/perfil"); // Redirect if no pedidoId
        return;
      }

      setLoading(true);
      setError(null);
      const { success, pedido: fetchedPedido, message } = await ObtenerPedidoPorId(pedidoId);

      if (success) {
        setPedido(fetchedPedido);
      } else {
        setError(message || "Error al cargar los detalles del pedido.");
        console.error("Error fetching order:", message);
        router.push("/perfil"); // Redirect on error
      }
      setLoading(false);
    };

    fetchPedido();

    // Redirect after a delay
    const redirectTimer = setTimeout(() => {
      router.push("/perfil"); // Redirect to user profile or orders page
    }, 10000); // Redirect after 10 seconds

    return () => clearTimeout(redirectTimer);
  }, [pedidoId, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-green-100 text-black">
        <h1 className="text-3xl font-bold mb-4">Cargando confirmación del pedido...</h1>
        <p className="text-lg">Por favor espera...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-700">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-lg">{error}</p>
        <p className="mt-4">Redirigiendo...</p>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-black">
        <h1 className="text-3xl font-bold mb-4">Pedido no encontrado.</h1>
        <p className="text-lg">Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 text-black p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">¡Pago exitoso!</h1>
      <p className="text-lg mb-6 text-center">Tu pedido ha sido confirmado.</p>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Resumen del Pedido #{pedido._id}</h2>
        {pedido.cliente && (
          <div className="mb-4">
            <p><strong>Cliente:</strong> {pedido.cliente.nombre}</p>
            <p><strong>Correo:</strong> {pedido.cliente.correo}</p>
            <p><strong>Dirección:</strong> {pedido.cliente.direccion}</p>
          </div>
        )}
        <div className="mb-4">
          <p><strong>Fecha:</strong> {new Date(pedido.fechaRealizacion).toLocaleDateString()}</p>
          <p><strong>Método de Pago:</strong> {pedido.metodoPago}</p>
          <p><strong>Estado del Pago:</strong> {pedido.estadoPago}</p>
        </div>
        <h3 className="text-lg font-semibold mb-2">Productos:</h3>
        <ul className="list-disc list-inside mb-4">
          {pedido.items && pedido.items.map((item, index) => (
            <li key={index} className="flex items-center mb-2">
              {item.designId && item.designId.imageData && item.designId.imageMimeType && (
                <DesignImageDisplay
                  imageData={item.designId.imageData}
                  imageMimeType={item.designId.imageMimeType}
                  alt={item.designId.nombreDesing}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
              )}
              <div>
                {item.designId?.nombreDesing} (x{item.quantity}) - ${item.price.toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
        <p className="text-xl font-bold text-right">Total: ${pedido.total.toFixed(2)}</p>
      </div>

      <p className="mt-8 text-lg text-center">Redirigiendo a tu perfil en breve...</p>
    </div>
  );
}
