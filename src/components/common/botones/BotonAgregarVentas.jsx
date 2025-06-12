// src/components/common/botones/BotonAgregarVentas.jsx
import { IconoAgregarUsuario } from '../iconos';
import { Boton } from './Boton';

export function BotonAgregarVentas() {
    return (
        <Boton 
            texto="Registrar Venta"
            href="/admin/ventas/agregar"
            variant="exito"
            icono={IconoAgregarUsuario}
        />
    );
}

export default BotonAgregarVentas;
