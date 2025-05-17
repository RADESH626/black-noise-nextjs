// src/components/common/botones/BotonAgregarPedidos.jsx
import { IconoAgregarUsuario } from '../iconos';
import { BotonAccion } from './BotonAccion';

export function BotonAgregarPedidos() {
    return (
        <BotonAccion 
            texto="Registrar Pedido"
            href="/admin/pedidos/agregar"
            tipo="destacado"
            icono={IconoAgregarUsuario}
        />
    );
}

export default BotonAgregarPedidos;
