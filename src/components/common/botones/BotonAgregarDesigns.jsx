// src/components/common/botones/BotonAgregarDesigns.jsx
import { IconoAgregarUsuario } from '../iconos';
import { BotonAccion } from './BotonAccion';

export function BotonAgregarDesigns() {
    return (
        <BotonAccion 
            texto="Agregar Diseño"
            href="/admin/designs/agregar"
            tipo="primario"
            icono={IconoAgregarUsuario}
        />
    );
}

export default BotonAgregarDesigns;
