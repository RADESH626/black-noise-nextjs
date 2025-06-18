// src/components/common/botones/BotonAgregarPagos.jsx
import { IconoAgregarUsuario } from '../iconos';
import { BotonAccion } from './BotonAccion';

export function BotonAgregarPagos() {
    return (
        <BotonAccion 
            texto="Registrar Pago"
            href="/admin/pagos/agregar"
            tipo="advertencia"
            icono={IconoAgregarUsuario}
        />
    );
}

export default BotonAgregarPagos;
