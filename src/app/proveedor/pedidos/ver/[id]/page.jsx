"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { obtenerPedidosPorProveedorId } from "@/app/acciones/ProveedorPedidoActions";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { actualizarPedidoPorProveedor } from "@/app/acciones/ProveedorPedidoActions";
import { EstadoPedido } from "@/models/enums/PedidoEnums";
import { useDialog } from "@/context/DialogContext";
<<<<<<< HEAD
import BotonGeneral from '@/components/common/botones/BotonGeneral';
=======
>>>>>>> c32cb53 (primer commit)

export default function VerPedidoProveedorPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id: pedidoId } = React.use(params);
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [costoEnvio, setCostoEnvio] = useState(0);
  const [estadoPedido, setEstadoPedido] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { showDialog } = useDialog();

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
        const result = await obtenerPedidosPorProveedorId(pedidoId, session.user.proveedorId);
        if (result?.success && result?.pedido) {
          setPedido(result.pedido);
          setCostoEnvio(result.pedido.costoEnvio || 0);
          setEstadoPedido(result.pedido.estadoPedido || "");
        } else {
          setError(result?.message || "Error al cargar el pedido.");
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

  const handleUpdatePedido = async () => {
    setIsUpdating(true);
    try {
      const updateData = {
        estadoPedido: estadoPedido,
        costoEnvio: costoEnvio,
      };
      const result = await actualizarPedidoPorProveedor(pedidoId, session.user.proveedorId, updateData);
      if (result.success) {
        setPedido(result.pedido); // Update local state with the new pedido data
        showDialog({ title: "Éxito", message: "Pedido actualizado exitosamente!", type: "success" });
      } else {
        showDialog({ title: "Error", message: result.message || "Error al actualizar el pedido.", type: "error" });
      }
    } catch (err) {
      console.error("Error updating supplier order:", err);
      showDialog({ title: "Error", message: "Error al actualizar el pedido. Inténtalo de nuevo.", type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

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
        <p className="mb-2"><strong>Fecha del Pedido:</strong> {new Date(pedido.createdAt).toLocaleDateString()}</p>
        <p className="mb-2"><strong>Método de Entrega:</strong> {pedido.metodoEntrega || 'N/A'}</p>
        <p className="mb-2"><strong>Total del Pedido:</strong> ${pedido.total.toFixed(2)}</p>
        {pedido.metodoEntrega === 'DOMICILIO' && (
          <div className="mb-4">
            <label htmlFor="costoEnvio" className="block text-gray-700 text-sm font-bold mb-2">
              Costo de Envío:
            </label>
            <input
              type="number"
              id="costoEnvio"
              value={costoEnvio}
              onChange={(e) => setCostoEnvio(parseFloat(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ingrese el costo de envío"
            />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="estadoPedido" className="block text-gray-700 text-sm font-bold mb-2">
            Estado del Pedido:
          </label>
          <select
            id="estadoPedido"
            value={estadoPedido}
            onChange={(e) => setEstadoPedido(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            {Object.values(EstadoPedido).map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>
<<<<<<< HEAD
        <BotonGeneral
          onClick={handleUpdatePedido}
          disabled={isUpdating}
          variant="primary"
          className={`focus:outline-none focus:shadow-outline ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUpdating ? 'Actualizando...' : 'Actualizar Pedido'}
        </BotonGeneral>
=======
        <button
          onClick={handleUpdatePedido}
          disabled={isUpdating}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUpdating ? 'Actualizando...' : 'Actualizar Pedido'}
        </button>
>>>>>>> c32cb53 (primer commit)

        <h2 className="text-xl font-semibold mt-4 mb-2">Diseños en el Pedido:</h2>
        <ul>
          {pedido.items && pedido.items.length > 0 ? (
            pedido.items.map((item, index) => (
              <li key={index} className="mb-2 border-b pb-2">
                <p><strong>Nombre del Diseño:</strong> {item.designId?.nombreDesing || 'Diseño Desconocido'}</p>
                <p><strong>Cantidad:</strong> {item.quantity}</p>
              </li>
            ))
          ) : (
            <p>No hay diseños en este pedido.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
