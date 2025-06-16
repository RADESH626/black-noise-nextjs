"use client";

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import BotonGeneral from '@/components/common/botones/BotonGeneral';
import { obtenerMiPerfilProveedor } from '@/app/acciones/ProveedorActions';

function ProveedorPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Handle session loading/unauthenticated states first
    if (status === "loading") {
        return <LoadingSpinner />;
    }

    if (!session || !session.user || !session.user.isSupplier) {
        router.push("/login");
        return null; // Return null or a simple message while redirecting
    }

    // Use useQuery to fetch supplier profile data
    const { data: miPerfil, isLoading, isError, error } = useQuery({
        queryKey: ['miPerfilProveedor', session.user.id], // Unique key for this query, dependent on user ID
        queryFn: async () => {
            const result = await obtenerMiPerfilProveedor();
            if (result.success) {
                return result.proveedor;
            } else {
                throw new Error(result.message || "Error al cargar el perfil del proveedor.");
            }
        },
        enabled: session.user.isSupplier, // Only run query if user is a supplier
        staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
        cacheTime: 10 * 60 * 1000, // Data stays in cache for 10 minutes
        retry: 1, // Retry once on failure
    });

    // Render logic for authenticated suppliers
    if (isLoading) { // Use isLoading from useQuery
        return <LoadingSpinner />;
    }

    if (isError) { // Use isError and error from useQuery
        return <ErrorMessage message={error.message || "Error al cargar el perfil del proveedor."} />;
    }

    // If session exists and user is a supplier, but profile not loaded (e.g., not found after fetch attempt)
    if (!miPerfil) { // We are here only if not loading, no error, but miPerfil is null
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">Portal de Proveedores</h1>
                <p className="text-red-500 text-lg">No se pudo cargar tu perfil de proveedor. Por favor, contacta al administrador.</p>
            </div>
        );
    }

    // Finally, render the actual content if miPerfil is available
    return (
        <div className="h-full">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Bienvenido, {miPerfil?.nombreEmpresa || 'Proveedor'}</h1>

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
