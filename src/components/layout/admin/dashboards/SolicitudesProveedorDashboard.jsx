"use client";

import { useState, useEffect } from 'react';
import AdminPage from '../AdminLayout';
import SeccionAcciones from '../secciones/acciones/SeccionAcciones';
import SeccionHeader from '../secciones/acciones/SeccionHeader';
import { obtenerSolicitudesProveedor } from '@/app/acciones/SolicitudProveedorActions.js';
import FormFiltrarSolicitudesProveedor from './solicitudes-proveedor/FormFiltrarSolicitudesProveedor';
import Loader from '@/components/Loader';

function SolicitudesProveedorDashboard() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchSolicitudes() {
            try {
                setLoading(true);
                const initialSolicitudesResult = await obtenerSolicitudesProveedor();
                if (initialSolicitudesResult && initialSolicitudesResult.solicitudes && Array.isArray(initialSolicitudesResult.solicitudes)) {
                    setSolicitudes(initialSolicitudesResult.solicitudes);
                } else {
                    setError(initialSolicitudesResult?.error || "No se recibió un array de solicitudes.");
                    console.error("Error al cargar solicitudes en SolicitudesProveedorDashboard.jsx:", initialSolicitudesResult?.error || "No se recibió un array de solicitudes.");
                }
            } catch (err) {
                setError(err.message);
                console.error("Error fetching solicitudes:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchSolicitudes();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <p>Error al cargar solicitudes: {error}</p>;
    }

    return (
        <AdminPage>
            <SeccionAcciones>
                <SeccionHeader>
                    <h4 className='font-bold text-2xl text-black'>Gestión de Solicitudes de Proveedor</h4>
                </SeccionHeader>
                {/* No hay SeccionFooter con botón de agregar, ya que los admins no crean solicitudes */}
            </SeccionAcciones>

            <FormFiltrarSolicitudesProveedor initialSolicitudesFromPage={solicitudes} />
        </AdminPage>
    );
}

export default SolicitudesProveedorDashboard;
