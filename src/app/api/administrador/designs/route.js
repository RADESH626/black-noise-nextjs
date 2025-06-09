import Design from '@/models/Design';
import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import { createHandler, getAllHandler } from '@/utils/crudHandler';
import { handleError, ValidationError } from '@/utils/errorHandler';
import { validateRequiredFields } from '@/utils/validation';
import { withAuthorization } from '@/utils/authMiddleware';

export const GET = withAuthorization(getAllHandler(Design), 'ADMINISTRADOR');

export const POST = withAuthorization(async (request) => {
    try {
        await connectDB();
        const data = await request.json();

        // Specific validations for Design model
        validateRequiredFields(data, ['nombre', 'descripcion', 'precio', 'categoria']);

        // Use the generic createHandler
        const response = await createHandler(Design)(request);
        const responseBody = await response.json();

        return NextResponse.json(responseBody, { status: response.status });

    } catch (error) {
        const errorResponse = handleError(error, 'Error al crear el diseño');
        return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
    }
}, 'ADMINISTRADOR');
