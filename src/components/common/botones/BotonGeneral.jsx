"use client";

import React from 'react';

function BotonGeneral({ children, onClick, type = 'button', disabled = false, className = '', variant = 'primary' }) {
    const baseStyles = `px-8 py-2 font-semibold rounded-[20px] transition duration-300 ${className}`;
    let variantStyles = '';
    let textStyles = '';

    switch (variant) {
        case 'primary':
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
