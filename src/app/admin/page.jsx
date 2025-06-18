"use client";

import UsersTable from '@/components/layout/admin/dashboards/users/UsersTable';

const AdminDashboardPage = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-2xl font-bold">Bienvenido al Panel de Administrador</h1>
            <p className="ml-4 text-gray-600">Aquí se mostrará el contenido principal del dashboard.</p>
            <UsersTable />
        </div>
    );
};

export default AdminDashboardPage;
