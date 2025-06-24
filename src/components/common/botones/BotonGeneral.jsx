"use client";

import React from 'react';

function BotonGeneral({ children, onClick, type = 'button', disabled = false, className = '', variant = 'primary', textColor = '' }) {
    const baseStyles = `px-8 py-2 font-semibold rounded-[20px] transition duration-300`;
    let variantStyles = '';
    let defaultTextColor = '';

    switch (variant) {
        case 'primary':
            variantStyles = 'bg-black';
            defaultTextColor = 'text-white';
            break;
        case 'secondary':
            variantStyles = 'bg-gray-700';
            defaultTextColor = 'text-white';
            break;
        case 'danger':
            variantStyles = 'bg-gray-800';
            defaultTextColor = 'text-white';
            break;
        case 'success':
            variantStyles = 'bg-gray-600';
            defaultTextColor = 'text-white';
            break;
        case 'info':
            variantStyles = 'bg-gray-500';
            defaultTextColor = 'text-white';
            break;
        default:
            variantStyles = 'bg-black';
            defaultTextColor = 'text-white';
            break;
    }

    const finalTextColor = textColor || defaultTextColor;
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles} ${finalTextColor} ${className} ${disabledStyles}`}
        >
            {children}
        </button>
    );
}

export default BotonGeneral;
