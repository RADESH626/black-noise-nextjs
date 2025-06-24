import { ValidationError } from './errorHandler';

export const validateRequiredFields = (data, requiredFields) => {
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
        throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
    }
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ValidationError('Invalid email format');
    }
};

export const validatePassword = (password) => {
    if (password.length < 8) {
        throw new ValidationError('La contraseña debe tener al menos 8 caracteres.');
    }
    if (!/[A-Z]/.test(password)) {
        throw new ValidationError('La contraseña debe contener al menos una letra mayúscula.');
    }
    if (!/[a-z]/.test(password)) {
        throw new ValidationError('La contraseña debe contener al menos una letra minúscula.');
    }
    if (!/[0-9]/.test(password)) {
        throw new ValidationError('La contraseña debe contener al menos un número.');
    }
    if (!/[!@#$%^&*()]/.test(password)) {
        throw new ValidationError('La contraseña debe contener al menos un carácter especial (!@#$%^&*()).');
    }
};

// You can add more specific validation functions here
