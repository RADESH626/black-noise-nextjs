import IconoEnviarCorreo from '../iconos/IconoEnviarCorreo'
<<<<<<< HEAD
import BotonGeneral from './BotonGeneral';
=======
>>>>>>> c32cb53 (primer commit)


function BotonEnviarCorreo(props) {
    return (
<<<<<<< HEAD
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
=======
        <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded shadow-sm bg-yellow-500 text-black font-bold text-base transition-colors duration-300 hover:bg-green-700"
            {...props}
        >
            <IconoEnviarCorreo className="w-5 h-5" /> Enviar Correo
        </button>
    )
}

export default BotonEnviarCorreo
>>>>>>> c32cb53 (primer commit)
