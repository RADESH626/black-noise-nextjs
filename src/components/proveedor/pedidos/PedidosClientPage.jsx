"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HeaderProveedor from "@/components/layout/proveedor/HeaderProveedor";
import { actualizarPedidoPorProveedor } from "@/app/acciones/ProveedorPedidoActions";
import { useDialog } from "@/context/DialogContext";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query"; // Mantener si se usa para invalidar, aunque la carga inicial no use useQuery
import { EstadoPedido } from "@/models/enums/PedidoEnums";
import { updateEstadoPedido } from "@/app/acciones/PedidoActions";

export default function PedidosClientPage({ initialPedidos }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showPopUp, showConfirmDialog } = useDialog();
  const queryClient = useQueryClient(); // Se mantiene para invalidar queries si se usa React Query en otras partes o para futuras expansiones.

  const [pedidos, setPedidos] = useState(initialPedidos);
  const [editableCostoEnvio, setEditableCostoEnvio] = useState(() => {
    const initialCostoEnvio = {};
    initialPedidos.forEach(pedido => {
      initialCostoEnvio[pedido._id.toString()] = pedido.costoEnvio || 0;
    });
    return initialCostoEnvio;
  });
  const [isUpdating, setIsUpdating] = useState({});

  useEffect(() => {
    setPedidos(initialPedidos);
    // Re-initialize editableCostoEnvio if initialPedidos change
    const newInitialCostoEnvio = {};
    initialPedidos.forEach(pedido => {
      newInitialCostoEnvio[pedido._id.toString()] = pedido.costoEnvio || 0;
    });
    setEditableCostoEnvio(newInitialCostoEnvio);
  }, [initialPedidos]);


  if (!pedidos || pedidos.length === 0) {
    return (
      <>
        <HeaderProveedor />
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Mis Pedidos</h1>
          <p className="text-gray-600">No tienes pedidos asociados en este momento.</p>
        </div>
      </>
    );
  }

  const handleCostoEnvioChange = (pedidoId, value) => {
    setEditableCostoEnvio(prev => ({
      ...prev,
      [pedidoId]: parseFloat(value) || 0
    }));
  };

  const handleUpdateCostoEnvio = async (pedidoId) => {
    setIsUpdating(prev => ({ ...prev, [pedidoId]: true }));
    try {
      const costo = editableCostoEnvio[pedidoId];
      const result = await actualizarPedidoPorProveedor(pedidoId, session.user.proveedorId, { costoEnvio: costo });
      if (result.success) {
        showPopUp("Costo de envío actualizado exitosamente!", "success");
        // Actualizar el estado local de pedidos para reflejar el cambio sin recargar toda la página
        setPedidos(prevPedidos =>
          prevPedidos.map(pedido =>
            pedido._id.toString() === pedidoId ? { ...pedido, costoEnvio: costo } : pedido
          )
        );
        // Si se usara React Query para refetching en el cliente, se invalidaría aquí:
        // queryClient.invalidateQueries(['supplierOrders', session.user.proveedorId]);
      } else {
        showPopUp(result.message || "Error al actualizar el costo de envío.", "error");
      }
    } catch (err) {
      console.error("Error updating shipping cost:", err);
      showPopUp("Error al actualizar el costo de envío. Inténtalo de nuevo.", "error");
    } finally {
      setIsUpdating(prev => ({ ...prev, [pedidoId]: false }));
    }
  };

  return (
    <>
      <HeaderProveedor />
      <div>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Mis Pedidos</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700">
              <tr suppressHydrationWarning={true}>
                <th className="py-3 px-4 text-left">ID Pedido</th>
                <th className="py-3 px-4 text-left">Usuario</th>
                <th className="py-3 px-4 text-left">Diseños</th>
                <th className="py-3 px-4 text-left">Método de Entrega</th>
                <th className="py-3 px-4 text-left">Costo de Envío</th>
                <th className="py-3 px-4 text-left">Estado del Pedido</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {pedidos.map((pedido) => (
                <tr key={pedido._id} className="border-b border-gray-200 hover:bg-gray-100" suppressHydrationWarning={true}>
                  <td className="py-3 px-4">{pedido._id.toString()}</td>
                  <td className="py-3 px-4">{pedido.userId?.Nombre || 'N/A'}</td>
                  <td className="py-3 px-4">
                    {pedido.items && pedido.items.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {pedido.items.map((item, index) => (
                          <li key={index}>{item.designId?.nombreDesing || 'Diseño Desconocido'} (x{item.quantity})</li>
                        ))}
                      </ul>
                    ) : 'N/A'}
                  </td>
                  <td className="py-3 px-4">{pedido.metodoEntrega || 'N/A'}</td>
                  <td className="py-3 px-4">
                    {pedido.metodoEntrega === 'DOMICILIO' ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={editableCostoEnvio[pedido._id.toString()]}
                          onChange={(e) => handleCostoEnvioChange(pedido._id.toString(), e.target.value)}
                          className="w-24 p-1 border rounded text-gray-700"
                          placeholder="Costo"
                        />
                        <button
                          onClick={() => handleUpdateCostoEnvio(pedido._id.toString())}
                          disabled={isUpdating[pedido._id.toString()] || editableCostoEnvio[pedido._id.toString()] === pedido.costoEnvio}
                          className={`bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm ${isUpdating[pedido._id.toString()] || editableCostoEnvio[pedido._id.toString()] === pedido.costoEnvio ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isUpdating[pedido._id.toString()] ? 'Guardando...' : 'Guardar'}
                        </button>
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={pedido.estadoPedido}
                      onChange={(e) => handleEstadoPedidoChange(pedido._id.toString(), e.target.value, pedido.estadoPedido)}
                      className="p-1 border rounded text-gray-700"
                    >
                      {Object.values(EstadoPedido).map((estado) => (
                        <option key={estado} value={estado}>
                          {estado.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4">${pedido.total ? pedido.total.toFixed(2) : '0.00'}</td>
                  <td className="py-3 px-4">
                    <Link href={`/proveedor/pedidos/ver/${pedido._id.toString()}`} className="text-blue-600 hover:underline">
                      Ver Detalles
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  async function handleEstadoPedidoChange(pedidoId, newEstado, oldEstado) {
    const confirmed = await showConfirmDialog(
      `¿Estás seguro de que quieres cambiar el estado del pedido a "${newEstado.replace(/_/g, ' ')}"?`
    );

    if (confirmed) {
      setIsUpdating(prev => ({ ...prev, [pedidoId]: true }));
      try {
        const result = await updateEstadoPedido(pedidoId, newEstado);
        if (result.success) {
          showPopUp("Estado del pedido actualizado exitosamente!", "success");
          setPedidos(prevPedidos =>
            prevPedidos.map(pedido =>
              pedido._id.toString() === pedidoId ? { ...pedido, estadoPedido: newEstado } : pedido
            )
          );
        } else {
          showPopUp(result.message || "Error al actualizar el estado del pedido.", "error");
          // Revertir el select si hay un error
          setPedidos(prevPedidos =>
            prevPedidos.map(pedido =>
              pedido._id.toString() === pedidoId ? { ...pedido, estadoPedido: oldEstado } : pedido
            )
          );
        }
      } catch (err) {
        console.error("Error al actualizar el estado del pedido:", err);
        showPopUp("Error al actualizar el estado del pedido. Inténtalo de nuevo.", "error");
        // Revertir el select si hay un error
        setPedidos(prevPedidos =>
          prevPedidos.map(pedido =>
            pedido._id.toString() === pedidoId ? { ...pedido, estadoPedido: oldEstado } : pedido
          )
        );
      } finally {
        setIsUpdating(prev => ({ ...prev, [pedidoId]: false }));
      }
    } else {
      // Si el usuario cancela, el select se revertirá automáticamente porque el estado local no se actualizó
      // No es necesario hacer nada aquí, ya que el valor del select no se ha cambiado en el estado.
    }
  }
}
