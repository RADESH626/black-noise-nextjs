// src/components/common/botones/BotonAgregarElementos.jsx
import { IconoAgregarUsuario } from '../iconos';
import { Boton } from './Boton';

export function BotonAgregarElementos() {
    return (
        <Boton 
            texto="Agregar Elemento"
            href="/admin/elementos/agregar"
            variant="exito"
            icono={IconoAgregarUsuario}
        />
    );
}

export default BotonAgregarElementos;
