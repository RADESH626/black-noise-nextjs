function InputEmail(props) {
    return (
        <input type="email" id="correo" name="correo"
            className="
            w-full 
            p-3
            bg-bn-input-bg 
            text-bn-secondary 
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

export default InputEmail