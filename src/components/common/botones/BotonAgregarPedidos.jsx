// src/components/common/botones/BotonAgregarPedidos.jsx
import Link from 'next/link';
import { IconoAgregarUsuario } from '../iconos'; // Reutilizando icono, considerar uno de "pedido" o "caja"

export function BotonAgregarPedidos() {
    return (
        <Link href="/admin/pedidos/agregar" legacyBehavior>
            <a className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                <IconoAgregarUsuario className="fill-current w-4 h-4 mr-2" />
                <span>Crear Pedido</span>
            </a>
        </Link>
    );
}

export default BotonAgregarPedidos;
