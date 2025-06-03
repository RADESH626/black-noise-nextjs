import React from 'react'

function InputPassword(props) {
    return (
        <input type="password"
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
            pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$"
            placeholder="Contraseña"
            required
            {...props}
            />
    )
}

export default InputPassword