import React from 'react';

function InputRol({ name, id, className = '', ...props }) {
    const combinedClasses = `w-full p-3 bg-neutral-800 text-secondary border border-accent1 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-accent1 focus:border-accent1 ${className}`;

    return (
        <select 
            id={id || "rol"} 
            name={name || "rol"} 
            className={combinedClasses}
            {...props}
        >
            <option value="">Todos los roles</option>
            <option value={"CLIENTE"}>CLIENTE</option>
            <option value={"PROVEEDOR"}>PROVEEDOR</option>
            <option value={"EMPLEADO"}>EMPLEADO</option>
            <option value={"ADMINISTRADOR"}>ADMINISTRADOR</option>
        </select>
    );
}

export default InputRol;
