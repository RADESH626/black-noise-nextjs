import IconoEnviarCorreo from '../iconos/IconoEnviarCorreo'
import BotonGeneral from './BotonGeneral';


function BotonEnviarCorreo(props) {
    return (
        <BotonGeneral
            type="button"
            variant="success"
            className="flex items-center gap-2 px-4 py-2 rounded shadow-sm"
            {...props}
        >
            <IconoEnviarCorreo className="w-5 h-5" /> Enviar Correo
        </BotonGeneral>
    )
}

export default BotonEnviarCorreo
