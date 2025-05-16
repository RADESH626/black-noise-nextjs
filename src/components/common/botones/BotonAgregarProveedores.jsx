// src/components/common/botones/BotonAgregarProveedores.jsx
import Link from 'next/link';
import { IconoAgregarUsuario } from '../iconos'; // Reutilizando icono, considerar uno de "proveedor" o "tienda"

export function BotonAgregarProveedores() {
    return (
        <Link href="/admin/proveedores/agregar" legacyBehavior>
            <a className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                <IconoAgregarUsuario className="fill-current w-4 h-4 mr-2" />
                <span>Registrar Proveedor</span>
            </a>
        </Link>
    );
}

export default BotonAgregarProveedores;
