// src/components/common/botones/BotonAgregarDesigns.jsx
import Link from 'next/link';
import { IconoAgregarUsuario } from '../iconos'; // Reutilizando icono por ahora

export function BotonAgregarDesigns() {
    return (
        <Link href="/admin/designs/agregar" legacyBehavior>
            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                <IconoAgregarUsuario className="fill-current w-4 h-4 mr-2" />
                <span>Agregar Diseño</span>
            </a>
        </Link>
    );
}

export default BotonAgregarDesigns;
