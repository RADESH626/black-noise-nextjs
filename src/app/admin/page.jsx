"use client";

import React, { useEffect, useState } from 'react';
import MetricCard from '@/components/admin/MetricCard';
import { obtenerMetricasDashboard } from '@/app/acciones/DashboardActions';

const AdminDashboardPage = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const result = await obtenerMetricasDashboard();
                if (result.success) {
                    setMetrics(result.data);
                } else {
                    setError(result.error);
                }
            } catch (err) {
                setError('Error al cargar las métricas.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p>Cargando métricas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Panel de Administrador</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                <MetricCard title="Total de Usuarios" value={metrics.totalUsuarios} />
                <MetricCard title="Total de Ventas" value={`$${metrics.totalVentas.toFixed(2)}`} />
                <MetricCard title="Pedidos Pendientes" value={metrics.pedidosPendientes} />
                <MetricCard title="Diseños Subidos" value={metrics.totalDesigns} />
                <MetricCard title="Proveedores Registrados" value={metrics.totalProveedores} />
                <MetricCard title="Pagos Pendientes" value={metrics.pagosPendientes} />
                <MetricCard title="Devoluciones Pendientes" value={metrics.devolucionesPendientes} />
            </div>
        </div>
    );
};

export default AdminDashboardPage;
