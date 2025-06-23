"use client";

import { Suspense } from 'react';
import VentasDashboard from '@/components/layout/admin/dashboards/VentasDashboard';

const AdminVentasPage = () => {
    return (
        <Suspense fallback={<div>Cargando ventas...</div>}>
            <VentasDashboard />
        </Suspense>
    );
};

export default AdminVentasPage;
