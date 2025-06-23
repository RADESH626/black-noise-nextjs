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
