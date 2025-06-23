"use client";

import React from 'react';
import BotonGeneral from './BotonGeneral';

export function BotonDescargar({ children, onClick, type = 'button', disabled = false, className = '' }) {
    return (
        <BotonGeneral
            type={type}
            onClick={onClick}
            disabled={disabled}
            variant="secondary"
            className={`bg-gradient-to-r from-[#FFFFFF] to-[#3656e2] 
            ${!disabled ? 'hover:from-[#4866ec] hover:to-[#FFFFFF]' : ''} 
            ${className}`}
        >
            {children}
        </BotonGeneral>
    );
}

export default BotonDescargar;
