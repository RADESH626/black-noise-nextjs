import React from 'react';
import Input from './Input';

function InputTelefono(props) {
    return (
        <Input 
            type="tel" // Changed to 'tel' for semantic correctness and mobile keypad
            pattern="[0-9]{10}"
            placeholder="Teléfono" 
            {...props} 
        />
    );
}

export default InputTelefono;
