import IconoAgregarUsuario from "../iconos/IconoAgregarUsuario"



function BotonAgregarUsuarios(props) {
    return (
        <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded shadow-sm bg-green-600 text-black font-bold text-base transition-colors duration-300 hover:bg-green-700 cursor-pointer"
            {...props}
        >
            <IconoAgregarUsuario /> Agregar Nuevo Usuario
        </button>
    )
}

export default BotonAgregarUsuarios