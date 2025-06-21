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
}

export default BotonEditar
