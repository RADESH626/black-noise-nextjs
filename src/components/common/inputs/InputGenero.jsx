import React from 'react';

function InputGenero({ name, id, className = '', ...props }) {
    const combinedClasses = `w-full p-3 bg-neutral-800 text-secondary border border-accent1 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-accent1 focus:border-accent1 ${className}`;

    return (
        <select  
            name={name || "genero"} 
            id={id || "genero"}
            className={combinedClasses}
            {...props}
        >
            <option value="">Seleccione una opción</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
            <option value="OTRO">Otro</option>
        </select>
    );
}

export default InputGenero;
