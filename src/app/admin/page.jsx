"use client";

import UsuariosDashboard from '@/components/layout/admin/dashboards/users/UsuariosClientPage';
import PedidosDashboard from '@/components/layout/admin/dashboards/PedidosDashboard';

const AdminDashboardPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Bienvenido al Panel de Administrador</h1>
            <p className="text-gray-600 mb-8">Aquí se mostrará el contenido principal del dashboard.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <UsuariosDashboard />
                <PedidosDashboard />
            </div>
        </div>
    );
};

export default AdminDashboardPage;
