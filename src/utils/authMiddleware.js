import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Assuming authOptions are exported from here
import { UnauthorizedError, ForbiddenError, handleError } from './errorHandler';
import { NextResponse } from 'next/server';
// import logger from './logger'; // Removed logger import

export const authorize = (requiredRole) => async (request, context) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            // logger.warn('Authorization failed: No session or user found.'); // Removed logging
            throw new UnauthorizedError('Authentication required');
        }

        // logger.info(`Authorization check: User role is '${session.user.rol}', Required role is '${requiredRole}'.`); // Removed logging

        if (requiredRole && session.user.rol !== requiredRole) { // Use session.user.rol
            throw new ForbiddenError(`Access denied. Requires ${requiredRole} role.`);
        }

        // Attach session to context if needed for further processing in the handler
        // context.session = session; // This might require modifying Next.js route handler signature or passing it explicitly

        return { success: true, session }; // Return success and session if authorized
    } catch (error) {
        if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
            return { success: false, response: handleError(error, error.message, error.statusCode) };
        }
        return { success: false, response: handleError(error, 'Authorization failed') };
    }
};

// Wrapper for API route handlers to enforce authorization
export const withAuthorization = (handler, requiredRole) => async (request, context) => {
    const authResult = await authorize(requiredRole)(request, context);

    if (!authResult.success) {
        return authResult.response; // Return the error response from authorize
    }

    // If authorization is successful, proceed with the original handler
    return handler(request, context);
};
