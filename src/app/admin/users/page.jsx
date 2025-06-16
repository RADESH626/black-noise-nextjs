import { obtenerUsuarios } from '@/app/acciones/UsuariosActions';
import UsersClientPage from '@/components/admin/users/UsersClientPage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { Suspense } from 'react';

export default async function AdminUserManagementPage() {
    let users = [];
    let error = null;

    try {
        const result = await obtenerUsuarios();
        if (result.success) {
            users = result.users; // Assuming obtenerUsuarios returns { users: [...] }
        } else {
            error = result.message || 'Error al cargar la lista de usuarios.';
        }
    } catch (err) {
        console.error("Error fetching users in Server Component:", err);
        error = 'Error de red o del servidor al cargar usuarios.';
    }

    if (error) {
        return <ErrorMessage message={error} />; // Render ErrorMessage directly
    }

    return (
        <Suspense fallback={<LoadingSpinner />}> {/* Render LoadingSpinner directly */}
            <UsersClientPage initialUsers={users} />
        </Suspense>
    );
}
