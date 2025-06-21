"use client";

import React from 'react';

<<<<<<< HEAD
function BotonGeneral({ children, onClick, type = 'button', disabled = false, className = '', variant = 'primary' }) {
    const baseStyles = `px-8 py-2 font-semibold rounded-[20px] transition duration-300 ${className}`;
    let variantStyles = '';
    let textStyles = '';

    switch (variant) {
        case 'primary':
            variantStyles = 'btn-gradient-primary';
            // textStyles = 'text-white';
            break;
        case 'secondary':
            variantStyles = 'btn-gradient-gray-to-white';
            textStyles = 'text-black';
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
            textStyles = 'text-white';
            break;
        default:
            variantStyles = 'btn-gradient-primary';
            textStyles = 'text-white';
            break;
    }

    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

=======
function BotonGeneral({ children, onClick, type = 'button', disabled = false, className = '' }) {
>>>>>>> db35ad5 (diseños login y registro)
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
<<<<<<< HEAD
            className={`${baseStyles} ${variantStyles} ${textStyles} ${disabledStyles}`}
=======
            className={`px-8 py-2 bg-gradient-to-r from-[#000000] to-[#000000] text-white font-semibold 
            ${!disabled ? 'hover:from-[#000000] hover:to-[#000000]' : 'opacity-50 cursor-not-allowed'} 
            rounded-[20px] transition duration-300 ${className}`}
>>>>>>> db35ad5 (diseños login y registro)
        >
            {children}
        </button>
    );
}

export default BotonGeneral;
