import { NextResponse } from 'next/server';
import logger from './logger';

export const handleError = (error, message = 'An unexpected error occurred', status = 500, formData = null) => {
    logger.error(message, error);
    const errorResponse = {
        success: false,
        message: (error instanceof Error) ? error.message : message, // Asegura que siempre haya un mensaje
        statusCode: error.statusCode || status,
        details: error.details || null,
    };

    if (formData) {
        const dataToReturn = {};
        for (let [key, value] of formData.entries()) {
            if (key !== 'password' && key !== 'confirmPassword') {
                dataToReturn[key] = value;
            }
        }
        errorResponse.formData = dataToReturn;
    }

    // Return a plain JavaScript object instead of NextResponse.json
    return errorResponse;
};

export class CustomError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends CustomError {
    constructor(message = 'Validation Error', details = {}) {
        super(message, 400);
        this.details = details;
    }
}

export class NotFoundError extends CustomError {
    constructor(message = 'Resource Not Found') {
        super(message, 404);
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

export class ForbiddenError extends CustomError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}
