import React from 'react'

function InputGenero() {
    return (

        <select  name="genero" id="genero"
            className="
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
            focus:border-bn-accent-opaque"
            defaultValue=""
        >
            <option value="" disabled>Seleccione una opción</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
            <option value="OTRO">Otro</option>




        </select>

        



    )
}

export default InputGenero