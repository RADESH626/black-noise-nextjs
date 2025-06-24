import { obtenerDesigns } from '@/app/acciones/DesignActions';
import DesignsClientPage from '@/components/admin/designs/DesignsClientPage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { Suspense } from 'react';
import DesignFilters from '@/components/admin/filters/DesignFilters';

export default async function AdminDesignsPage({ searchParams }) {
    const page = searchParams.page || 1;
    const limit = 9; // Number of designs per page
    let designs = [];
    let error = null;

    try {
        const result = await obtenerDesigns(page, limit, searchParams); // Pasar searchParams directamente
        if (result.data) {
            designs = result.data;
        } else {
            error = result.error || 'Error al cargar la lista de diseños.';
        }
    } catch (err) {
        console.error("Error fetching designs in Server Component:", err);
        error = 'Error de red o del servidor al cargar diseños.';
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <DesignsClientPage initialDesigns={designs} initialSearchParams={searchParams} />
        </Suspense>
    );
}
