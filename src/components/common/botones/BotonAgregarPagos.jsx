// src/components/common/botones/BotonAgregarPagos.jsx
import { IconoAgregarUsuario } from '../iconos';
import { Boton } from './Boton';

export function BotonAgregarPagos() {
    return (
        <Boton 
            texto="Registrar Pago"
            href="/admin/pagos/agregar"
            variant="advertencia"
            icono={IconoAgregarUsuario}
        />
    );
}

export default BotonAgregarPagos;
