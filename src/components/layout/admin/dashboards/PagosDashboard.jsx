"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SeccionHeader from '../secciones/acciones/SeccionHeader';
import { obtenerPagos } from '@/app/acciones/PagoActions.js';
import FormFiltrarPagos from './pagos/FormFiltrarPagos';
import BotonAgregarPagos from '../../../common/botones/BotonAgregarPagos';

function PagosDashboard() {
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPagos() {
            try {
                setLoading(true);
                const initialPagosResult = await obtenerPagos();
                if (initialPagosResult && initialPagosResult.pagos && Array.isArray(initialPagosResult.pagos)) {
                    setPagos(initialPagosResult.pagos);
                } else {
                    setError(initialPagosResult?.error || "No se recibió un array de pagos.");
                    console.error("Error al cargar pagos en PagosDashboard.jsx:", initialPagosResult?.error || "No se recibió un array de pagos.");
                }
            } catch (err) {
                setError(err.message);
                console.error("Error fetching pagos:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchPagos();
    }, []);

    if (loading) {
        return <p>Cargando pagos...</p>;
    }

    if (error) {
        return <p>Error al cargar pagos: {error}</p>;
    }

    return (
        <>
            <SeccionHeader>
                <h4 className='font-bold text-2xl text-black'>Gestión de Pagos</h4>
                <Link href="/admin/pagos/agregar" className="flex flex-row justify-center items-center gap-4">
                    <BotonAgregarPagos />
                </Link>
            </SeccionHeader>

            <FormFiltrarPagos initialPagosFromPage={pagos} />
        </>
    );
}

export default PagosDashboard;
