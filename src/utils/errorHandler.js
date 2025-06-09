import { NextResponse } from 'next/server';

export const handleError = (error, message = 'An unexpected error occurred', status = 500) => {
    console.error(message, error);
    return NextResponse.json(
        { 
            error: message, 
            details: error.message || 'No additional details available' 
        }, 
        { status }
    );
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
