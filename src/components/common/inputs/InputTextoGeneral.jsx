function InputTextoGeneral(props) {
    return (
        <input type="text" minLength="3" 
            className="
            w-full 
            p-3 
            border
            border-bn-accent
            rounded-md
            focus:outline-none
            focus:ring-1
            focus:ring-bn-accent-opaque
            focus:border-bn-accent-opaque
            placeholder:text-bn-accent
            "
            {...props}
             />
    )
}

export default InputTextoGeneral