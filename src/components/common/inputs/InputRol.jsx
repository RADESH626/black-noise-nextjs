import React from 'react'

function InputRol() {
    return (
        <select id="rol" name="rol" className='w-full 
            p-3 
            border
            border-bn-accent
            rounded-md
            focus:outline-none
            focus:ring-1
            focus:ring-bn-accent-opaque
            focus:border-bn-accent-opaque
            placeholder:text-bn-accent}
            overflow-hidden'>
            <option value="">Todos</option>
            <option>CLIENTE</option>
            <option>PROVEEDOR</option>
            <option>EMPLEADO</option>
            <option>ADMINISTRADOR</option>
        </select>
    )
}

export default InputRol