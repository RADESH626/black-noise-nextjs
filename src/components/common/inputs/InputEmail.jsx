import React from 'react';
import Input from './Input';

function InputEmail(props) {
    return (
        <Input 
            type="email" 
            {...props} 
        />
    );
}

export default InputEmail;
