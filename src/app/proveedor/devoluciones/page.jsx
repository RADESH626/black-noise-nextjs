"use client";

import { useState, useEffect } from 'react';
import { obtenerDevolucionesYCancelacionesProveedor } from '@/app/acciones/PedidoActions';
import LoadingSpinner from '@/components/common/LoadingSpinner';

function SupplierReturnsAndCancellationsPage() {
  const [pedidos, setPedidos] = useState([]); // Cambiado a 'pedidos' para incluir devoluciones y cancelaciones
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await obtenerDevolucionesYCancelacionesProveedor();
        if (result.success) {
          setPedidos(result.data);
        } else {
          console.error('Error al obtener devoluciones y cancelaciones:', result.error);
          setPedidos([]); // Asegurarse de que el estado esté vacío en caso de error
        }
      } catch (error) {
        console.error('Error inesperado al obtener datos:', error);
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Devoluciones y Cancelaciones</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Listado de Peticiones</h2>
        {pedidos.length > 0 ? (
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">ID de Pedido</th>
                <th className="px-4 py-2">Correo del Usuario</th>
                <th className="px-4 py-2">Motivo</th>
                <th className="px-4 py-2">Fecha de Petición</th>
                <th className="px-4 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((item) => (
                <tr key={item._id} className="hover:bg-gray-200">
                  <td className="border px-4 py-2">{item._id}</td>
                  <td className="border px-4 py-2">{item.userEmail}</td>
                  <td className="border px-4 py-2">{item.motivo_devolucion || item.razon_cancelacion || 'N/A'}</td>
                  <td className="border px-4 py-2">{item.fechaPeticion ? new Date(item.fechaPeticion).toLocaleDateString('es-ES') : 'N/A'}</td>
                  <td className="border px-4 py-2">{item.estadoPedido}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay peticiones de devoluciones o cancelaciones.</p>
        )}
      </section>

    </div>
  );
}

export default SupplierReturnsAndCancellationsPage;
