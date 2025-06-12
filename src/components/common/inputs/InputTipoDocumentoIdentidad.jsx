import React from 'react';

function InputTipoDocumentoIdentidad({ name, id, className = '', ...props }) {
    const combinedClasses = `w-full p-3 bg-neutral-800 text-secondary border border-accent1 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-accent1 focus:border-accent1 ${className}`;

    return (
        <select 
            name={name || "tipoDocumento"} 
            id={id || "tipoDocumento"}
            className={combinedClasses}
            {...props}
        >
            <option value="">Seleccione un tipo de documento</option>
            <option value="CC">Cédula de Ciudadanía (CC)</option>
            <option value="TI">Tarjeta de Identidad (TI)</option>
            <option value="PASAPORTE">Pasaporte</option>
            <option value="CE">Cédula de Extranjería (CE)</option>
            <option value="OTRO">Otro (Ej: Registro Civil)</option> 
        </select>
    );
}

export default InputTipoDocumentoIdentidad;
