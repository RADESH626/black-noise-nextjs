"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { obtenerPedidosPorProveedorId } from "@/app/acciones/PedidoActions";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import Link from "next/link";
import HeaderProveedor from "@/components/layout/proveedor/HeaderProveedor";

export default function ListaPedidosProveedorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || !session.user || !session.user.isSupplier) {
      router.push("/login"); // Redirect if not authenticated or not a supplier
      return;
    }

    const fetchPedidos = async () => {
      setLoading(true);
      setError(null);
      console.log("Fetching orders for supplierId:", session.user.proveedorId); // Debug log
      try {
        const result = await obtenerPedidosPorProveedorId(null, session.user.proveedorId); // Pass null for pedidoId to get all orders for supplier
        console.log("Result from obtenerPedidosPorProveedorId:", result); // Debug log
        if (result && result.success) { // Added check for result existence
          setPedidos(result.pedidos);
        } else {
          setError(result ? result.message : "Error al cargar los pedidos: Respuesta indefinida."); // Improved error message
        }
      } catch (err) {
        console.error("Error fetching supplier orders list:", err);
        setError("Error al cargar los pedidos. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    if (session.user.isSupplier && session.user.proveedorId) {
      fetchPedidos();
    }
  }, [session, status, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (pedidos.length === 0) {
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

  return (
    <>
      <HeaderProveedor />
      <div>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Mis Pedidos</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">ID Pedido</th>
                <th className="py-3 px-4 text-left">Fecha</th>
                <th className="py-3 px-4 text-left">Estado</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {pedidos.map((pedido) => (
                <tr key={pedido._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-4">{pedido._id}</td>
                  <td className="py-3 px-4">{new Date(pedido.fechaPedido).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{pedido.estado}</td>
                  <td className="py-3 px-4">${pedido.total.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <Link href={`/proveedor/pedidos/ver/${pedido._id}`} className="text-blue-600 hover:underline">
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
}
