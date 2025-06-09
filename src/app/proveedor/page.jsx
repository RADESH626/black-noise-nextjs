"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import BotonGeneral from '../../components/common/botones/BotonGeneral';
import { obtenerMiPerfilProveedor } from '../acciones/ProveedorActions';

function ProveedorPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [miPerfil, setMiPerfil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (status === "loading") return;

        // If not authenticated or not a supplier, redirect to login
        if (!session || !session.user || !session.user.isSupplier) {
            router.push("/login");
            return;
        }

        const fetchMiPerfil = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await obtenerMiPerfilProveedor(session.user.proveedorId); // Assuming this action can fetch by ID from session
                if (result.success) {
                    setMiPerfil(result.proveedor);
                } else {
                    setError(result.message || "Error al cargar el perfil del proveedor.");
                }
            } catch (err) {
                console.error("Error fetching supplier profile:", err);
                setError("Error al cargar el perfil del proveedor. Inténtalo de nuevo.");
            } finally {
                setLoading(false);
            }
        };

        if (session.user.isSupplier && session.user.proveedorId) {
            fetchMiPerfil();
        }
    }, [session, status, router]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    // If session exists and user is a supplier, but profile not loaded (e.g., not found)
    if (session?.user?.isSupplier && !miPerfil) {
        return (
            <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-4">Portal de Proveedores</h1>
                <p className="text-red-500 text-lg">No se pudo cargar tu perfil de proveedor. Por favor, contacta al administrador.</p>
            </div>
        );
    }

    // Render supplier dashboard for authenticated suppliers
    if (session?.user?.isSupplier) {
        return (
            <div className="min-h-screen bg-black text-white p-8">
                <h1 className="text-3xl font-bold mb-8 text-center">Bienvenido, {miPerfil?.nombreEmpresa || 'Proveedor'}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                        <h2 className="text-xl font-semibold mb-4">Gestión de Perfil</h2>
                        <p className="text-gray-300 mb-6">Actualiza tu información de contacto y detalles de la empresa.</p>
                        <Link href="/proveedor/editar-perfil">
                            <BotonGeneral>
                                Editar Perfil
                            </BotonGeneral>
                        </Link>
                    </div>

                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                        <h2 className="text-xl font-semibold mb-4">Mis Pedidos</h2>
                        <p className="text-gray-300 mb-6">Visualiza y gestiona los pedidos asociados a tu empresa.</p>
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

    // Fallback for non-suppliers or unauthenticated users (should be redirected by middleware)
    return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Acceso Denegado</h1>
            <p className="text-lg">No tienes permiso para acceder a esta página.</p>
            <Link href="/login" className="mt-6 text-blue-500 hover:underline">
                Volver al Login
            </Link>
        </div>
    );
}

export default ProveedorPage;
