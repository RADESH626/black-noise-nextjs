"use client";


import React from 'react';
<<<<<<< HEAD
import BotonGeneral from './BotonGeneral';
=======
>>>>>>> c32cb53 (primer commit)


export function BotonDescargar({ children, onClick, type = 'button', disabled = false, className = '' }) {
    return (
<<<<<<< HEAD
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
=======
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`px-8 py-2 bg-gradient-to-r from-[#FFFFFF] to-[#3656e2] text-black font-semibold 
            ${!disabled ? 'hover:from-[#4866ec] hover:to-[#FFFFFF]' : 'opacity-50 cursor-not-allowed'} 
            rounded-[20px] transition duration-300 ${className}`}
        >
            {children}
        </button>
>>>>>>> c32cb53 (primer commit)
    );
}

export default BotonDescargar;
<<<<<<< HEAD
=======

>>>>>>> c32cb53 (primer commit)
