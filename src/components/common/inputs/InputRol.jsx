import React from 'react'

function InputRol() {
    return (
        <select id="rol" name="rol" className='
            w-full 
            p-3 
            border
            bg-black
            text-white
            border-bn-accent
            rounded-md
            focus:outline-none
            focus:ring-1
            focus:ring-bn-accent-opaque
            focus:border-bn-accent-opaque
            placeholder:text-bn-accent
            overflow-hidden' defaultValue={"CLIENTE"}>
            <option value={"cliente"}>CLIENTE</option>
            <option value={"PROVEEDOR"}>PROVEEDOR</option>
            <option value={"EMPLEADO"}>EMPLEADO</option>
            <option value={"ADMINISTRADOR"}>ADMINISTRADOR</option>
        </select>
    )
}

export default InputRol