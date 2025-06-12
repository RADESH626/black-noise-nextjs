// src/components/common/botones/BotonAgregarPedidos.jsx
import { IconoAgregarUsuario } from '../iconos';
import { Boton } from './Boton';

export function BotonAgregarPedidos() {
    return (
        <Boton 
            texto="Registrar Pedido"
            href="/admin/pedidos/agregar"
            variant="destacado"
            icono={IconoAgregarUsuario}
        />
    );
}

export default BotonAgregarPedidos;
