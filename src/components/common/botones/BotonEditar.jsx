<<<<<<< HEAD
import React from 'react';
import BotonGeneral from './BotonGeneral'; // Import BotonGeneral
import { IconoEditar } from '@/components/common/iconos';

function BotonEditar({ children, onClick, type = 'button', disabled = false, className = '' }) {
    return (
        <BotonGeneral
            onClick={onClick}
            type={type}
            disabled={disabled}
            variant="info"
            className={`px-2 py-2 ${className}`}
        >
            {children || "Editar"}
            {/* <IconoEditar /> */}
        </BotonGeneral>
    );
=======
import { IconoEditar } from '@/components/common/iconos'

function BotonEditar({ children }) {
    return (
        <button
            type="submit"
            className="
            px-2 py-2
            font-semibold 
            rounded-lg 
            shadow-md 
            focus:outline-none 
            focus:ring-2 
            focus:ring-opacity-75
            bg-blue-600 
            text-white 
            hover:bg-blue-700 
            focus:ring-green-500
            "
        >
            editar
            {/* <IconoEditar /> */}
        </button>
    )
>>>>>>> db35ad5 (diseños login y registro)
}

export default BotonEditar
