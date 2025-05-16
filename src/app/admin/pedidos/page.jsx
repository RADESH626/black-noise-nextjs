// src/app/admin/pedidos/page.jsx
import Link from 'next/link';
import AdminPage from '@/components/layout/admin/AdminPage';
import SeccionAcciones from '@/components/layout/admin/secciones/acciones/SeccionAcciones';
import SeccionFooter from '@/components/layout/admin/secciones/acciones/SeccionFooter';
import SeccionHeader from '@/components/layout/admin/secciones/acciones/SeccionHeader';
import { obtenerPedidos } from '@/app/acciones/PedidoActions';
import FormFiltrarPedidos from '@/components/layout/admin/pedidos/forms/FormFiltrarPedidos';
import BotonAgregarPedidos from '@/components/common/botones/BotonAgregarPedidos';

async function PedidosAdminPage() {
    const initialPedidosResult = await obtenerPedidos();
    let serverLoadedPedidos = [];

    if (initialPedidosResult && initialPedidosResult.pedidos && Array.isArray(initialPedidosResult.pedidos)) {
        serverLoadedPedidos = initialPedidosResult.pedidos;
    } else {
        console.error("Error al cargar pedidos iniciales en page.jsx:", initialPedidosResult?.error || "No se recibió un array de pedidos.");
    }

    return (
        <AdminPage>
            <SeccionAcciones>
                <SeccionHeader>
                    <h4 className='font-bold text-2xl text-black'>Gestión de Pedidos</h4>
                </SeccionHeader>
                <SeccionFooter>
                    <Link href="/admin/pedidos/agregar" className="flex flex-row justify-center items-center gap-4">
                        <BotonAgregarPedidos />
                    </Link>
                </SeccionFooter>
            </SeccionAcciones>

            <FormFiltrarPedidos initialPedidosFromPage={serverLoadedPedidos} />
        </AdminPage>
    );
}

export default PedidosAdminPage;
