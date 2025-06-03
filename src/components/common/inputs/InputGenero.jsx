function InputGenero(props) {
    return (

        <select  
        name={props.name || "genero"} 
        id={props.id || "genero"}
            
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
            {...props}
        >
            <option value="">Seleccione una opción</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
            <option value="OTRO">Otro</option>




        </select>

        



    )
}

export default InputGenero
