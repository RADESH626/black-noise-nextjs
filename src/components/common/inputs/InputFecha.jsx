import React from 'react'

function InputFecha(props) {
    return (
        <input type="date" 
            classnam="w-full
            p-3
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