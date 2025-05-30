// src/app/admin/pagos/page.jsx
import Link from 'next/link';
import AdminPage from '@/components/admin/AdminPage';
import SeccionAcciones from '@/components/admin/secciones/acciones/SeccionAcciones';
import SeccionFooter from '@/components/admin/secciones/acciones/SeccionFooter';
import SeccionHeader from '@/components/admin/secciones/acciones/SeccionHeader';
import { obtenerPagos } from '@/app/acciones/PagoActions';
import FormFiltrarPagos from '@/components/admin/pagos/forms/FormFiltrarPagos';
import BotonAgregarPagos from '@/components/common/botones/BotonAgregarPagos';

async function PagosAdminPage() {
    const initialPagosResult = await obtenerPagos();
    let serverLoadedPagos = [];

    if (initialPagosResult && initialPagosResult.pagos && Array.isArray(initialPagosResult.pagos)) {
        serverLoadedPagos = initialPagosResult.pagos;
    } else {
        console.error("Error al cargar pagos iniciales en page.jsx:", initialPagosResult?.error || "No se recibió un array de pagos.");
    }

    return (
        <AdminPage>
            <SeccionAcciones>
                <SeccionHeader>
                    <h4 className='font-bold text-2xl text-black'>Gestión de Pagos</h4>
                </SeccionHeader>
                <SeccionFooter>
                    <Link href="/admin/pagos/agregar" className="flex flex-row justify-center items-center gap-4">
                        <BotonAgregarPagos />
                    </Link>
                </SeccionFooter>
            </SeccionAcciones>

            <FormFiltrarPagos initialPagosFromPage={serverLoadedPagos} />
        </AdminPage>
    );
}

export default PagosAdminPage;
