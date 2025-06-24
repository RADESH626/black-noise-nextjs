"use client";

import { Suspense } from 'react';
import PedidosDashboard from '@/components/layout/admin/dashboards/PedidosDashboard';

const AdminPedidosPage = () => {
    return (
        <Suspense fallback={<div>Cargando pedidos...</div>}>
            <PedidosDashboard />
        </Suspense>
    );
};

export default AdminPedidosPage;
