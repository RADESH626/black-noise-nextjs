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
    if (password.length < 6) {
        throw new ValidationError('Password must be at least 6 characters long');
    }
    // Add more password complexity rules if needed
};

// You can add more specific validation functions here
