
function InputFecha(props) {
    return (
        <input type="date" 
            classnam="
            h-full
            bg-bn-input-bg
            text-bn-secondary
            border
            border-bn-accent
            rounded-md
            focus:outline-none
            focus:ring-1
            focus:ring-bn-accent-opaque
            focus:border-bn-accent-opaque" 
            {...props}
            />
    )
}

export default InputFecha