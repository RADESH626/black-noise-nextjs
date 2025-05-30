// src/app/admin/ventas/page.jsx
import Link from 'next/link';
import AdminPage from '@/components/admin/AdminPage';
import SeccionAcciones from '@/components/admin/secciones/acciones/SeccionAcciones';
import SeccionFooter from '@/components/admin/secciones/acciones/SeccionFooter';
import SeccionHeader from '@/components/admin/secciones/acciones/SeccionHeader';
import { obtenerVentas } from '@/app/acciones/VentaActions';
import FormFiltrarVentas from '@/components/admin/ventas/forms/FormFiltrarVentas';
import BotonAgregarVentas from '@/components/common/botones/BotonAgregarVentas';

async function VentasAdminPage() {
    const initialVentasResult = await obtenerVentas();
    let serverLoadedVentas = [];

    if (initialVentasResult && initialVentasResult.ventas && Array.isArray(initialVentasResult.ventas)) {
        serverLoadedVentas = initialVentasResult.ventas;
    } else {
        console.error("Error al cargar ventas iniciales en page.jsx:", initialVentasResult?.error || "No se recibió un array de ventas.");
    }

    return (
        <AdminPage>
            <SeccionAcciones>
                <SeccionHeader>
                    <h4 className='font-bold text-2xl text-black'>Gestión de Ventas</h4>
                </SeccionHeader>
                <SeccionFooter>
                    <Link href="/admin/ventas/agregar" className="flex flex-row justify-center items-center gap-4">
                        <BotonAgregarVentas />
                    </Link>
                </SeccionFooter>
            </SeccionAcciones>

            <FormFiltrarVentas initialVentasFromPage={serverLoadedVentas} />
        </AdminPage>
    );
}

export default VentasAdminPage;
