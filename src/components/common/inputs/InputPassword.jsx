import React from 'react';
import Input from './Input';

function InputPassword(props) {
    return (
        <Input 
            type="password"
            placeholder="Contraseña"
            required
            {...props} 
        />
    );
}

export default InputPassword;
