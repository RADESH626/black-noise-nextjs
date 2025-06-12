import { Boton } from './Boton';
import IconoEnviarCorreo from '../iconos/IconoEnviarCorreo';


function BotonEnviarCorreo(props) {
    return (
        <Boton
            type="button"
            variant="advertencia"
            icono={IconoEnviarCorreo}
            texto="Enviar Correo"
            {...props}
        />
    )
}

export default BotonEnviarCorreo
