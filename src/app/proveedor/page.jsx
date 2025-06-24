//

"use client";

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import { obtenerMiPerfilProveedor, obtenerMetricasProveedor } from '@/app/acciones/ProveedorActions';
import { obtenerPedidosPorProveedorId } from '@/app/acciones/ProveedorPedidoActions';
import DevolucionesProveedor from '@/components/proveedor/DevolucionesProveedor';
function ProveedorPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Use useQuery to fetch supplier profile data
    const { data: miPerfil, isLoading: isLoadingPerfil, isError: isErrorPerfil, error: errorPerfil } = useQuery({
        queryKey: ['miPerfilProveedor', session?.user?.id], // Use session.user.id for the profile query
        queryFn: async () => {
            const result = await obtenerMiPerfilProveedor();
            if (result.success) {
                return result.proveedor;
            } else {
                throw new Error(result.message || "Error al cargar el perfil del proveedor.");
            }
        },
        enabled: status === "authenticated" && !!session?.user?.id, // Only run query if authenticated and user ID is available
        staleTime: Infinity,
        cacheTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
    });

    // Use useQuery to fetch additional supplier metrics
    const { data: proveedorMetrics, isLoading: isLoadingProveedorMetrics, isError: isErrorProveedorMetrics, error: errorProveedorMetrics } = useQuery({
        queryKey: ['proveedorMetrics', miPerfil?._id],
        queryFn: async () => {
            const result = await obtenerMetricasProveedor(miPerfil._id);
            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.error || "Error al cargar las métricas del proveedor.");
            }
        },
        enabled: status === "authenticated" && !!miPerfil?._id,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
    });

    // Use useQuery to fetch orders data, dependent on miPerfil being loaded
    const { data: pedidos, isLoading: isLoadingPedidos, isError: isErrorPedidos, error: errorPedidos } = useQuery({
        queryKey: ['pedidosProveedor', miPerfil?._id], // Use miPerfil._id for orders query
        queryFn: async () => {
            const result = await obtenerPedidosPorProveedorId({ proveedorId: miPerfil._id });
            if (result.success) {
                return result.pedidos;
            } else {
                throw new Error(result.message || "Error al cargar los pedidos del proveedor.");
            }
        },
        enabled: status === "authenticated" && !!miPerfil?._id, // Only run if authenticated and miPerfil._id is available
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
    });

    // Handle session loading/unauthenticated states first
    if (status === "loading") {
        return <LoadingSpinner />;
    }

    if (!session || !session.user || !session.user.isSupplier) {
        router.push("/login");
        return null;
    }

    // Render logic for authenticated suppliers
    if (isLoadingPerfil || isLoadingPedidos || isLoadingProveedorMetrics) {
        return <LoadingSpinner />;
    }

    if (isErrorPerfil) {
        return <ErrorMessage message={errorPerfil.message || "Error al cargar el perfil del proveedor."} />;
    }

    if (isErrorPedidos) {
        return <ErrorMessage message={errorPedidos.message || "Error al cargar los pedidos del proveedor."} />;
    }

    if (isErrorProveedorMetrics) {
        return <ErrorMessage message={errorProveedorMetrics.message || "Error al cargar las métricas adicionales del proveedor."} />;
    }

    // If session exists and user is a supplier, but profile not loaded (e.g., not found after fetch attempt)
    if (!miPerfil) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">Portal de Proveedores</h1>
                <p className="text-red-500 text-lg">No se pudo cargar tu perfil de proveedor. Por favor, contacta al administrador.</p>
            </div>
        );
    }

    // Calculate metrics
    const totalPedidosPendientes = pedidos?.filter(p => p.estadoPedido === 'PENDIENTE' || p.estadoPedido === 'SOLICITUD_DEVOLUCION').length || 0;
    const totalPedidosEnProceso = pedidos?.filter(p => p.estadoPedido === 'EN_FABRICACION' || p.estadoPedido === 'LISTO' || p.estadoPedido === 'ENVIADO').length || 0;
    const totalPedidosCompletados = pedidos?.filter(p => p.estadoPedido === 'ENTREGADO').length || 0;
    const ingresosTotales = pedidos
        ?.filter(p => p.estadoPedido === 'ENTREGADO' && p.estadoPago === 'PAGADO')
        .reduce((sum, p) => sum + p.total, 0) || 0;

    // Finally, render the actual content if miPerfil is available
    return (
        <div className="h-full p-4">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Portal de Proveedores</h1>

            <div className="max-w-6xl mx-auto mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-700">Métricas de Pedidos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Aquí irían los componentes de métricas específicos para proveedor si se necesitan */}
                    {/* Por ahora, se eliminan los MetricCard del administrador */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium text-gray-900">Pedidos Pendientes</h3>
                        <p className="text-2xl font-bold text-gray-800">{totalPedidosPendientes}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium text-gray-900">Pedidos en Proceso</h3>
                        <p className="text-2xl font-bold text-gray-800">{totalPedidosEnProceso}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium text-gray-900">Pedidos Completados</h3>
                        <p className="text-2xl font-bold text-gray-800">{totalPedidosCompletados}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium text-gray-900">Ingresos Totales</h3>
                        <p className="text-2xl font-bold text-gray-800">{`$${ingresosTotales.toFixed(2)}`}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium text-gray-900">Diseños Subidos</h3>
                        <p className="text-2xl font-bold text-gray-800">{proveedorMetrics.totalDesignsProveedor}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium text-gray-900">Devoluciones Pendientes</h3>
                        <p className="text-2xl font-bold text-gray-800">{proveedorMetrics.devolucionesPendientesProveedor}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-gray-100 rounded-lg shadow-lg p-6 text-center">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Mis Pedidos</h2>
                    <p className="text-gray-600 mb-6">Visualiza y gestiona los pedidos asociados a tu empresa.</p>
                    <Link href="/proveedor/pedidos">
                        <BotonGeneral>
                            Ver Pedidos
                        </BotonGeneral>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ProveedorPage;
