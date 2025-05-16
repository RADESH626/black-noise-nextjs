// src/app/admin/elementos/page.jsx
import Link from 'next/link';
import AdminPage from '@/components/layout/admin/AdminPage';
import SeccionAcciones from '@/components/layout/admin/secciones/acciones/SeccionAcciones';
import SeccionFooter from '@/components/layout/admin/secciones/acciones/SeccionFooter';
import SeccionHeader from '@/components/layout/admin/secciones/acciones/SeccionHeader';
import { obtenerElementosHabilitados } from '@/app/acciones/ElementoActions'; // Usar elementos habilitados por defecto
import FormFiltrarElementos from '@/components/layout/admin/elementos/forms/FormFiltrarElementos';
import BotonAgregarElementos from '@/components/common/botones/BotonAgregarElementos';

async function ElementosAdminPage() {
    const initialElementosResult = await obtenerElementosHabilitados(); // Cargar habilitados
    let serverLoadedElementos = [];

    if (initialElementosResult && initialElementosResult.elementos && Array.isArray(initialElementosResult.elementos)) {
        serverLoadedElementos = initialElementosResult.elementos;
    } else {
        console.error("Error al cargar elementos iniciales en page.jsx:", initialElementosResult?.error || "No se recibió un array de elementos.");
    }

    return (
        <AdminPage>
            <SeccionAcciones>
                <SeccionHeader>
                    <h4 className='font-bold text-2xl text-black'>Gestión de Elementos</h4>
                </SeccionHeader>
                <SeccionFooter>
                    <Link href="/admin/elementos/agregar" className="flex flex-row justify-center items-center gap-4">
                        <BotonAgregarElementos />
                    </Link>
                </SeccionFooter>
            </SeccionAcciones>

            <FormFiltrarElementos initialElementosFromPage={serverLoadedElementos} />
        </AdminPage>
    );
}

export default ElementosAdminPage;
