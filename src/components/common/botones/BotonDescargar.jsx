"use client";

import React from 'react';
import { Boton } from './Boton';

export function BotonDescargar({ children, onClick, type = 'button', disabled = false, className = '' }) {
    return (
        <Boton
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={className}
        >
            {children}
        </Boton>
    );
}

export default BotonDescargar;
