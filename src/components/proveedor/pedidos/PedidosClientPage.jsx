"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import HeaderProveedor from "@/components/layout/proveedor/HeaderProveedor";
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
  const [expandedOrders, setExpandedOrders] = useState(new Set()); // Estado para controlar los pedidos expandidos
  const [expandedDesigns, setExpandedDesigns] = useState(new Set()); // Nuevo estado para controlar los diseños expandidos

  useEffect(() => {
    setPedidos(initialPedidos);
    // Re-initialize editableCostoEnvio if initialPedidos change
    const newInitialCostoEnvio = {};
    initialPedidos.forEach(pedido => {
      newInitialCostoEnvio[pedido._id.toString()] = pedido.costoEnvio || 0;
    });
    setEditableCostoEnvio(newInitialCostoEnvio);
  }, [initialPedidos]);

  const handleToggleExpand = (pedidoId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pedidoId)) {
        newSet.delete(pedidoId);
      } else {
        newSet.add(pedidoId);
      }
      return newSet;
    });
  };

  const handleToggleDesignExpand = (designId) => {
    setExpandedDesigns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(designId)) {
        newSet.delete(designId);
      } else {
        newSet.add(designId);
      }
      return newSet;
    });
  };

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
          setPedidos(prevPedidos =>
            prevPedidos.map(pedido =>
              pedido._id.toString() === pedidoId ? { ...pedido, estadoPedido: oldEstado } : pedido
            )
          );
        }
      } catch (err) {
        console.error("Error al actualizar el estado del pedido:", err);
        showPopUp("Error al actualizar el estado del pedido. Inténtalo de nuevo.", "error");
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

  return (
    <>
      {/* <HeaderProveedor /> */}
      <div>
        <h1 className="text-2xl font-bold mb-4 text-gray-800 p-2">Mis Pedidos</h1>

        {pedidos && pedidos.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600">No tienes pedidos asociados en este momento.</p>
          </div>
        ) : (

          <div className="w-full h-full ">


            <div className="overflow-x-auto bg-white p-4  shadow-md">
              {/* lista de pedidos */}
              <div className="grid grid-cols-1 gap-4">

                {/* item de la lista de pedidos */}

                {pedidos.map((pedido) => (
                  <div key={pedido._id} className=" flex flex-col bg-gray-400 rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all duration-200 gap-4" suppressHydrationWarning={true}>
                    {/* Sección de Resumen */}

                    <div
                      className="flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer"
                      onClick={() => handleToggleExpand(pedido._id.toString())}
                    >
                      <h2 className="text-lg font-semibold text-white bg-gray-600 p-2 rounded">Pedido ID: {pedido._id.toString()}</h2>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${pedido.estadoPedido === EstadoPedido.PENDIENTE ? 'bg-yellow-100 text-yellow-800' :
                          pedido.estadoPedido === EstadoPedido.ASIGNADO ? 'bg-blue-100 text-blue-800' :
                            pedido.estadoPedido === EstadoPedido.EN_PROCESO ? 'bg-purple-100 text-purple-800' :
                              pedido.estadoPedido === EstadoPedido.LISTO_PARA_RECOGER ? 'bg-green-100 text-green-800' :
                                pedido.estadoPedido === EstadoPedido.ENVIADO ? 'bg-indigo-100 text-indigo-800' :
                                  pedido.estadoPedido === EstadoPedido.ENTREGADO ? 'bg-teal-100 text-teal-800' :
                                    pedido.estadoPedido === EstadoPedido.CANCELADO ? 'bg-red-100 text-red-800' :
                                      'bg-gray-100 text-gray-800'
                          }`}>
                          {pedido.estadoPedido.replace(/_/g, ' ')}
                        </span>

                        <svg
                          className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${expandedOrders.has(pedido._id.toString()) ? 'rotate-180' : ''
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>

                    {/* Sección de Detalles (condicional) */}
                    {expandedOrders.has(pedido._id.toString()) && (

                      <div className="flex flex-col  gap-2">

                        <div className="flex gap-4">

                          {/* informacion basica del pedido */}
                          <div className="flex flex-col  gap-2 bg-gray-500 text-white rounded p-2">

                            <div>
                              <p className="font-medium">Usuario:</p>
                              <p>{pedido.userId?.Nombre || 'N/A'}</p>
                            </div>
                            {pedido.userId?.direccion && (
                              <div>
                                <p className="font-medium">Dirección:</p>
                                <p>{pedido.userId.direccion}</p>
                              </div>
                            )}

                            <div>
                              <p className="font-medium">Total:</p>
                              <p className="text-xl font-bold text-green-500">${pedido.total ? pedido.total.toFixed(2) : '0.00'}</p>
                            </div>
                            <div>
                              <p className="font-medium">Método de Entrega:</p>
                              <p>{pedido.metodoEntrega || 'N/A'}</p>
                            </div>

                            {pedido.fechaPedido && (
                              <div>
                                <p className="font-medium">Fecha del Pedido:</p>
                                <p>{new Date(pedido.fechaPedido).toLocaleDateString()}</p>
                              </div>
                            )}

                          </div>


                          {/* Información de los diseños */}
                          <div className="flex flex-col flex-1 gap-2 bg-gray-500 rounded-md">

                            <p className="font-medium text-white mb-2 text-center">Diseños:</p>

                            {pedido.items && pedido.items.length > 0 ? (
                              <div className="flex flex-col p-2 rounded-md gap-4">
                                {pedido.items.map((item, index) => (
                                  <div key={index} className="flex flex-col bg-gray-400 rounded-md p-2">
                                    <div
                                      className="flex items-center space-x-3 cursor-pointer"
                                      onClick={() => handleToggleDesignExpand(item.designId?._id?.toString() || `design-${index}`)}
                                    >
                                      {item.designId?.imagen && (
                                        <img
                                          src={item.designId.imagen}
                                          alt={item.designId.nombreDesing || 'Diseño'}
                                          className="w-12 h-12 object-cover rounded-md"
                                        />
                                      )}
                                      <div>
                                        <p className="font-semibold">{item.designId?.nombreDesing || 'Diseño Desconocido'}</p>
                                        <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                                      </div>
                                      <svg
                                        className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${expandedDesigns.has(item.designId?._id?.toString() || `design-${index}`) ? 'rotate-180' : ''
                                          }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                      </svg>
                                    </div>
                                    {expandedDesigns.has(item.designId?._id?.toString() || `design-${index}`) && (
                                      <div className="mt-2 text-sm text-gray-700 bg-gray-300 p-2 rounded-md">
                                        <p><span className="font-medium">Categoría:</span> {item.designId?.categoria || 'N/A'}</p>
                                        <p><span className="font-medium">Precio Unitario:</span> ${item.designId?.precioUnitario ? item.designId.precioUnitario.toFixed(2) : '0.00'}</p>
                                        <p><span className="font-medium">Descripción:</span> {item.designId?.descripcion || 'N/A'}</p>
                                        {/* Agrega más detalles del diseño aquí si son relevantes */}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-600">No hay diseños asociados.</p>
                            )}
                          </div>

                        </div>


                        {/* acciones del pedido */}
                        <div className="flex flex-col 
                        md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4 bg-gray-500 p-2 rounded text-black">

                          {pedido.metodoEntrega === 'DOMICILIO' && (
                            <div className="flex items-center space-x-2">
                              <label htmlFor={`costoEnvio-${pedido._id.toString()}`} className="font-medium ">Costo de Envío:</label>

                              <input
                                id={`costoEnvio-${pedido._id.toString()}`}
                                type="number"
                                min={0}
                                max={100}
                                value={editableCostoEnvio[pedido._id.toString()]}
                                onChange={(e) => handleCostoEnvioChange(pedido._id.toString(), e.target.value)}
                                className="w-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Costo"
                              />

                              <button
                                onClick={() => handleUpdateCostoEnvio(pedido._id.toString())}
                                disabled={isUpdating[pedido._id.toString()] || editableCostoEnvio[pedido._id.toString()] === pedido.costoEnvio}
                                className={`bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded-md text-sm transition-colors duration-200 ${isUpdating[pedido._id.toString()] || editableCostoEnvio[pedido._id.toString()] === pedido.costoEnvio ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {isUpdating[pedido._id.toString()] ? 'Guardando...' : 'Guardar'}
                              </button>
                            </div>
                          )}

                          <div className="flex items-center space-x-2">
                            <label htmlFor={`estadoPedido-${pedido._id.toString()}`} className="font-medium">Estado:</label>

                            <select
                              id={`estadoPedido-${pedido._id.toString()}`}
                              value={pedido.estadoPedido}
                              onChange={(e) => handleEstadoPedidoChange(pedido._id.toString(), e.target.value, pedido.estadoPedido)}
                              className="p-2 border border-gray-300 rounded-md  focus:ring-blue-500 focus:border-blue-500"
                            >
                              {Object.values(EstadoPedido).map((estado) => (
                                <option key={estado} value={estado}>
                                  {estado.replace(/_/g, ' ')}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Se elimina el Link a la página de detalles del pedido */}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );
}
