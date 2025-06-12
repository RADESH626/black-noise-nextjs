"use client";

import React from 'react';
import Link from 'next/link';

function Boton({
    children,
    texto,
    icono: Icono,
    href,
    onClick,
    variant = 'default', // 'default' (from BotonGeneral), 'primario', 'secundario', 'peligro', 'exito', 'info', 'destacado', 'advertencia'
    type = 'button',
    disabled = false,
    className = '',
    ...props
}) {
    // Base classes common to all buttons
    const baseClasses = "font-semibold py-2 px-4 rounded-[20px] transition duration-300 inline-flex items-center justify-center";

    // Variant-specific classes
    const variantClasses = {
        default: `bg-gradient-to-r from-[#FFFFFF] to-[#3656e2] text-black 
                  ${!disabled ? 'hover:from-[#4866ec] hover:to-[#FFFFFF]' : 'opacity-50 cursor-not-allowed'}`,
        primario: `bg-blue-500 hover:bg-blue-700 text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        secundario: `bg-gray-500 hover:bg-gray-700 text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        peligro: `bg-red-500 hover:bg-red-700 text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        exito: `bg-green-500 hover:bg-green-700 text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        info: `bg-teal-500 hover:bg-teal-700 text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        destacado: `bg-purple-500 hover:bg-purple-700 text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        advertencia: `bg-yellow-500 hover:bg-yellow-700 text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    };

    const finalClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

    const content = (
        <>
            {Icono && <Icono className="fill-current w-4 h-4 mr-2" />}
            {texto && <span>{texto}</span>}
            {children}
        </>
    );

    if (href) {
        return (
            <Link href={href} passHref>
                <span
                    onClick={onClick}
                    className={finalClasses}
                    {...props}
                >
                    {content}
                </span>
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={finalClasses}
            {...props}
        >
            {content}
        </button>
    );
}

export default Boton;
