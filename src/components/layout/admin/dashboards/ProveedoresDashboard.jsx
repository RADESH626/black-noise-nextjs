"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminPage from '../AdminLayout';
import SeccionAcciones from '../secciones/acciones/SeccionAcciones';
import SeccionFooter from '../secciones/acciones/SeccionFooter';
import SeccionHeader from '../secciones/acciones/SeccionHeader';
import { obtenerProveedoresHabilitados } from '@/app/acciones/ProveedorActions.js';
import FormFiltrarProveedores from './proveedores/FormFiltrarProveedores';
import BotonAgregarProveedores from '../../../common/botones/BotonAgregarProveedores';

function ProveedoresDashboard() {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProveedores() {
            try {
                setLoading(true);
                const initialProveedoresResult = await obtenerProveedoresHabilitados();
                if (initialProveedoresResult && initialProveedoresResult.proveedores && Array.isArray(initialProveedoresResult.proveedores)) {
                    setProveedores(initialProveedoresResult.proveedores);
                } else {
                    setError(initialProveedoresResult?.error || "No se recibió un array de proveedores.");
                    console.error("Error al cargar proveedores en ProveedoresDashboard.jsx:", initialProveedoresResult?.error || "No se recibió un array de proveedores.");
                }
            } catch (err) {
                setError(err.message);
                console.error("Error fetching proveedores:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProveedores();
    }, []);

    if (loading) {
        return <p>Cargando proveedores...</p>;
    }

    if (error) {
        return <p>Error al cargar proveedores: {error}</p>;
    }

    return (
        <AdminPage>
            <SeccionAcciones>
                <SeccionHeader>
                    <h4 className='font-bold text-2xl text-black'>Gestión de Proveedores</h4>
                </SeccionHeader>
                <SeccionFooter>
                    <Link href="/admin/proveedores/agregar" className="flex flex-row justify-center items-center gap-4">
                        <BotonAgregarProveedores />
                    </Link>
                </SeccionFooter>
            </SeccionAcciones>

            <FormFiltrarProveedores initialProveedoresFromPage={proveedores} />
        </AdminPage>
    );
}

export default ProveedoresDashboard;
