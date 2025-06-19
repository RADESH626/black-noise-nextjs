"use client";

<<<<<<< HEAD
import UsuariosDashboard from '@/components/layout/admin/dashboards/users/UsuariosDashboard';

const AdminDashboardPage = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <h1 className="text-2xl font-bold">Bienvenido al Panel de Administrador</h1>
            <p className="ml-4 text-gray-600">Aquí se mostrará el contenido principal del dashboard.</p>
            {/* <UsuariosDashboard /> */}
        </div>
=======
import PedidosDashboard from '@/components/layout/admin/dashboards/PedidosDashboard';

const AdminDashboardPage = () => {
    return (
        <PedidosDashboard />
>>>>>>> 2090330 (correccion de errores varios)
    );
};

export default AdminDashboardPage;
