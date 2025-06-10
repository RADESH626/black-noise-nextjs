import { NextResponse } from 'next/server';
import logger from './logger';

export const handleError = (error, message = 'An unexpected error occurred', status = 500) => {
    logger.error(message, error);
    // Ensure that the returned object is a plain JavaScript object
    return {
        success: false,
        message: error.message || message,
        statusCode: error.statusCode || status,
        // Optionally, include more details if needed, ensuring they are serializable
        details: error.details || null, 
    };
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
