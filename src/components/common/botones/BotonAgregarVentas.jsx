// src/components/common/botones/BotonAgregarVentas.jsx
import { IconoAgregarUsuario } from '../iconos';
import { BotonAccion } from './BotonAccion';

export function BotonAgregarVentas() {
    return (
        <BotonAccion 
            texto="Registrar Venta"
            href="/admin/ventas/agregar"
            tipo="exito"
            icono={IconoAgregarUsuario}
        />
    );
}

export default BotonAgregarVentas;
