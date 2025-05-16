// src/components/common/botones/BotonAgregarPagos.jsx
import Link from 'next/link';
import { IconoAgregarUsuario } from '../iconos'; // Reutilizando icono por ahora, considerar uno de "dinero" o "pago"

export function BotonAgregarPagos() {
    return (
        <Link href="/admin/pagos/agregar" legacyBehavior>
            <a className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                <IconoAgregarUsuario className="fill-current w-4 h-4 mr-2" />
                <span>Registrar Pago</span>
            </a>
        </Link>
    );
}

export default BotonAgregarPagos;
