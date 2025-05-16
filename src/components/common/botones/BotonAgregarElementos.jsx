// src/components/common/botones/BotonAgregarElementos.jsx
import Link from 'next/link';
import { IconoAgregarUsuario } from '../iconos'; // Reutilizando icono por ahora

export function BotonAgregarElementos() {
    return (
        <Link href="/admin/elementos/agregar" legacyBehavior>
            <a className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                <IconoAgregarUsuario className="fill-current w-4 h-4 mr-2" /> {/* Considerar un icono más genérico o específico para elementos */}
                <span>Agregar Elemento</span>
            </a>
        </Link>
    );
}

export default BotonAgregarElementos;
