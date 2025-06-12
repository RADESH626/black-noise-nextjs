import { Boton } from './Boton';
import { Icono } from '../iconos';


function BotonAgregarUsuarios(props) {
    return (
        <Boton
            type="button"
            variant="exito"
            icono={<Icono name="add-user" className="invert" />}
            texto="Agregar Nuevo Usuario"
            {...props}
        />
    )
}

export default BotonAgregarUsuarios
