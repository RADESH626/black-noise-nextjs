
function InputRol(props) {
    return (
        <select 
        id={props.id || "rol"} 
        name={props.name || "rol"} 
        className='
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
            overflow-hidden'
            {...props}
            >
            <option value="">Todos los roles</option>
            <option value={"CLIENTE"}>CLIENTE</option>
            <option value={"PROVEEDOR"}>PROVEEDOR</option>
            <option value={"EMPLEADO"}>EMPLEADO</option>
            <option value={"ADMINISTRADOR"}>ADMINISTRADOR</option>
        </select>
    )
}

export default InputRol
