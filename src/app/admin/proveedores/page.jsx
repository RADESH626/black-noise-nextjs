// src/app/admin/proveedores/page.jsx
import Link from 'next/link';
import AdminPage from '@/components/layout/admin/AdminPage';
import SeccionAcciones from '@/components/layout/admin/secciones/acciones/SeccionAcciones';
import SeccionFooter from '@/components/layout/admin/secciones/acciones/SeccionFooter';
import SeccionHeader from '@/components/layout/admin/secciones/acciones/SeccionHeader';
import { obtenerProveedoresHabilitados, obtenerProveedores } from '@/app/acciones/ProveedorActions'; // Usar habilitados por defecto, pero tener obtenerTodos para el filtro
import FormFiltrarProveedores from '@/components/layout/admin/proveedores/forms/FormFiltrarProveedores';
import BotonAgregarProveedores from '@/components/common/botones/BotonAgregarProveedores';

async function ProveedoresAdminPage() {
    const initialProveedoresResult = await obtenerProveedoresHabilitados();
    let serverLoadedProveedores = [];

    if (initialProveedoresResult && initialProveedoresResult.proveedores && Array.isArray(initialProveedoresResult.proveedores)) {
        serverLoadedProveedores = initialProveedoresResult.proveedores;
    } else {
        console.error("Error al cargar proveedores iniciales en page.jsx:", initialProveedoresResult?.error || "No se recibió un array de proveedores.");
    }

    return (
        <AdminPage>
            <SeccionAcciones>
                <SeccionHeader>
                    <h4 className='font-bold text-2xl text-black'>Gestión de Proveedores</h4>
                </SeccionHeader>
                <SeccionFooter>
                    <Link href="/admin/proveedores/agregar" className="flex flex-row justify-center items-center gap-4">
                        <BotonAgregarProveedores />
                    </Link>
                </SeccionFooter>
            </SeccionAcciones>

            {/* Pasamos los proveedores habilitados inicialmente, el filtro puede cargar todos si es necesario */}
            <FormFiltrarProveedores initialProveedoresFromPage={serverLoadedProveedores} />
        </AdminPage>
    );
}

export default ProveedoresAdminPage;
