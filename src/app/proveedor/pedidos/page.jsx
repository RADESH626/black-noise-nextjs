"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query"; // Import useQuery
import { obtenerPedidosPorProveedorId } from "@/app/acciones/PedidoActions";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import Link from "next/link";
import HeaderProveedor from "@/components/layout/proveedor/HeaderProveedor";

export default function ListaPedidosProveedorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Use useQuery to fetch supplier orders
  const { data: pedidos, isLoading, isError, error } = useQuery({
    queryKey: ['supplierOrders', session?.user?.proveedorId], // Unique key for this query, dependent on supplier ID
    queryFn: async () => {
      if (!session?.user?.proveedorId) {
        throw new Error("Supplier ID not available.");
      }
      // Pass null for pedidoId to get all orders for supplier
      const result = await obtenerPedidosPorProveedorId(null, session.user.proveedorId);
      if (result && result.success) {
        return result.pedidos;
      } else {
        throw new Error(result ? result.message : "Error al cargar los pedidos: Respuesta indefinida.");
      }
    },
    enabled: !!session?.user?.isSupplier && !!session?.user?.proveedorId, // Only run query if user is a supplier and has a supplierId
    staleTime: Infinity, // Data is considered fresh indefinitely for diagnostic
    cacheTime: 10 * 60 * 1000, // Data stays in cache for 10 minutes
    retry: 1, // Retry once on failure
    refetchOnWindowFocus: false, // Disable refetching on window focus for diagnostic
  });

  // Handle session loading/unauthenticated states first
  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (!session || !session.user || !session.user.isSupplier) {
    router.push("/login"); // Redirect if not authenticated or not a supplier
    return null;
  }

  // Render logic
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage message={error.message || "Error al cargar los pedidos."} />;
  }

  if (!pedidos || pedidos.length === 0) { // Check if pedidos is null/undefined or empty
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
