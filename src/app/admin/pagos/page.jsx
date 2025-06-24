"use client";

import { Suspense } from 'react';
import PagosDashboard from '@/components/layout/admin/dashboards/PagosDashboard';

const AdminPagosPage = () => {
    return (
        <Suspense fallback={<div>Cargando pagos...</div>}>
            <PagosDashboard />
        </Suspense>
    );
};

export default AdminPagosPage;
