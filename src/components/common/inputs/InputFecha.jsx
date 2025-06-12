import React from 'react';
import Input from './Input';

function InputFecha(props) {
    return (
        <Input 
            type="date" 
            {...props} 
        />
    );
}

export default InputFecha;
