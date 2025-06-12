import React from 'react';
import Input from './Input';

function InputDocumentoIdentidad(props) {
    return (
        <Input 
            type="text" 
            pattern="[0-9]{6,12}"
            placeholder="Número de documento"
            {...props} 
        />
    );
}

export default InputDocumentoIdentidad;
