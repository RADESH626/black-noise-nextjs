function InputTipoDocumentoIdentidad(props) {
    return (
        <select 
        
        required 
        name="tipoDocumento" 
        id="tipoDocumento" 
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
            <option value="" disabled>selecione un tipo de documento</option>
            <option value="CC">CC</option>
            <option value="Tarjeta de Identidad">TI</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="Cédula de Extranjería">Cédula de Extranjería</option>
            <option value="Registro Civil">otro</option>
        </select>
    )
}

export default InputTipoDocumentoIdentidad
