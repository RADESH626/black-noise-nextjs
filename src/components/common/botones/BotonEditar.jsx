import { Boton } from './Boton';
import { IconoEditar } from '@/components/common/iconos';

function BotonEditar({ children, onClick }) {
    return (
        <Boton
            type="button"
            onClick={onClick}
            variant="primario"
            icono={IconoEditar}
            texto={children || 'Editar'}
        />
    )
}

export default BotonEditar
