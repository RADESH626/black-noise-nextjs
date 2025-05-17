// src/components/common/botones/BotonAgregarProveedores.jsx
import { IconoAgregarUsuario } from '../iconos';
import { BotonAccion } from './BotonAccion';

export function BotonAgregarProveedores() {
    return (
        <BotonAccion 
            texto="Registrar Proveedor"
            href="/admin/proveedores/agregar"
            tipo="info"
            icono={IconoAgregarUsuario}
        />
    );
}

export default BotonAgregarProveedores;
