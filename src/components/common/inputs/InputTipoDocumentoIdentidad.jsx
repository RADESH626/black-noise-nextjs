function InputTipoDocumentoIdentidad(props) {
    return (
        <select 
        name={props.name || "tipoDocumento"} 
        id={props.id || "tipoDocumento"}
        className='
            w-full
            p-3
            bg-black
            text-white
            border
            border-bn-accent
            rounded-md
            focus:outline-none
            focus:ring-1
            focus:ring-bn-accent-opaque
            focus:border-bn-accent-opaque
        '
        {...props}

        >
            <option value="">Seleccione un tipo de documento</option>
            <option value="CC">Cédula de Ciudadanía (CC)</option>
            <option value="TI">Tarjeta de Identidad (TI)</option>
            <option value="PASAPORTE">Pasaporte</option>
            <option value="CE">Cédula de Extranjería (CE)</option>
            <option value="OTRO">Otro (Ej: Registro Civil)</option> 
        </select>
    )
}

export default InputTipoDocumentoIdentidad
