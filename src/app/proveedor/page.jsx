"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Rol } from '@/models/enums/usuario/Rol';
import { obtenerProveedores, obtenerMiPerfilProveedor } from '@/app/acciones/ProveedorActions';
import BotonGeneral from '@/components/common/botones/BotonGeneral';

function ProveedorPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [proveedores, setProveedores] = useState([]);
    const [miPerfil, setMiPerfil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Temporarily bypass session and data fetching for development
        setLoading(false);
        return;

        // Original logic (commented out for temporary bypass):
        // if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
        //     setLoading(false);
        //     return;
        // }

        // const fetchData = async () => {
        //     setLoading(true);
        //     setError(null);

        //     try {
        //         // Obtener lista de proveedores
        //         const result = await obtenerProveedores();
        //         if (result.error) {
        //             throw new Error(result.error);
        //         }
        //         setProveedores(result.proveedores);

        //         // Si el usuario es proveedor, obtener su perfil
        //         if (session?.user?.rol === Rol.PROVEEDOR) {
        //             const perfilResult = await obtenerMiPerfilProveedor();
        //             if (perfilResult.error) {
        //                 throw new Error(perfilResult.error);
        //             }
        //             setMiPerfil(perfilResult.proveedor);
        //         }
        //     } catch (err) {
        //         setError(err.message);
        //     } finally {
        //         setLoading(false);
        //     }
        // };

        // fetchData();
    }, [session]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-black text-white">
                Cargando...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-black text-white">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            {/* Sección principal: Lista de proveedores */}
            <div>
                <h2 className="text-2xl font-bold mb-6 text-center">Nuestros Proveedores</h2>
                {proveedores.length === 0 ? (
                    <p className="text-gray-400">No hay proveedores disponibles en este momento.</p>
                ) : (
                    <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {proveedores.map((proveedor) => (
                            <div key={proveedor._id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                                <div className="w-full h-56 bg-gray-700 relative">
                                    <img
                                        src="/public/img/proveedores/IMAGEN-SOLICITUD-PROVEEDOR.jpg"
                                        alt={proveedor.nombreProveedor}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-0 right-0 m-3">
                                        <button
                                            onClick={() => alert(`Ver detalles del proveedor: ${proveedor.nombreProveedor}`)}
                                            className="bg-white text-purple-700 font-semibold py-1 px-4 rounded-md text-sm hover:bg-gray-200 transition duration-150"
                                        >
                                            VER DETALLES
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 gradient-text-bg flex justify-between items-center text-white">
                                    <div>
                                        <p className="font-semibold">nombre: {proveedor.nombreProveedor}</p>
                                        <p className="font-semibold">especialidad: {proveedor.especialidad}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </main>
                )}
            </div>

            {/* Botón para solicitar ser proveedor (solo visible para usuarios no proveedores) */}
            {session?.user && session.user.rol !== Rol.PROVEEDOR && (
                <div className="mt-12">
                    <Link href="/proveedor/solicitud">
                        <BotonGeneral>
                            Solicitar ser Proveedor
                        </BotonGeneral>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default ProveedorPage;
