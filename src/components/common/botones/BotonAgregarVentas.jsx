// src/components/common/botones/BotonAgregarVentas.jsx
import Link from 'next/link';
import { IconoAgregarUsuario } from '../iconos'; // Reutilizando icono, considerar uno de "venta" o "carrito"

export function BotonAgregarVentas() {
    return (
        <Link href="/admin/ventas/agregar" legacyBehavior>
            <a className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                <IconoAgregarUsuario className="fill-current w-4 h-4 mr-2" />
                <span>Registrar Venta</span>
            </a>
        </Link>
    );
}

export default BotonAgregarVentas;
