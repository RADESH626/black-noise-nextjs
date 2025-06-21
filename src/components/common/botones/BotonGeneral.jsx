"use client";

import React from 'react';

function BotonGeneral({ children, onClick, type = 'button', disabled = false, className = '', variant = 'primary' }) {
    const baseStyles = `px-8 py-2 font-semibold rounded-[20px] transition duration-300 ${className}`;
    let variantStyles = '';
    let textStyles = '';

    switch (variant) {
        case 'primary':
<<<<<<< HEAD
            variantStyles = 'btn-gradient-primary';
            textStyles = 'text-white'; // Texto blanco para el botón primario
            break;
        case 'secondary':
            variantStyles = 'btn-gradient-gray-to-white'; // Clase CSS personalizada para el gradiente
            textStyles = 'text-white';
            break;
        case 'danger':
            variantStyles = 'btn-gradient-danger';
            textStyles = 'text-white';
            break;
        case 'success':
            variantStyles = 'btn-gradient-success';
            textStyles = 'text-white';
            break;
        case 'info':
            variantStyles = 'btn-gradient-info';
=======
            variantStyles = 'bg-gradient-primary-button';
            textStyles = 'text-white'; // Texto blanco para el botón primario
            break;
        case 'secondary':
            variantStyles = 'bg-gradient-secondary-button';
            textStyles = 'text-black';
            break;
        case 'danger':
            variantStyles = 'bg-gradient-danger-button';
            textStyles = 'text-white';
            break;
        case 'success':
            variantStyles = 'bg-gradient-success-button';
            textStyles = 'text-white';
            break;
        case 'info':
            variantStyles = 'bg-gradient-info-button';
>>>>>>> c32cb53 (primer commit)
            textStyles = 'text-white';
            break;
        default:
            variantStyles = 'bg-gradient-primary-button';
            textStyles = 'text-white';
            break;
    }

    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles} ${textStyles} ${disabledStyles}`}
        >
            {children}
        </button>
    );
}

export default BotonGeneral;
