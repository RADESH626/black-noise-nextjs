import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Asegúrate de que esta ruta sea correcta
import { obtenerPedidosPorProveedorId } from "@/app/acciones/ProveedorPedidoActions";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import PedidosClientPage from "@/components/proveedor/pedidos/PedidosClientPage"; // Nuevo componente cliente
import ProveedorLayout from "../layout"; // Importar el layout del proveedor

export default async function AdminProveedorPedidosPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.isSupplier) {
        redirect("/login"); // Redirigir si no está autenticado o no es proveedor
    }

    const proveedorId = session.user.proveedorId;

    if (!proveedorId) {
        console.error("Proveedor ID is missing from session for supplier user.");
        redirect("/login"); // Redirigir si el ID de proveedor no está en la sesión
    }

    let pedidos = [];
    let error = null;

    try {
        console.log("session.user.proveedorId before calling obtenerPedidosPorProveedorId:", proveedorId);
        const result = await obtenerPedidosPorProveedorId({ proveedorId: proveedorId });

        if (result.success) {
            pedidos = result.pedidos;
        } else {
            error = result.message || 'Error al cargar los pedidos del proveedor.';
        }
    } catch (err) {
        console.error("Error fetching supplier orders in Server Component:", err);
        error = 'Error de red o del servidor al cargar pedidos.';
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <PedidosClientPage initialPedidos={pedidos} />
        </Suspense>
    );
}
