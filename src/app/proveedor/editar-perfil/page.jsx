"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FormEditarPerfilProveedor from '@/components/layout/proveedor/forms/FormEditarPerfilProveedor';
import { obtenerMiPerfilProveedor } from '@/app/acciones/ProveedorActions';
import { Rol } from '@/models/enums/usuario/Rol';

function EditarPerfilProveedorPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPerfil = async () => {
            if (status === 'loading') return;

            if (!session) {
                router.push('/login');
                return;
            }

            if (session.user.rol !== Rol.PROVEEDOR) {
                router.push('/proveedor');
                return;
            }

            try {
                const result = await obtenerMiPerfilProveedor();
                if (result.error) {
                    throw new Error(result.error);
                }
                setPerfil(result.proveedor);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPerfil();
    }, [session, status, router]);

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

    if (!perfil) {
        return (
            <div className="flex justify-center items-center h-screen bg-black text-white">
                <p className="text-red-500">No se encontró el perfil del proveedor.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
            <FormEditarPerfilProveedor perfilInicial={perfil} />
        </div>
    );
}

export default EditarPerfilProveedorPage;
