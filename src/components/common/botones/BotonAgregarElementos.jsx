// src/components/common/botones/BotonAgregarElementos.jsx
import { IconoAgregarUsuario } from '../iconos';
import { BotonAccion } from './BotonAccion';

export function BotonAgregarElementos() {
    return (
        <BotonAccion 
            texto="Agregar Elemento"
            href="/admin/elementos/agregar"
            tipo="exito"
            icono={IconoAgregarUsuario}
        />
    );
}

export default BotonAgregarElementos;
