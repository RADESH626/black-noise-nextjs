import { obtenerDesigns } from '@/app/acciones/DesignActions';
import DesignsClientPage from '@/components/admin/designs/DesignsClientPage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { Suspense } from 'react';

export default async function AdminDesignsPage() {
    let designs = [];
    let error = null;

    try {
        const result = await obtenerDesigns();
        if (result.data) { // obtenerDesigns returns { data: [...] } or { error: ... }
            designs = result.data;
        } else {
            error = result.error || 'Error al cargar la lista de diseños.';
        }
    } catch (err) {
        console.error("Error fetching designs in Server Component:", err);
        error = 'Error de red o del servidor al cargar diseños.';
    }

    if (error) {
        return <ErrorMessage message={error} />; // Render ErrorMessage directly
    }

    return (
        <Suspense fallback={<LoadingSpinner />}> {/* Render LoadingSpinner directly */}
            <DesignsClientPage initialDesigns={designs} />
        </Suspense>
    );
}
