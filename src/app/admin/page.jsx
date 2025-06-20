"use client";

<<<<<<< HEAD
import UsuariosDashboard from '@/components/layout/admin/dashboards/users/UsuariosClientPage';
=======
import UsuariosClientPage from '@/components/layout/admin/dashboards/users/UsuariosClientPage';
>>>>>>> d6a2e0d28c456f0d664ba2fcb2bec0ea9e8b114d
import PedidosDashboard from '@/components/layout/admin/dashboards/PedidosDashboard';

const AdminDashboardPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Bienvenido al Panel de Administrador</h1>
            <p className="text-gray-600 mb-8">Aquí se mostrará el contenido principal del dashboard.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* <UsuariosClientPage />
                <PedidosDashboard /> */}
            </div>
        </div>
    );
};

export default AdminDashboardPage;
