"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminPage from '../AdminLayout';
import SeccionAcciones from '../secciones/acciones/SeccionAcciones';
import SeccionFooter from '../secciones/acciones/SeccionFooter';
import SeccionHeader from '../secciones/acciones/SeccionHeader';
import { obtenerVentas } from '@/app/acciones/VentaActions.js';
import FormFiltrarVentas from './ventas/FormFiltrarVentas';
import BotonAgregarVentas from '../../../common/botones/BotonAgregarVentas';

function VentasDashboard() {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchVentas() {
            try {
                setLoading(true);
                const initialVentasResult = await obtenerVentas();
                if (initialVentasResult && initialVentasResult.ventas && Array.isArray(initialVentasResult.ventas)) {
                    setVentas(initialVentasResult.ventas);
                } else {
                    setError(initialVentasResult?.error || "No se recibió un array de ventas.");
                    console.error("Error al cargar ventas en VentasDashboard.jsx:", initialVentasResult?.error || "No se recibió un array de ventas.");
                }
            } catch (err) {
                setError(err.message);
                console.error("Error fetching ventas:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchVentas();
    }, []);

    if (loading) {
        return <p>Cargando ventas...</p>;
    }

    if (error) {
        return <p>Error al cargar ventas: {error}</p>;
    }

    return (
        <AdminPage>
            <SeccionAcciones>
                <SeccionHeader>
                    <h4 className='font-bold text-2xl text-black'>Gestión de Ventas</h4>
                </SeccionHeader>
                <SeccionFooter>
                    <Link href="/admin/ventas/agregar" className="flex flex-row justify-center items-center gap-4">
                        <BotonAgregarVentas />
                    </Link>
                </SeccionFooter>
            </SeccionAcciones>

            <FormFiltrarVentas initialVentasFromPage={ventas} />
        </AdminPage>
    );
}

export default VentasDashboard;
