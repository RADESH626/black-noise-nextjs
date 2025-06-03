"use client";

import React from 'react';

function BotonGeneral({ children, onClick, type = 'button', disabled = false, className = '' }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`px-8 py-2 bg-gradient-to-r from-white to-pink-500 text-black font-semibold 
            ${!disabled ? 'hover:from-pink-500 hover:to-white' : 'opacity-50 cursor-not-allowed'} 
            rounded-[20px] transition duration-300 ${className}`}
        >
            {children}
        </button>
    );
}

export default BotonGeneral;
