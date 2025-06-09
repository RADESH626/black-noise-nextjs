import Design from '@/models/Design';
import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import { validateRequiredFields } from '@/utils/validation';
import { handleError, ValidationError, NotFoundError } from '@/utils/errorHandler';
import { getByIdHandler, updateHandler, deleteHandler } from '@/utils/crudHandler';
import { withAuthorization } from '@/utils/authMiddleware';

export const GET = withAuthorization(getByIdHandler(Design), 'ADMINISTRADOR');

export const PUT = withAuthorization(async (request, { params }) => {
    try {
        await connectDB();
        const { id } = params;
        const data = await request.json();

        // Specific validations for Design model update (if any, e.g., unique name)
        // For now, just basic required fields if they are being updated
        if (data.nombre) {
            validateRequiredFields(data, ['nombre']); // Ensure name is not empty if provided
        }
        // Add more specific validation if needed, e.g., unique design name

        // Use the generic updateHandler
        const response = await updateHandler(Design)(request, { params });
        const responseBody = await response.json();

        return NextResponse.json(responseBody, { status: response.status });

    } catch (error) {
        const errorResponse = handleError(error, 'Error al actualizar el diseño');
        return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
    }
}, 'ADMINISTRADOR');

export const DELETE = withAuthorization(deleteHandler(Design), 'ADMINISTRADOR');
