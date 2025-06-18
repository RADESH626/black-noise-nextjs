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
        // Check if result has the 'usuarios' property and it's an array
        if (result && Array.isArray(result.usuarios)) {
            users = result.usuarios; // Correctly access the users array
        } else {
            // Handle cases where result is not as expected or an error occurred in the action
            error = result?.message || 'Error al cargar la lista de usuarios.';
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
