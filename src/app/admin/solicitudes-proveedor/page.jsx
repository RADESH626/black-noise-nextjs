// src/app/admin/solicitudes-proveedor/page.jsx
import AdminPage from '@/components/admin/AdminPage';
import SeccionAcciones from '@/components/admin/secciones/acciones/SeccionAcciones';
import SeccionHeader from '@/components/admin/secciones/acciones/SeccionHeader';
import { obtenerSolicitudesProveedor } from '@/app/acciones/SolicitudProveedorActions';
import FormFiltrarSolicitudesProveedor from '@/components/admin/solicitudes-proveedor/forms/FormFiltrarSolicitudesProveedor';

async function SolicitudesProveedorAdminPage() {
    const initialSolicitudesResult = await obtenerSolicitudesProveedor();
    let serverLoadedSolicitudes = [];

    if (initialSolicitudesResult && initialSolicitudesResult.solicitudes && Array.isArray(initialSolicitudesResult.solicitudes)) {
        serverLoadedSolicitudes = initialSolicitudesResult.solicitudes;
    } else {
        console.error("Error al cargar solicitudes iniciales en page.jsx:", initialSolicitudesResult?.error || "No se recibió un array de solicitudes.");
    }

    return (
        <AdminPage>
            <SeccionAcciones>
                <SeccionHeader>
                    <h4 className='font-bold text-2xl text-black'>Gestión de Solicitudes de Proveedor</h4>
                </SeccionHeader>
                {/* No hay SeccionFooter con botón de agregar, ya que los admins no crean solicitudes */}
            </SeccionAcciones>

            <FormFiltrarSolicitudesProveedor initialSolicitudesFromPage={serverLoadedSolicitudes} />
        </AdminPage>
    );
}

export default SolicitudesProveedorAdminPage;
