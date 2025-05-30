// src/app/admin/designs/page.jsx
import Link from 'next/link';
import AdminPage from '@/components/layout/admin/AdminPage';
import SeccionAcciones from '@/components/layout/admin/secciones/acciones/SeccionAcciones';
import SeccionFooter from '@/components/layout/admin/secciones/acciones/SeccionFooter';
import SeccionHeader from '@/components/layout/admin/secciones/acciones/SeccionHeader';
import { obtenerDesigns } from '@/app/acciones/DesignActions'; // Para la carga inicial
import FormFiltrarDesigns from '@/components/layout/admin/designs/forms/FormFiltrarDesigns';
import BotonAgregarDesigns from '@/components/common/botones/BotonAgregarDesigns';

async function DesignsAdminPage() {
    const initialDesignsResult = await obtenerDesigns();
    let serverLoadedDesigns = [];

    if (initialDesignsResult && initialDesignsResult.designs && Array.isArray(initialDesignsResult.designs)) {
        serverLoadedDesigns = initialDesignsResult.designs;
    } else {
        console.error("Error al cargar diseños iniciales en page.jsx:", initialDesignsResult?.error || "No se recibió un array de diseños.");
    }

    return (
        <AdminPage>
            <SeccionAcciones>
                <SeccionHeader>
                    <h4 className='font-bold text-2xl text-black'>Gestión de Diseños</h4>
                </SeccionHeader>
                <SeccionFooter>
                    <Link href="/admin/designs/agregar" className="flex flex-row justify-center items-center gap-4">
                        <BotonAgregarDesigns />
                    </Link>
                </SeccionFooter>
            </SeccionAcciones>

            <FormFiltrarDesigns initialDesignsFromPage={serverLoadedDesigns} />
        </AdminPage>
    );
}

export default DesignsAdminPage;
