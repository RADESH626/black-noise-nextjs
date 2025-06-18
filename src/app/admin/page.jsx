"use client";

import UsuariosDashboard from '@/components/layout/admin/dashboards/users/UsuariosDashboard';

const AdminDashboardPage = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-2xl font-bold">Bienvenido al Panel de Administrador</h1>
            <p className="ml-4 text-gray-600">Aquí se mostrará el contenido principal del dashboard.</p>
            {/* <UsuariosDashboard /> */}
        </div>
    );
};

export default AdminDashboardPage;
