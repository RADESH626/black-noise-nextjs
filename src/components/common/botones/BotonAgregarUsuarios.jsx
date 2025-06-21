<<<<<<< HEAD
import React from 'react';
import BotonGeneral from './BotonGeneral'; // Import BotonGeneral
import IconoAgregarUsuario from "../iconos/IconoAgregarUsuario";

function BotonAgregarUsuarios({ children, onClick, type = 'button', disabled = false, className = '' }) {
    return (
        <BotonGeneral
            onClick={onClick}
            type={type}
            disabled={disabled}
            variant="primary"
            className={`flex items-center gap-2 px-4 py-2 ${className}`}
        >
            <IconoAgregarUsuario /> {children || "Agregar Nuevo Usuario"}
        </BotonGeneral>
    );
}

export default BotonAgregarUsuarios
=======
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
>>>>>>> db35ad5 (diseños login y registro)
