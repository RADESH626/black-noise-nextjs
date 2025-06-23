import { obtenerProveedores } from '@/app/acciones/ProveedorActions';
import ProveedoresClientPage from '@/components/admin/proveedores/ProveedoresClientPage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { Suspense } from 'react';
import { useDialog } from '@/context/DialogContext'; // Import useDialog
import AddSupplierModal from '@/components/admin/proveedores/AddSupplierModal'; // Import AddSupplierModal

export default async function AdminProveedoresPage() {
    let proveedores = [];
    let error = null;

    try {
        const result = await obtenerProveedores();
        if (result.success) {
            proveedores = result.proveedores;
        } else {
            error = result.message || 'Error al cargar la lista de proveedores.';
        }
    } catch (err) {
        console.error("Error fetching suppliers in Server Component:", err);
        error = 'Error de red o del servidor al cargar proveedores.';
    }

    if (error) {
        return <ErrorMessage message={error} />; // Render ErrorMessage directly
    }

    return (
        <Suspense fallback={<LoadingSpinner />}> {/* Render LoadingSpinner directly */}
            <ProveedoresClientPage initialProveedores={proveedores} />
        </Suspense>
    );
}
