"use client";

import { useState, useEffect } from 'react';
import SeccionHeader from '../secciones/acciones/SeccionHeader';
import { obtenerMetricasDashboard } from '@/app/acciones/DashboardActions';
import Loader from '@/components/Loader';

function HomeDashboard() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMetrics() {
            try {
                setLoading(true);
                const result = await obtenerMetricasDashboard();
                if (result.success) {
                    setMetrics(result.data);
                } else {
                    setError(result.error || "Error desconocido al obtener métricas.");
                    console.error("Error al cargar métricas en HomeDashboard.jsx:", result.error);
                }
            } catch (err) {
                setError(err.message);
                console.error("Error fetching dashboard metrics:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchMetrics();
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <p>Error al cargar métricas: {error}</p>;
    }

    return (
        <>
            <SeccionHeader>
                <div className="flex justify-between items-center w-full">
                    <h4 className='font-bold text-2xl text-black'>Inicio del Panel de Administración</h4>
                </div>
            </SeccionHeader>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-100 p-4 rounded-lg shadow-md">
                    <h5 className="text-lg font-semibold text-blue-800">Ventas Totales</h5>
                    <p className="text-3xl font-bold text-blue-900">${metrics.totalVentas ? metrics.totalVentas.toFixed(2) : '0.00'}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg shadow-md">
                    <h5 className="text-lg font-semibold text-green-800">Usuarios Registrados</h5>
                    <p className="text-3xl font-bold text-green-900">{metrics.totalUsuarios}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
                    <h5 className="text-lg font-semibold text-yellow-800">Pedidos Pendientes</h5>
                    <p className="text-3xl font-bold text-yellow-900">{metrics.pedidosPendientes}</p>
                </div>
            </div>
        </>
    );
}

export default HomeDashboard;
