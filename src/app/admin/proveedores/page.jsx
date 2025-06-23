import { obtenerProveedores } from '@/app/acciones/ProveedorActions';
import ProveedoresClientPage from '@/components/admin/proveedores/ProveedoresClientPage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { Suspense } from 'react';
import ProveedorFilters from '@/components/admin/filters/ProveedorFilters'; // Importar el componente de filtros

export default async function AdminProveedoresPage({ searchParams }) {
    const filters = {
        disponibilidad: searchParams.disponibilidad,
        especialidad: searchParams.especialidad ? searchParams.especialidad.split(',') : [],
        metodosPagoAceptados: searchParams.metodosPagoAceptados ? searchParams.metodosPagoAceptados.split(',') : [],
        habilitado: searchParams.habilitado === 'true' ? true : (searchParams.habilitado === 'false' ? false : undefined),
        ordenesActivasMin: searchParams.ordenesActivasMin,
        ordenesActivasMax: searchParams.ordenesActivasMax,
        fechaUltimaAsignacionStart: searchParams.fechaUltimaAsignacionStart,
        fechaUltimaAsignacionEnd: searchParams.fechaUltimaAsignacionEnd,
    };

    let proveedores = [];
    let error = null;

    try {
        const result = await obtenerProveedores(filters);
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
        return <ErrorMessage message={error} />;
    }

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ProveedoresClientPage initialProveedores={proveedores} currentFilters={filters} />
        </Suspense>
    );
}
