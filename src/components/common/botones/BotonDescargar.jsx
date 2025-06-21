"use client";

<<<<<<< HEAD
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
=======

import React from 'react';


export function BotonDescargar({ children, onClick, type = 'button', disabled = false, className = '' }) {
    return (
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
>>>>>>> db35ad5 (diseños login y registro)
    );
}

export default BotonDescargar;
<<<<<<< HEAD
=======

>>>>>>> db35ad5 (diseños login y registro)
